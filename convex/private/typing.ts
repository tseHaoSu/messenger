import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getCurrentUser } from "../lib/utils";

const TYPING_TIMEOUT_MS = 5000; // 5 seconds

export const setTyping = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    const existing = await ctx.db
      .query("typingIndicators")
      .withIndex("by_conversation_user", (q) =>
        q.eq("conversationId", args.conversationId).eq("userId", user._id)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { updatedAt: Date.now() });
    } else {
      await ctx.db.insert("typingIndicators", {
        conversationId: args.conversationId,
        userId: user._id,
        updatedAt: Date.now(),
      });
    }
  },
});

export const clearTyping = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    const existing = await ctx.db
      .query("typingIndicators")
      .withIndex("by_conversation_user", (q) =>
        q.eq("conversationId", args.conversationId).eq("userId", user._id)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

export const getTyping = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const now = Date.now();

    const typingIndicators = await ctx.db
      .query("typingIndicators")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    // Filter out stale indicators and current user
    const activeTyping = typingIndicators.filter(
      (t) => t.userId !== user._id && now - t.updatedAt < TYPING_TIMEOUT_MS
    );

    // Get user details for active typing indicators
    const typingUsers = await Promise.all(
      activeTyping.map(async (t) => {
        const typingUser = await ctx.db.get(t.userId);
        return typingUser ? { _id: typingUser._id, name: typingUser.name } : null;
      })
    );

    return typingUsers.filter(Boolean);
  },
});
