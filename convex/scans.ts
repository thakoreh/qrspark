/* eslint-disable @typescript-eslint/no-explicit-any */
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const logScan = mutation({
  args: {
    slug: v.string(),
    referrer: v.optional(v.string()),
    device: v.optional(v.string()),
    variantUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const qr = await ctx.db.query("qrCodes").withIndex("by_slug", (q: any) => q.eq("slug", args.slug)).first();
    return await ctx.db.insert("scans", {
      qrCodeId: qr?._id,
      slug: args.slug,
      referrer: args.referrer,
      device: args.device,
      variantUrl: args.variantUrl,
      createdAt: Date.now(),
    });
  },
});

export const logConversion = mutation({
  args: { slug: v.string(), event: v.string(), value: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const qr = await ctx.db.query("qrCodes").withIndex("by_slug", (q: any) => q.eq("slug", args.slug)).first();
    return await ctx.db.insert("conversions", {
      qrCodeId: qr?._id,
      slug: args.slug,
      event: args.event,
      value: args.value,
      createdAt: Date.now(),
    });
  },
});

export const recentBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const scans = await ctx.db.query("scans").withIndex("by_slug", (q: any) => q.eq("slug", args.slug)).order("desc").take(10);
    const conversions = await ctx.db.query("conversions").withIndex("by_slug", (q: any) => q.eq("slug", args.slug)).order("desc").take(10);
    return { scans, conversions };
  },
});
