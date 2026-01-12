import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { paginationOptsValidator } from "convex/server";
import { getAuthenticatedUser, getCurrentUser } from "../lib/utils";

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

export const toggleReaction = mutation({
  args: {
    messageId: v.id("messages"),
    type: v.union(v.literal("like"), v.literal("love"), v.literal("laugh")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Message not found.",
      });
    }

    // Check for existing reaction
    const existingReaction = await ctx.db
      .query("messageReactions")
      .withIndex("by_message_user", (q) =>
        q.eq("messageId", args.messageId).eq("userId", user._id)
      )
      .unique();

    const currentCounts = message.reactionCounts ?? { like: 0, love: 0, laugh: 0 };

    if (existingReaction) {
      if (existingReaction.type === args.type) {
        // Same reaction - remove it
        await ctx.db.delete(existingReaction._id);
        await ctx.db.patch(args.messageId, {
          reactionCounts: {
            ...currentCounts,
            [args.type]: Math.max(0, currentCounts[args.type] - 1),
          },
        });
      } else {
        // Different reaction - update it
        const oldType = existingReaction.type;
        await ctx.db.patch(existingReaction._id, { type: args.type });
        await ctx.db.patch(args.messageId, {
          reactionCounts: {
            ...currentCounts,
            [oldType]: Math.max(0, currentCounts[oldType] - 1),
            [args.type]: currentCounts[args.type] + 1,
          },
        });
      }
    } else {
      // No existing reaction - add new one
      await ctx.db.insert("messageReactions", {
        messageId: args.messageId,
        userId: user._id,
        type: args.type,
      });
      await ctx.db.patch(args.messageId, {
        reactionCounts: {
          ...currentCounts,
          [args.type]: currentCounts[args.type] + 1,
        },
      });
    }
  },
});
