import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { api } from "../../../../../convex/_generated/api";
import { billingPortalCustomerForUser } from "@/lib/billing";
import { getConvexHttpClient } from "@/lib/convex-server";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

export async function POST() {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe portal not configured" }, { status: 503 });
  }

  const { userId, getToken } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Sign in before managing billing" }, { status: 401 });
  }

  const token = await getToken({ template: "convex" }).catch(() => null);
  if (!token) {
    return NextResponse.json({ error: "Convex auth token not configured" }, { status: 503 });
  }

  const convex = getConvexHttpClient({ authToken: token });
  const appUser = await convex.query(api.users.getCurrentUser, {});
  const customerId = billingPortalCustomerForUser({ stripeCustomerId: appUser?.stripeCustomerId });

  if (!customerId) {
    return NextResponse.json({ error: "No billing customer found for this workspace" }, { status: 404 });
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: absoluteUrl("/dashboard"),
  });

  return NextResponse.json({ url: portal.url });
}
