import Stripe from "stripe";
import { NextResponse } from "next/server";
import { api } from "../../../../../convex/_generated/api";
import { getConvexHttpClient } from "@/lib/convex-server";
import { stripe } from "@/lib/stripe";
import { planForPriceId, type PlanId } from "@/lib/plans";

function isActiveSubscription(status?: Stripe.Subscription.Status) {
  return status === "active" || status === "trialing" || status === "past_due";
}

async function priceIdFromSubscription(subscription: Stripe.Subscription) {
  return subscription.items.data[0]?.price?.id ?? null;
}

async function customerEmail(customerId?: string | null) {
  if (!stripe || !customerId) return undefined;
  const customer = await stripe.customers.retrieve(customerId).catch(() => null);
  if (!customer) return undefined;
  if (customer.deleted) return undefined;
  return customer.email ?? undefined;
}

async function syncBilling(args: {
  email?: string;
  clerkUserId?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  plan: PlanId;
}) {
  const convex = getConvexHttpClient();
  await convex?.mutation(api.users.updateBilling, args);
}

async function syncCheckoutSession(session: Stripe.Checkout.Session) {
  if (!stripe) return;
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
  const priceId = lineItems.data[0]?.price?.id;
  const plan = planForPriceId(priceId) ?? (session.metadata?.appPlan as PlanId | undefined) ?? "free";
  const customerId = typeof session.customer === "string" ? session.customer : undefined;
  const subscriptionId = typeof session.subscription === "string" ? session.subscription : undefined;
  const email = session.customer_details?.email || session.customer_email || session.metadata?.email || await customerEmail(customerId);

  await syncBilling({
    email: email || undefined,
    clerkUserId: session.metadata?.clerkUserId || undefined,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscriptionId,
    plan,
  });
}

async function syncSubscription(subscription: Stripe.Subscription) {
  const customerId = typeof subscription.customer === "string" ? subscription.customer : undefined;
  const priceId = await priceIdFromSubscription(subscription);
  const activePlan = planForPriceId(priceId) ?? (subscription.metadata?.appPlan as PlanId | undefined) ?? "free";
  const plan = isActiveSubscription(subscription.status) ? activePlan : "free";
  const email = subscription.metadata?.email || await customerEmail(customerId);

  await syncBilling({
    email: email || undefined,
    clerkUserId: subscription.metadata?.clerkUserId || undefined,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription.id,
    plan,
  });
}

export async function POST(request: Request) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe webhook env not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      await syncCheckoutSession(event.data.object as Stripe.Checkout.Session);
    }

    if (["customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted"].includes(event.type)) {
      await syncSubscription(event.data.object as Stripe.Subscription);
    }

    return NextResponse.json({ received: true, type: event.type });
  } catch (error) {
    console.error("stripe_webhook_sync_failed", { type: event.type, error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json({ error: "Webhook sync failed" }, { status: 500 });
  }
}
