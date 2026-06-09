/* eslint-disable @typescript-eslint/no-explicit-any */
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

async function getAuthedUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_user_id", (q: any) => q.eq("clerkUserId", identity.subject))
    .unique();
  if (!user) throw new Error("User not found. Call users.ensureCurrentUser first.");
  return user;
}

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthedUser(ctx);
    return await ctx.db.query("qrCodes").withIndex("by_user", (q: any) => q.eq("userId", user._id)).order("desc").take(100);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    destinationUrl: v.string(),
    kind: v.union(v.literal("static"), v.literal("dynamic")),
  },
  handler: async (ctx, args) => {
    const user = await getAuthedUser(ctx);
    const now = Date.now();
    return await ctx.db.insert("qrCodes", {
      userId: user._id,
      name: args.name,
      slug: args.slug,
      destinationUrl: args.destinationUrl,
      kind: args.kind,
      style: { foreground: "#111827", background: "#ffffff", shape: "rounded" },
      variants: [],
      createdAt: now,
      updatedAt: now,
    });
  },
});
