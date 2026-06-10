import { describe, expect, test } from "vitest";
import { getPublicConvexUrl, isProductionRuntime } from "./env";

describe("environment hardening", () => {
  test("detects production runtime explicitly", () => {
    expect(isProductionRuntime({ NODE_ENV: "production" })).toBe(true);
    expect(isProductionRuntime({ NODE_ENV: "development" })).toBe(false);
  });

  test("does not silently use a local Convex URL in production", () => {
    expect(() => getPublicConvexUrl({ NODE_ENV: "production" })).toThrow(
      "NEXT_PUBLIC_CONVEX_URL is required in production",
    );
  });

  test("keeps the local Convex fallback for development", () => {
    expect(getPublicConvexUrl({ NODE_ENV: "development" })).toBe("http://127.0.0.1:3210");
  });
});
