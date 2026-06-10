import { describe, expect, test } from "vitest";
import { analyticsChartsFromWorkspace } from "./analytics";

describe("analytics chart data", () => {
  test("does not invent demo chart rows for workspaces with real counts", () => {
    expect(analyticsChartsFromWorkspace({ scanCount: 12 })).toEqual({
      scanSeries: [],
      deviceStats: [],
      geoStats: [],
    });
  });

  test("passes through real aggregate rows from the backend", () => {
    expect(
      analyticsChartsFromWorkspace({
        scanCount: 2,
        scanSeries: [{ day: "Jun 10", scans: 2, conversions: 1 }],
        deviceStats: [{ name: "iOS", value: 2 }],
        geoStats: [{ city: "Unknown", scans: 2 }],
      }),
    ).toEqual({
      scanSeries: [{ day: "Jun 10", scans: 2, conversions: 1 }],
      deviceStats: [{ name: "iOS", value: 2 }],
      geoStats: [{ city: "Unknown", scans: 2 }],
    });
  });
});
