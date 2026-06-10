/* eslint-disable @typescript-eslint/no-explicit-any */
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

async function findAuthedUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_user_id", (q: any) => q.eq("clerkUserId", identity.subject))
    .unique();
}

async function getOrCreateAuthedUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");
  const existing = await ctx.db
    .query("users")
    .withIndex("by_clerk_user_id", (q: any) => q.eq("clerkUserId", identity.subject))
    .unique();
  if (existing) return existing;

  const now = Date.now();
  const email = identity.email?.toLowerCase() ?? `${identity.subject}@clerk.local`;
  const userId = await ctx.db.insert("users", {
    clerkUserId: identity.subject,
    email,
    name: identity.name as string | undefined,
    plan: "free",
    aiCreditsUsed: 0,
    createdAt: now,
    updatedAt: now,
  });
  return await ctx.db.get(userId);
}

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const user = await findAuthedUser(ctx);
    if (!user) return [];
    return await ctx.db.query("qrCodes").withIndex("by_user", (q: any) => q.eq("userId", user._id)).order("desc").take(100);
  },
});

export const publicBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const qr = await ctx.db.query("qrCodes").withIndex("by_slug", (q: any) => q.eq("slug", args.slug)).first();
    if (!qr) return null;
    return { slug: qr.slug, destinationUrl: qr.destinationUrl, variants: qr.variants, kind: qr.kind };
  },
});

export const foldersMine = query({
  args: {},
  handler: async (ctx) => {
    const user = await findAuthedUser(ctx);
    if (!user) return [];
    const qrs = await ctx.db.query("qrCodes").withIndex("by_user", (q: any) => q.eq("userId", user._id)).collect();
    const groups = new Map<string, { name: string; count: number; updatedAt: number }>();
    for (const qr of qrs) {
      const name = qr.folder || "General";
      const current = groups.get(name) || { name, count: 0, updatedAt: 0 };
      current.count += 1;
      current.updatedAt = Math.max(current.updatedAt, qr.updatedAt || qr.createdAt);
      groups.set(name, current);
    }
    return Array.from(groups.values()).sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

export const analyticsMine = query({
  args: {},
  handler: async (ctx) => {
    const user = await findAuthedUser(ctx);
    if (!user) return { qrCount: 0, scanCount: 0, conversionCount: 0, uniqueDevices: 0 };
    const qrs = await ctx.db.query("qrCodes").withIndex("by_user", (q: any) => q.eq("userId", user._id)).collect();
    let scanCount = 0;
    let conversionCount = 0;
    const devices = new Set<string>();
    for (const qr of qrs) {
      const scans = await ctx.db.query("scans").withIndex("by_qr", (q: any) => q.eq("qrCodeId", qr._id)).collect();
      scanCount += scans.length;
      for (const scan of scans) if (scan.device) devices.add(scan.device);
      const conversions = await ctx.db.query("conversions").withIndex("by_qr", (q: any) => q.eq("qrCodeId", qr._id)).collect();
      conversionCount += conversions.length;
    }
    return { qrCount: qrs.length, scanCount, conversionCount, uniqueDevices: devices.size };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    destinationUrl: v.string(),
    kind: v.union(v.literal("static"), v.literal("dynamic")),
    folder: v.optional(v.string()),
    style: v.optional(v.object({ foreground: v.string(), background: v.string(), shape: v.string(), logoUrl: v.optional(v.string()) })),
  },
  handler: async (ctx, args) => {
    const user = await getOrCreateAuthedUser(ctx);
    if (!user) throw new Error("Unable to create user");
    const now = Date.now();
    return await ctx.db.insert("qrCodes", {
      userId: user._id,
      name: args.name,
      slug: args.slug,
      destinationUrl: args.destinationUrl,
      kind: args.kind,
      folder: args.folder || "General",
      style: args.style || { foreground: "#111827", background: "#ffffff", shape: "rounded" },
      variants: [],
      createdAt: now,
      updatedAt: now,
    });
  },
});
