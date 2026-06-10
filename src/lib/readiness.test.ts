import { describe, expect, test } from "vitest";
import { getReadiness } from "./readiness";

describe("production readiness checks", () => {
  test("fails production readiness when required env vars are missing", () => {
    expect(getReadiness({ NODE_ENV: "production" })).toEqual({
      ok: false,
      missing: [
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
      ],
    });
  });

  test("passes production readiness when required env vars are present", () => {
    expect(
      getReadiness({
        NODE_ENV: "production",
        NEXT_PUBLIC_APP_URL: "https://qrspark.example",
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_live_123",
        CLERK_SECRET_KEY: "sk_live_123",
        CLERK_JWT_ISSUER_DOMAIN: "https://clerk.example",
        NEXT_PUBLIC_CONVEX_URL: "https://convex.example",
        STRIPE_SECRET_KEY: "sk_live_123",
        STRIPE_WEBHOOK_SECRET: "whsec_123",
        STRIPE_STARTER_PRICE_ID: "price_starter",
        STRIPE_PRO_PRICE_ID: "price_pro",
        STRIPE_TEAM_PRICE_ID: "price_team",
        BILLING_SYNC_SECRET: "billing_secret",
        CONVEX_SERVER_MUTATION_SECRET: "server_mutation_secret",
      }),
    ).toEqual({ ok: true, missing: [] });
  });

  test("keeps local development health lenient", () => {
    expect(getReadiness({ NODE_ENV: "development" })).toEqual({ ok: true, missing: [] });
  });
});
