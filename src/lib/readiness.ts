import { isProductionRuntime } from "./env";

export const healthContract = "qrspark-health-v1";

const requiredProductionEnv = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "CLERK_JWT_ISSUER_DOMAIN",
  "NEXT_PUBLIC_CONVEX_URL",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_STARTER_PRICE_ID",
  "STRIPE_PRO_PRICE_ID",
  "STRIPE_TEAM_PRICE_ID",
  "BILLING_SYNC_SECRET",
  "CONVEX_SERVER_MUTATION_SECRET",
] as const;

type ReadinessEnv = Partial<Record<(typeof requiredProductionEnv)[number] | "NODE_ENV", string>>;

export function getReadiness(env: ReadinessEnv = process.env) {
  if (!isProductionRuntime(env)) {
    return { ok: true, missing: [] as string[] };
  }

  const missing = requiredProductionEnv.filter((key) => !env[key]?.trim());
  return { ok: missing.length === 0, missing };
}
