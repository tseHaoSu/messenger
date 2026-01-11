import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { paginationOptsValidator } from "convex/server";
import { getAuthenticatedUser } from "../lib/utils";

export const getMany = query({
  args: {
    conversationId: v.id("conversations"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    await getAuthenticatedUser(ctx);

    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found.",
      });
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation_time", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .order("asc")
      .paginate(args.paginationOpts);

    // Filter deleted and add sender info
    const messagesWithSender = await Promise.all(
      messages.page
        .filter((message) => !message.deletedAt)
        .map(async (message) => {
          const sender = await ctx.db.get(message.senderId);
          return {
            ...message,
            sender: sender
              ? {
                  _id: sender._id,
                  name: sender.name,
                  email: sender.email,
                  image: sender.image,
                }
              : null,
          };
        })
    );

    return {
      ...messages,
      page: messagesWithSender,
    };
  },
});

export const create = mutation({
  args: {
    conversationId: v.id("conversations"),
    type: v.union(v.literal("text"), v.literal("image"), v.literal("system")),
    body: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await getAuthenticatedUser(ctx);

    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found.",
      });
    }

    // Get user from identity
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "User not found.",
      });
    }

    // Check if user is already a member, if not add them
    const existingMember = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .filter((q) => q.eq(q.field("userId"), user._id))
      .unique();

    if (!existingMember) {
      await ctx.db.insert("conversationMembers", {
        conversationId: args.conversationId,
        userId: user._id,
      });
    }

    const now = Date.now();

    // Create message
    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: user._id,
      type: args.type,
      body: args.body,
      image: args.image,
      createdAt: now,
      reactionCounts: { like: 0, love: 0, laugh: 0 },
    });

    // Update conversation lastMessageAt and lastMessageId
    await ctx.db.patch(args.conversationId, {
      lastMessageAt: now,
      lastMessageId: messageId,
    });

    return messageId;
  },
});
