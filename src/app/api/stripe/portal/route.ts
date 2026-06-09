import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
export async function POST(request: Request) { const { customerId } = await request.json(); if (!stripe || !customerId) return NextResponse.json({ error: "Stripe portal not configured" }, { status: 503 }); const portal = await stripe.billingPortal.sessions.create({ customer: customerId, return_url: absoluteUrl("/dashboard") }); return NextResponse.json({ url: portal.url }); }
