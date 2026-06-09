import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    plan: v.union(v.literal("free"), v.literal("starter"), v.literal("pro"), v.literal("team")),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    aiCreditsUsed: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_clerk_user_id", ["clerkUserId"]).index("by_email", ["email"]),

  qrCodes: defineTable({
    userId: v.id("users"),
    name: v.string(),
    slug: v.string(),
    destinationUrl: v.string(),
    kind: v.union(v.literal("static"), v.literal("dynamic")),
    style: v.object({
      foreground: v.string(),
      background: v.string(),
      shape: v.string(),
      logoUrl: v.optional(v.string()),
    }),
    variants: v.array(v.object({ url: v.string(), weight: v.number() })),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]).index("by_slug", ["slug"]),

  scans: defineTable({
    qrCodeId: v.optional(v.id("qrCodes")),
    slug: v.string(),
    country: v.optional(v.string()),
    device: v.optional(v.string()),
    referrer: v.optional(v.string()),
    variantUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_slug", ["slug"]).index("by_qr", ["qrCodeId"]),

  conversions: defineTable({
    qrCodeId: v.optional(v.id("qrCodes")),
    slug: v.string(),
    event: v.string(),
    value: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_slug", ["slug"]).index("by_qr", ["qrCodeId"]),
});
