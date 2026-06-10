import { describe, expect, test } from "vitest";
import {
  clientKeyFromHeaders,
  createMemoryRateLimiter,
  hasBodyWithinLimit,
  parseJsonWithLimit,
} from "./request-guards";

describe("request guards", () => {
  test("rejects requests whose content-length exceeds the route limit", () => {
    const headers = new Headers({ "content-length": "2048" });
    expect(hasBodyWithinLimit(headers, 1024)).toBe(false);
  });

  test("allows requests without content-length so streaming clients can still be parsed", () => {
    expect(hasBodyWithinLimit(new Headers(), 1024)).toBe(true);
  });

  test("parses JSON only when the body is under the byte limit", async () => {
    const ok = await parseJsonWithLimit(new Request("https://example.test", {
      method: "POST",
      body: JSON.stringify({ slug: "menu" }),
    }), 64);

    expect(ok).toEqual({ ok: true, data: { slug: "menu" } });

    const tooLarge = await parseJsonWithLimit(new Request("https://example.test", {
      method: "POST",
      body: JSON.stringify({ text: "x".repeat(100) }),
    }), 32);

    expect(tooLarge).toEqual({ ok: false, reason: "Payload too large" });
  });

  test("derives a bounded client key from forwarded headers", () => {
    const headers = new Headers({
      "x-forwarded-for": "203.0.113.10, 198.51.100.2",
      "user-agent": "Scanner/1.0",
    });

    expect(clientKeyFromHeaders(headers, "scan")).toBe("scan:203.0.113.10:Scanner/1.0");
  });

  test("blocks requests after the fixed window budget is exhausted", () => {
    const limiter = createMemoryRateLimiter({ limit: 2, windowMs: 60_000 });

    expect(limiter.check("client-a", 1_000).allowed).toBe(true);
    expect(limiter.check("client-a", 2_000).allowed).toBe(true);
    expect(limiter.check("client-a", 3_000)).toEqual({
      allowed: false,
      limit: 2,
      remaining: 0,
      resetAt: 61_000,
    });
    expect(limiter.check("client-a", 62_000).allowed).toBe(true);
  });
});
