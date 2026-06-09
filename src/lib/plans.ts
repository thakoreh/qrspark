export type PlanId = "free" | "starter" | "pro" | "team";

export const plans = [
  { id: "free", name: "Free", price: 0, stripePriceId: null, headline: "Demo QR generation and basic analytics preview", limits: { dynamic: 1, static: 10, aiCredits: 3, members: 1 }, features: ["Live QR preview", "PNG download", "Demo analytics", "Provider-ready auth"] },
  { id: "starter", name: "Starter", price: 9, stripePriceId: process.env.STRIPE_STARTER_PRICE_ID, headline: "Checkout-ready starter tier", limits: { dynamic: 3, static: -1, aiCredits: 25, members: 1 }, features: ["Stripe checkout route", "SVG and PDF export", "Logo upload placeholder", "Convex schema included"] },
  { id: "pro", name: "Pro", price: 19, stripePriceId: process.env.STRIPE_PRO_PRICE_ID, headline: "Provider-ready Pro tier", limits: { dynamic: -1, static: -1, aiCredits: 250, members: 3 }, features: ["AI art endpoint scaffold", "Smart Redirect demo", "Conversion pixel endpoint", "Connect persistence before launch"] },
  { id: "team", name: "Team", price: 39, stripePriceId: process.env.STRIPE_TEAM_PRICE_ID, headline: "Team workflow placeholder", limits: { dynamic: -1, static: -1, aiCredits: 1000, members: 10 }, features: ["Folders UI", "Admin demo view", "Webhook route", "Priority support placeholder"] },
] as const;

export function getPlan(id?: string | null) {
  return plans.find((plan) => plan.id === id) || plans[0];
}
