import Stripe from "stripe";
import { NextResponse } from "next/server";
import { api } from "../../../../../convex/_generated/api";
import { getConvexHttpClient } from "@/lib/convex-server";
import { stripe } from "@/lib/stripe";
import { planForPriceId } from "@/lib/plans";

async function syncCheckoutSession(session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email || session.customer_email;
  if (!email) return;

  const lineItems = stripe ? await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 }) : null;
  const priceId = lineItems?.data[0]?.price?.id;
  const plan = planForPriceId(priceId) ?? "free";
  const customerId = typeof session.customer === "string" ? session.customer : undefined;
  const subscriptionId = typeof session.subscription === "string" ? session.subscription : undefined;
  const convex = getConvexHttpClient();

  await convex?.mutation(api.users.updateBillingByEmail, {
    email,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscriptionId,
    plan,
  });
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET || !signature) {
    return NextResponse.json({ received: true, demo: true });
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    if (event.type === "checkout.session.completed") {
      await syncCheckoutSession(event.data.object as Stripe.Checkout.Session);
    }
    return NextResponse.json({ received: true, type: event.type });
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
}
