import { describe, expect, test } from "vitest";
import {
  parseConversionPayload,
  safeRedirectDestination,
  sanitizePublicSlug,
} from "./public-events";

describe("public event validation", () => {
  test("rejects missing conversion slugs instead of inventing demo events", () => {
    const parsed = parseConversionPayload({ event: "purchase" });
    expect(parsed.success).toBe(false);
  });

  test("normalizes bounded conversion payloads", () => {
    const parsed = parseConversionPayload({
      slug: " Summer_Menu-2026!!! ",
      event: "redeemed_coupon",
      value: 12.5,
    });

    expect(parsed).toEqual({
      success: true,
      data: {
        slug: "summer_menu-2026",
        event: "redeemed_coupon",
        value: 12.5,
      },
    });
  });

  test("sanitizes route slugs to a bounded public identifier", () => {
    expect(sanitizePublicSlug("  TABLE 12 / lunch_special  ")).toBe("table-12-lunch_special");
  });

  test("allows only http and https redirect destinations", () => {
    expect(safeRedirectDestination("https://example.com/menu")?.href).toBe("https://example.com/menu");
    expect(safeRedirectDestination("javascript:alert(1)")).toBeNull();
    expect(safeRedirectDestination("WIFI:T:WPA;S:Guest;P:secret;;")).toBeNull();
  });
});
