import { describe, expect, test } from "vitest";
import { buildContentSecurityPolicy, securityHeaders } from "./security-headers";

describe("security headers", () => {
  test("builds a CSP that blocks framing and object injection", () => {
    const csp = buildContentSecurityPolicy();

    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("base-uri 'self'");
  });

  test("keeps Clerk, Stripe, Convex, and OpenAI network origins explicit", () => {
    const csp = buildContentSecurityPolicy();

    expect(csp).toContain("https://*.clerk.accounts.dev");
    expect(csp).toContain("https://checkout.stripe.com");
    expect(csp).toContain("https://api.openai.com");
    expect(csp).toContain("wss://*.convex.cloud");
  });

  test("exports production security headers including CSP", () => {
    const keys = securityHeaders.map((header) => header.key);

    expect(keys).toContain("Content-Security-Policy");
    expect(keys).toContain("X-Frame-Options");
    expect(keys).toContain("Permissions-Policy");
  });
});
