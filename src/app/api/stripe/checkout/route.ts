import { NextResponse, type NextRequest } from "next/server";
import { getPlan } from "@/lib/plans";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const plan = getPlan(request.nextUrl.searchParams.get("plan"));
  if (!plan.price) return NextResponse.redirect(absoluteUrl("/dashboard"));
  if (!stripe || !plan.stripePriceId) return NextResponse.json({ error: "Stripe env not configured", plan }, { status: 503 });
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: plan.stripePriceId, quantity: 1 }],
    success_url: absoluteUrl("/dashboard?checkout=success"),
    cancel_url: absoluteUrl("/pricing?checkout=cancelled"),
    allow_promotion_codes: true,
  });
  return NextResponse.redirect(session.url || absoluteUrl("/pricing"));
}
