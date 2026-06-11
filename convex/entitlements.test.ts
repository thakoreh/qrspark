import { describe, expect, test } from "vitest";
import {
  assertCanUseAiCredit,
  assertCanCreateQr,
  assertCanDeleteCampaignQr,
  assertCanDuplicateQr,
  normalizeFolderName,
  normalizeQrName,
  normalizeQrSlug,
  normalizeQrStyle,
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

  test("rejects overlong destinations before they can be stored", () => {
    expect(qrDestinationIsAllowed("dynamic", `https://example.com/${"a".repeat(5000)}`)).toBe(false);
    expect(qrDestinationIsAllowed("static", "a".repeat(5000))).toBe(false);
  });

  test("normalizes QR display names and folders with safe bounds", () => {
    expect(normalizeQrName("  Spring menu flyer  ")).toBe("Spring menu flyer");
    expect(normalizeQrName("")).toBe("Untitled QR campaign");
    expect(normalizeQrName("a".repeat(200))).toHaveLength(120);
    expect(normalizeFolderName("  Retail  ")).toBe("Retail");
    expect(normalizeFolderName("")).toBe("General");
    expect(normalizeFolderName("a".repeat(120))).toHaveLength(80);
  });

  test("normalizes QR style and drops unsafe or oversized logos", () => {
    expect(
      normalizeQrStyle({
        foreground: "not-a-color",
        background: "#00FFaa",
        shape: "script",
        logoUrl: "javascript:alert(1)",
      }),
    ).toEqual({ foreground: "#111827", background: "#00ffaa", shape: "rounded" });

    expect(
      normalizeQrStyle({
        foreground: "#123456",
        background: "#abcdef",
        shape: "dots",
        logoUrl: `data:image/png;base64,${"a".repeat(60_000)}`,
      }),
    ).toEqual({ foreground: "#123456", background: "#abcdef", shape: "dots" });
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
