/* eslint-disable @typescript-eslint/no-explicit-any */
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { assertServerMutationSecret } from "./billingSecurity";
import {
  assertCanCreateQr,
  assertCanDeleteCampaignQr,
  assertCanDuplicateQr,
  normalizeFolderName,
  normalizeQrName,
  normalizeQrSlug,
  normalizeQrStyle,
  qrDestinationIsAllowed,
  type StoredQrKind,
} from "./entitlements";

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
  args: { slug: v.string(), serverMutationSecret: v.string() },
  handler: async (ctx, args) => {
    assertServerMutationSecret(args.serverMutationSecret);
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
    function dayKey(timestamp: number) {
      return new Date(timestamp).toISOString().slice(0, 10);
    }

    function dayLabel(key: string) {
      return new Date(`${key}T00:00:00.000Z`).toLocaleDateString("en", { month: "short", day: "numeric", timeZone: "UTC" });
    }

    function deviceBucket(device?: string) {
      const value = (device || "Unknown").toLowerCase();
      if (value.includes("iphone") || value.includes("ipad") || value.includes("ios")) return "iOS";
      if (value.includes("android")) return "Android";
      if (value.includes("windows") || value.includes("macintosh") || value.includes("linux")) return "Desktop";
      return "Other";
    }

    const empty = { qrCount: 0, scanCount: 0, conversionCount: 0, uniqueDevices: 0, campaigns: [], scanSeries: [], deviceStats: [], geoStats: [] };
    const user = await findAuthedUser(ctx);
    if (!user) return empty;
    const qrs = await ctx.db.query("qrCodes").withIndex("by_user", (q: any) => q.eq("userId", user._id)).collect();
    let scanCount = 0;
    let conversionCount = 0;
    const devices = new Set<string>();
    const scanDays = new Map<string, { day: string; scans: number; conversions: number }>();
    const deviceCounts = new Map<string, number>();
    const geoCounts = new Map<string, number>();
    const campaigns = [];
    for (const qr of qrs) {
      const scans = await ctx.db.query("scans").withIndex("by_qr", (q: any) => q.eq("qrCodeId", qr._id)).collect();
      scanCount += scans.length;
      for (const scan of scans) {
        if (scan.device) devices.add(scan.device);
        const key = dayKey(scan.createdAt);
        const current = scanDays.get(key) || { day: dayLabel(key), scans: 0, conversions: 0 };
        current.scans += 1;
        scanDays.set(key, current);
        const bucket = deviceBucket(scan.device);
        deviceCounts.set(bucket, (deviceCounts.get(bucket) || 0) + 1);
        const country = scan.country || "Unknown";
        geoCounts.set(country, (geoCounts.get(country) || 0) + 1);
      }
      const conversions = await ctx.db.query("conversions").withIndex("by_qr", (q: any) => q.eq("qrCodeId", qr._id)).collect();
      conversionCount += conversions.length;
      for (const conversion of conversions) {
        const key = dayKey(conversion.createdAt);
        const current = scanDays.get(key) || { day: dayLabel(key), scans: 0, conversions: 0 };
        current.conversions += 1;
        scanDays.set(key, current);
      }
      campaigns.push({
        id: qr._id,
        name: qr.name,
        slug: qr.slug,
        kind: qr.kind,
        destinationUrl: qr.destinationUrl,
        folder: qr.folder || "General",
        scanCount: scans.length,
        conversionCount: conversions.length,
        uniqueDevices: new Set(scans.map((scan) => scan.device).filter(Boolean)).size,
        lastScanAt: scans.reduce((latest, scan) => Math.max(latest, scan.createdAt), 0),
        createdAt: qr.createdAt,
      });
    }
    campaigns.sort((a, b) => (b.lastScanAt || b.createdAt) - (a.lastScanAt || a.createdAt));
    const scanSeries = Array.from(scanDays.entries()).sort(([a], [b]) => a.localeCompare(b)).slice(-14).map(([, value]) => value);
    const deviceStats = Array.from(deviceCounts.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
    const geoStats = Array.from(geoCounts.entries()).map(([city, scans]) => ({ city, scans })).sort((a, b) => b.scans - a.scans).slice(0, 8);
    return { qrCount: qrs.length, scanCount, conversionCount, uniqueDevices: devices.size, campaigns, scanSeries, deviceStats, geoStats };
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
    const kind = args.kind as StoredQrKind;
    const destinationUrl = args.destinationUrl.trim();
    const slug = normalizeQrSlug(args.slug);
    if (!slug) throw new Error("QR slug is required");
    if (!qrDestinationIsAllowed(kind, destinationUrl)) {
      throw new Error(kind === "dynamic" ? "Dynamic QR destinations must be HTTP or HTTPS URLs" : "QR destination is required");
    }

    const existingForUser = await ctx.db.query("qrCodes").withIndex("by_user", (q: any) => q.eq("userId", user._id)).collect();
    const existingSlug = await ctx.db.query("qrCodes").withIndex("by_slug", (q: any) => q.eq("slug", slug)).first();
    if (existingSlug) throw new Error("QR slug is already in use");

    assertCanCreateQr({
      plan: user.plan,
      kind,
      existingDynamic: existingForUser.filter((qr) => qr.kind === "dynamic").length,
      existingStatic: existingForUser.filter((qr) => qr.kind === "static").length,
    });

    const now = Date.now();
    return await ctx.db.insert("qrCodes", {
      userId: user._id,
      name: normalizeQrName(args.name),
      slug,
      destinationUrl,
      kind,
      folder: normalizeFolderName(args.folder),
      style: normalizeQrStyle(args.style),
      variants: [],
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const duplicate = mutation({
  args: { id: v.id("qrCodes") },
  handler: async (ctx, args) => {
    const user = await getOrCreateAuthedUser(ctx);
    if (!user) throw new Error("Unable to create user");
    const qr = await ctx.db.get(args.id);
    if (!qr || qr.userId !== user._id) throw new Error("QR not found");
    const existingForUser = await ctx.db.query("qrCodes").withIndex("by_user", (q: any) => q.eq("userId", user._id)).collect();
    assertCanDuplicateQr({
      plan: user.plan,
      kind: qr.kind,
      existingDynamic: existingForUser.filter((existing) => existing.kind === "dynamic").length,
      existingStatic: existingForUser.filter((existing) => existing.kind === "static").length,
    });
    const now = Date.now();
    return await ctx.db.insert("qrCodes", {
      userId: user._id,
      name: `${qr.name} copy`,
      slug: `${qr.slug}-copy-${now.toString(36)}`,
      destinationUrl: qr.destinationUrl,
      kind: qr.kind,
      folder: qr.folder || "General",
      style: qr.style,
      variants: qr.variants || [],
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("qrCodes") },
  handler: async (ctx, args) => {
    const user = await getOrCreateAuthedUser(ctx);
    if (!user) throw new Error("Unable to create user");
    const qr = await ctx.db.get(args.id);
    if (!qr || qr.userId !== user._id) throw new Error("QR not found");
    return assertCanDeleteCampaignQr();
  },
});
