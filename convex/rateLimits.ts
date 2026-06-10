import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { assertServerMutationSecret } from "./billingSecurity";

type RateLimitBucket = {
  count: number;
  resetAt: number;
} | null;

export function nextRateLimitState(
  bucket: RateLimitBucket,
  options: { limit: number; windowMs: number; now: number },
) {
  if (!bucket || bucket.resetAt <= options.now) {
    return {
      allowed: true,
      count: 1,
      remaining: Math.max(options.limit - 1, 0),
      resetAt: options.now + options.windowMs,
    };
  }

  if (bucket.count >= options.limit) {
    return {
      allowed: false,
      count: bucket.count,
      remaining: 0,
      resetAt: bucket.resetAt,
    };
  }

  const count = bucket.count + 1;
  return {
    allowed: true,
    count,
    remaining: Math.max(options.limit - count, 0),
    resetAt: bucket.resetAt,
  };
}

export const checkAndConsume = mutation({
  args: {
    key: v.string(),
    limit: v.number(),
    windowMs: v.number(),
    serverMutationSecret: v.string(),
  },
  handler: async (ctx, args) => {
    assertServerMutationSecret(args.serverMutationSecret);
    if (args.limit < 1 || args.windowMs < 1000) throw new Error("Invalid rate limit configuration");
    const now = Date.now();
    const existing = await ctx.db.query("rateLimits").withIndex("by_key", (q) => q.eq("key", args.key)).unique();
    const next = nextRateLimitState(
      existing ? { count: existing.count, resetAt: existing.resetAt } : null,
      { limit: args.limit, windowMs: args.windowMs, now },
    );

    if (!existing) {
      await ctx.db.insert("rateLimits", {
        key: args.key,
        count: next.count,
        resetAt: next.resetAt,
        updatedAt: now,
      });
    } else if (next.allowed) {
      await ctx.db.patch(existing._id, {
        count: next.count,
        resetAt: next.resetAt,
        updatedAt: now,
      });
    }

    return {
      allowed: next.allowed,
      limit: args.limit,
      remaining: next.remaining,
      resetAt: next.resetAt,
    };
  },
});
