import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { getPlan } from "@/lib/plans";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const requestedPlan = request.nextUrl.searchParams.get("plan");
  const plan = getPlan(requestedPlan);

  if (!requestedPlan || plan.id !== requestedPlan) {
    return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
  }

  if (!plan.price) return NextResponse.redirect(absoluteUrl("/dashboard"));
  if (!stripe || !plan.stripePriceId) return NextResponse.json({ error: "Stripe env not configured", plan: plan.id }, { status: 503 });

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Sign in before starting checkout" }, { status: 401 });
  }

  const user = await currentUser().catch(() => null);
  const email = user?.primaryEmailAddress?.emailAddress;
  const metadata = {
    product: "qrspark",
    plan: plan.id,
    appPlan: plan.id,
    label: plan.name,
    clerkUserId: userId,
    email: email ?? "",
  };

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: plan.stripePriceId, quantity: 1 }],
    success_url: absoluteUrl(`/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`),
    cancel_url: absoluteUrl("/pricing?checkout=cancelled"),
    allow_promotion_codes: true,
    customer_email: email,
    metadata,
    subscription_data: { metadata },
  });

  return NextResponse.redirect(session.url || absoluteUrl("/pricing"));
}
