import { describe, expect, test, vi } from "vitest";
import { logPublicConversion, logPublicScan } from "./public-event-log";

describe("public event logging", () => {
  test("scan logs omit raw user agents and full redirect URLs", () => {
    const logger = vi.fn();
    logPublicScan(
      {
        slug: "summer-menu",
        destination: new URL("https://example.com/private/offer?coupon=secret"),
        userAgent: "Mozilla/5.0 Very Specific Device",
      },
      logger,
    );

    const payload = JSON.parse(logger.mock.calls[0][0]);
    expect(payload).toEqual({
      event: "scan",
      slug: "summer-menu",
      destinationHost: "example.com",
    });
    expect(logger.mock.calls[0][0]).not.toContain("Very Specific Device");
    expect(logger.mock.calls[0][0]).not.toContain("coupon=secret");
  });

  test("conversion logs keep bounded event metadata only", () => {
    const logger = vi.fn();
    logPublicConversion({ slug: "summer-menu", eventName: "redeemed_coupon", value: 12.5 }, logger);

    const payload = JSON.parse(logger.mock.calls[0][0]);
    expect(payload).toEqual({
      event: "conversion",
      slug: "summer-menu",
      name: "redeemed_coupon",
    });
    expect(logger.mock.calls[0][0]).not.toContain("12.5");
  });
});
