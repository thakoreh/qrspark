export type PlanId = "free" | "starter" | "pro" | "team";

export const plans = [
  { id: "free", name: "Free", price: 0, stripePriceId: null, headline: "One live campaign QR and basic scan preview", limits: { dynamic: 1, static: 10, aiCredits: 3, members: 1 }, features: ["One campaign QR", "PNG/SVG download", "Basic scan preview", "Clerk-ready auth"] },
  { id: "starter", name: "Starter", price: 9, stripePriceId: process.env.STRIPE_STARTER_PRICE_ID, headline: "Starter campaigns for solo local businesses", limits: { dynamic: 3, static: -1, aiCredits: 25, members: 1 }, features: ["Stripe checkout route", "Print-ready SVG/PDF export", "Brand styling placeholder", "Convex schema included"] },
  { id: "pro", name: "Pro", price: 19, stripePriceId: process.env.STRIPE_PRO_PRICE_ID, headline: "Growth campaigns with attribution", limits: { dynamic: -1, static: -1, aiCredits: 250, members: 3 }, features: ["Offer A/B redirect demo", "Smart Redirect demo", "Conversion pixel endpoint", "Connect persistence before launch"] },
  { id: "team", name: "Team", price: 39, stripePriceId: process.env.STRIPE_TEAM_PRICE_ID, headline: "Agency workflow for client campaigns", limits: { dynamic: -1, static: -1, aiCredits: 1000, members: 10 }, features: ["Client folders UI", "Campaign admin demo", "Webhook route", "White-label placeholder"] },
] as const;

export function getPlan(id?: string | null) {
  return plans.find((plan) => plan.id === id) || plans[0];
}

export function planForPriceId(priceId?: string | null): PlanId | null {
  if (!priceId) return null;
  return plans.find((plan) => plan.stripePriceId === priceId)?.id ?? null;
}
