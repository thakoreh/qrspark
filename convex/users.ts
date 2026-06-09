/* eslint-disable @typescript-eslint/no-explicit-any */
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const ensureCurrentUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const now = Date.now();
    const clerkUserId = identity.subject;
    const email = identity.email ?? `${clerkUserId}@clerk.local`;
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q: any) => q.eq("clerkUserId", clerkUserId))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { email, name: identity.name as string | undefined, updatedAt: now });
      return existing._id;
    }
    return await ctx.db.insert("users", {
      clerkUserId,
      email,
      name: identity.name as string | undefined,
      plan: "free",
      aiCreditsUsed: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q: any) => q.eq("clerkUserId", identity.subject))
      .unique();
  },
});

export const updateBillingByEmail = mutation({
  args: {
    email: v.string(),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    plan: v.union(v.literal("free"), v.literal("starter"), v.literal("pro"), v.literal("team")),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q: any) => q.eq("email", args.email.toLowerCase()))
      .unique();
    if (!user) return null;
    await ctx.db.patch(user._id, {
      stripeCustomerId: args.stripeCustomerId,
      stripeSubscriptionId: args.stripeSubscriptionId,
      plan: args.plan,
      updatedAt: Date.now(),
    });
    return user._id;
  },
});
