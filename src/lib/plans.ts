export type PlanId = "free" | "starter" | "pro" | "team";

export const plans = [
  { id: "free", name: "Free", price: 0, stripePriceId: null, headline: "Start with one trackable campaign QR", limits: { dynamic: 1, static: 10, aiCredits: 3, members: 1 }, features: ["One dynamic campaign QR", "PNG/SVG download", "Clean private workspace", "Basic scan analytics"] },
  { id: "starter", name: "Starter", price: 9, stripePriceId: process.env.STRIPE_STARTER_PRICE_ID, headline: "For solo local-business campaigns", limits: { dynamic: 3, static: -1, aiCredits: 25, members: 1 }, features: ["3 dynamic campaign QRs", "Print-ready SVG/PDF export", "Brand colors and QR styling", "Stripe-secured billing"] },
  { id: "pro", name: "Pro", price: 19, stripePriceId: process.env.STRIPE_PRO_PRICE_ID, headline: "Growth campaigns with attribution", limits: { dynamic: -1, static: -1, aiCredits: 250, members: 3 }, features: ["Unlimited dynamic QRs", "Smart redirects and A/B splits", "Conversion event tracking", "Campaign performance reports"] },
  { id: "team", name: "Team", price: 39, stripePriceId: process.env.STRIPE_TEAM_PRICE_ID, headline: "Agency workflow for client campaigns", limits: { dynamic: -1, static: -1, aiCredits: 1000, members: 10 }, features: ["Client folders", "Team seats", "White-label exports", "Priority campaign QA"] },
] as const;

export function getPlan(id?: string | null) {
  return plans.find((plan) => plan.id === id) || plans[0];
}

export function planForPriceId(priceId?: string | null): PlanId | null {
  if (!priceId) return null;
  return plans.find((plan) => plan.stripePriceId === priceId)?.id ?? null;
}
