/* eslint-disable @typescript-eslint/no-explicit-any */
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { assertBillingSyncSecret } from "./billingSecurity";
import { assertCanUseAiCredit } from "./entitlements";

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

export const updateBilling = mutation({
  args: {
    email: v.optional(v.string()),
    clerkUserId: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    plan: v.union(v.literal("free"), v.literal("starter"), v.literal("pro"), v.literal("team")),
    billingSyncSecret: v.string(),
  },
  handler: async (ctx, args) => {
    assertBillingSyncSecret(args.billingSyncSecret);
    const normalizedEmail = args.email?.toLowerCase();
    const user = args.clerkUserId
      ? await ctx.db.query("users").withIndex("by_clerk_user_id", (q: any) => q.eq("clerkUserId", args.clerkUserId)).unique()
      : args.stripeCustomerId
        ? await ctx.db.query("users").withIndex("by_stripe_customer_id", (q: any) => q.eq("stripeCustomerId", args.stripeCustomerId)).unique()
        : normalizedEmail
          ? await ctx.db.query("users").withIndex("by_email", (q: any) => q.eq("email", normalizedEmail)).unique()
          : null;
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

export const consumeAiCredit = mutation({
  args: { credits: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const credits = args.credits ?? 1;
    const now = Date.now();
    const clerkUserId = identity.subject;
    const email = identity.email ?? `${clerkUserId}@clerk.local`;
    let user = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q: any) => q.eq("clerkUserId", clerkUserId))
      .unique();

    if (!user) {
      const userId = await ctx.db.insert("users", {
        clerkUserId,
        email,
        name: identity.name as string | undefined,
        plan: "free",
        aiCreditsUsed: 0,
        createdAt: now,
        updatedAt: now,
      });
      user = await ctx.db.get(userId);
    }

    if (!user) throw new Error("Unable to create user");
    assertCanUseAiCredit({ plan: user.plan, aiCreditsUsed: user.aiCreditsUsed, credits });
    await ctx.db.patch(user._id, {
      aiCreditsUsed: user.aiCreditsUsed + credits,
      updatedAt: now,
    });

    return { aiCreditsUsed: user.aiCreditsUsed + credits };
  },
});
