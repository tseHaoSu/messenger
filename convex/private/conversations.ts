import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { paginationOptsValidator } from "convex/server";
import { getCurrentUser } from "../lib/utils";

export const getMany = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    await getCurrentUser(ctx);

    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_last_message")
      .order("desc")
      .paginate(args.paginationOpts);

    const conversationsWithDetails = await Promise.all(
      conversations.page.map(async (conversation) => {
        const members = await ctx.db
          .query("conversationMembers")
          .withIndex("by_conversation", (q) =>
            q.eq("conversationId", conversation._id)
          )
          .collect();

        const participants = await Promise.all(
          members.map(async (member) => {
            const user = await ctx.db.get(member.userId);
            return user
              ? {
                  ...member,
                  user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                  },
                }
              : null;
          })
        );

        let lastMessage = null;
        if (conversation.lastMessageId) {
          const message = await ctx.db.get(conversation.lastMessageId);
          if (message && !message.deletedAt) {
            const sender = await ctx.db.get(message.senderId);
            lastMessage = {
              ...message,
              sender: sender
                ? { _id: sender._id, name: sender.name, image: sender.image }
                : null,
            };
          }
        }

        return {
          ...conversation,
          participants: participants.filter(Boolean),
          lastMessage,
        };
      })
    );

    return {
      ...conversations,
      page: conversationsWithDetails,
    };
  },
});

export const getOne = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    await getCurrentUser(ctx);

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) return null;

    const members = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", conversation._id)
      )
      .collect();

    const participants = await Promise.all(
      members.map(async (member) => {
        const user = await ctx.db.get(member.userId);
        return user
          ? {
              ...member,
              user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
              },
            }
          : null;
      })
    );

    return {
      ...conversation,
      participants: participants.filter(Boolean),
    };
  },
});

export const create = mutation({
  args: {
    participantIds: v.array(v.id("users")),
    isGroup: v.optional(v.boolean()),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);

    const allParticipantIds = [...new Set([currentUser._id, ...args.participantIds])];

    if (allParticipantIds.length < 2) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Conversation requires at least 2 participants.",
      });
    }

    for (const userId of args.participantIds) {
      const user = await ctx.db.get(userId);
      if (!user) {
        throw new ConvexError({
          code: "NOT_FOUND",
          message: `User ${userId} not found.`,
        });
      }
    }

    const conversationId = await ctx.db.insert("conversations", {
      isGroup: args.isGroup ?? allParticipantIds.length > 2,
      name: args.name,
      lastMessageAt: Date.now(),
    });

    for (const userId of allParticipantIds) {
      await ctx.db.insert("conversationMembers", {
        conversationId,
        userId,
      });
    }

    return conversationId;
  },
});

export const remove = mutation({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    await getCurrentUser(ctx);

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found.",
      });
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    for (const message of messages) {
      const reactions = await ctx.db
        .query("messageReactions")
        .withIndex("by_message", (q) => q.eq("messageId", message._id))
        .collect();

      for (const reaction of reactions) {
        await ctx.db.delete(reaction._id);
      }

      await ctx.db.delete(message._id);
    }

    const members = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    for (const member of members) {
      await ctx.db.delete(member._id);
    }

    await ctx.db.delete(args.conversationId);
  },
});
