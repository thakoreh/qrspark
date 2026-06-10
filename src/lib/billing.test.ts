import { describe, expect, test } from "vitest";
import { billingPortalCustomerForUser } from "./billing";

describe("billing portal ownership", () => {
  test("uses the authenticated user's Stripe customer id", () => {
    expect(
      billingPortalCustomerForUser({
        stripeCustomerId: "cus_owned",
      }),
    ).toBe("cus_owned");
  });

  test("does not accept customer ids supplied by the browser", () => {
    expect(
      billingPortalCustomerForUser({
        stripeCustomerId: "cus_owned",
        requestedCustomerId: "cus_attacker",
      }),
    ).toBe("cus_owned");
  });

  test("returns null when the user has no billing customer", () => {
    expect(billingPortalCustomerForUser({ requestedCustomerId: "cus_attacker" })).toBeNull();
  });
});
