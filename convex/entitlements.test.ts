import { describe, expect, test } from "vitest";
import {
  assertCanUseAiCredit,
  assertCanCreateQr,
  assertCanDeleteCampaignQr,
  assertCanDuplicateQr,
  normalizeQrSlug,
  qrDestinationIsAllowed,
} from "./entitlements";

describe("QR creation entitlements", () => {
  test("normalizes user supplied slugs to public identifiers", () => {
    expect(normalizeQrSlug(" Spring Menu / Table 12 ")).toBe("spring-menu-table-12");
  });

  test("blocks dynamic QR creation when the plan limit is reached", () => {
    expect(() =>
      assertCanCreateQr({
        plan: "free",
        kind: "dynamic",
        existingDynamic: 1,
        existingStatic: 0,
      }),
    ).toThrow("Dynamic QR limit reached for the free plan");
  });

  test("allows unlimited QR creation for plans with unlimited limits", () => {
    expect(
      assertCanCreateQr({
        plan: "pro",
        kind: "dynamic",
        existingDynamic: 100,
        existingStatic: 100,
      }),
    ).toEqual({ ok: true });
  });

  test("blocks QR duplication when it would exceed the plan limit", () => {
    expect(() =>
      assertCanDuplicateQr({
        plan: "free",
        kind: "dynamic",
        existingDynamic: 1,
        existingStatic: 0,
      }),
    ).toThrow("Dynamic QR limit reached for the free plan");
  });

  test("blocks campaign QR deletion so plan limits and historical analytics cannot be reset", () => {
    expect(() => assertCanDeleteCampaignQr()).toThrow(
      "Campaign QR deletion is disabled to preserve analytics history and plan limits",
    );
  });

  test("allows static payloads but requires dynamic destinations to be web URLs", () => {
    expect(qrDestinationIsAllowed("static", "WIFI:T:WPA;S:Guest;P:secret;;")).toBe(true);
    expect(qrDestinationIsAllowed("dynamic", "WIFI:T:WPA;S:Guest;P:secret;;")).toBe(false);
    expect(qrDestinationIsAllowed("dynamic", "https://example.com/menu")).toBe(true);
  });

  test("blocks AI usage when the plan credit limit is reached", () => {
    expect(() => assertCanUseAiCredit({ plan: "free", aiCreditsUsed: 3 })).toThrow(
      "AI credit limit reached for the free plan",
    );
  });

  test("allows AI usage while credits remain", () => {
    expect(assertCanUseAiCredit({ plan: "starter", aiCreditsUsed: 24 })).toEqual({ ok: true });
  });
});
