type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimiterOptions = {
  limit: number;
  windowMs: number;
};

type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
};

export function hasBodyWithinLimit(headers: Headers, maxBytes: number) {
  const raw = headers.get("content-length");
  if (!raw) return true;
  const contentLength = Number(raw);
  if (!Number.isFinite(contentLength) || contentLength < 0) return false;
  return contentLength <= maxBytes;
}

export async function parseJsonWithLimit(request: Request, maxBytes: number) {
  if (!hasBodyWithinLimit(request.headers, maxBytes)) {
    return { ok: false as const, reason: "Payload too large" };
  }

  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > maxBytes) {
    return { ok: false as const, reason: "Payload too large" };
  }

  try {
    return { ok: true as const, data: JSON.parse(text) as unknown };
  } catch {
    return { ok: false as const, reason: "Invalid JSON" };
  }
}

export function clientKeyFromHeaders(headers: Headers, scope: string) {
  const forwardedFor = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwardedFor || headers.get("x-real-ip")?.trim() || "unknown";
  const userAgent = (headers.get("user-agent") || "unknown").slice(0, 120);
  return `${scope}:${ip}:${userAgent}`;
}

export function createMemoryRateLimiter({ limit, windowMs }: RateLimiterOptions) {
  const buckets = new Map<string, RateLimitEntry>();

  return {
    check(key: string, now = Date.now()): RateLimitResult {
      const current = buckets.get(key);
      if (!current || current.resetAt <= now) {
        const resetAt = now + windowMs;
        buckets.set(key, { count: 1, resetAt });
        return { allowed: true, limit, remaining: Math.max(limit - 1, 0), resetAt };
      }

      if (current.count >= limit) {
        return { allowed: false, limit, remaining: 0, resetAt: current.resetAt };
      }

      current.count += 1;
      return { allowed: true, limit, remaining: Math.max(limit - current.count, 0), resetAt: current.resetAt };
    },
  };
}

export function rateLimitHeaders(result: Pick<RateLimitResult, "limit" | "remaining" | "resetAt">) {
  return {
    "RateLimit-Limit": String(result.limit),
    "RateLimit-Remaining": String(result.remaining),
    "RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  };
}
