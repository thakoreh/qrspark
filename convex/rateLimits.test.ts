import { describe, expect, test } from "vitest";
import { nextRateLimitState } from "./rateLimits";

describe("shared rate limit state", () => {
  test("starts a new fixed window when there is no existing bucket", () => {
    expect(nextRateLimitState(null, { limit: 3, windowMs: 60_000, now: 1_000 })).toEqual({
      allowed: true,
      count: 1,
      remaining: 2,
      resetAt: 61_000,
    });
  });

  test("increments an existing bucket inside the window", () => {
    expect(nextRateLimitState({ count: 1, resetAt: 61_000 }, { limit: 3, windowMs: 60_000, now: 2_000 })).toEqual({
      allowed: true,
      count: 2,
      remaining: 1,
      resetAt: 61_000,
    });
  });

  test("blocks when the fixed window is exhausted", () => {
    expect(nextRateLimitState({ count: 3, resetAt: 61_000 }, { limit: 3, windowMs: 60_000, now: 3_000 })).toEqual({
      allowed: false,
      count: 3,
      remaining: 0,
      resetAt: 61_000,
    });
  });

  test("resets after the fixed window expires", () => {
    expect(nextRateLimitState({ count: 3, resetAt: 61_000 }, { limit: 3, windowMs: 60_000, now: 61_000 })).toEqual({
      allowed: true,
      count: 1,
      remaining: 2,
      resetAt: 121_000,
    });
  });
});
