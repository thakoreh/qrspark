import { describe, expect, test } from "vitest";
import { analyticsPageSignals } from "./analytics-marketing";

describe("analytics marketing signals", () => {
  test("does not expose fabricated sample metrics", () => {
    expect(analyticsPageSignals.map((signal) => signal.value)).toEqual([
      "Live scans",
      "Known devices",
      "Tracked events",
      "Placements",
    ]);
  });
});
