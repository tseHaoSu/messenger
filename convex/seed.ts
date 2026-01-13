import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Seed data matching data.json
const users = [
  { id: 1, name: "Alice", email: "alice@example.com", image: "https://i.pravatar.cc/150?img=1", tokenIdentifier: "seed_alice" },
  { id: 2, name: "Bob", email: "bob@example.com", image: "https://i.pravatar.cc/150?img=2", tokenIdentifier: "seed_bob" },
  { id: 3, name: "Charlie", email: "charlie@example.com", image: "https://i.pravatar.cc/150?img=3", tokenIdentifier: "seed_charlie" },
  { id: 4, name: "David", email: "david@example.com", image: "https://i.pravatar.cc/150?img=4", tokenIdentifier: "seed_david" },
  { id: 5, name: "Emma", email: "emma@example.com", image: "https://i.pravatar.cc/150?img=5", tokenIdentifier: "seed_emma" },
];

const conversations = [
  { id: 1, participants: [4, 2], lastMessageAt: 1739016600000 },
  { id: 2, participants: [1, 3], lastMessageAt: 1739017200000 },
  { id: 3, participants: [2, 3], lastMessageAt: 1739017800000 },
  { id: 4, participants: [1, 2], lastMessageAt: 1739018400000 },
  { id: 5, participants: [5, 4], lastMessageAt: 1739019000000 },
  { id: 6, participants: [1, 2], lastMessageAt: 1739019600000 },
  { id: 7, participants: [5, 4], lastMessageAt: 1739020200000 },
  { id: 8, participants: [1, 3], lastMessageAt: 1739020800000 },
  { id: 9, participants: [1, 3], lastMessageAt: 1739021400000 },
  { id: 10, participants: [5, 1], lastMessageAt: 1739022000000 },
];

const messages = [
  // Conversation 1
  { conversationId: 1, userId: 4, type: "text" as const, body: "Jest vs Cypress?", reactions: { like: 4, love: 2, laugh: 0 }, createdAt: 1739016000000 },
  { conversationId: 1, userId: 2, type: "text" as const, body: "Redux or Zustand?", reactions: { like: 5, love: 3, laugh: 0 }, createdAt: 1739016060000 },
  { conversationId: 1, userId: 2, type: "text" as const, body: "Jest vs Cypress?", reactions: { like: 0, love: 0, laugh: 0 }, createdAt: 1739016120000 },
  { conversationId: 1, userId: 4, type: "text" as const, body: "How's it going?", reactions: { like: 4, love: 1, laugh: 1 }, createdAt: 1739016180000 },
  { conversationId: 1, userId: 2, type: "text" as const, body: "Any book recommendations for developers?", reactions: { like: 2, love: 2, laugh: 0 }, createdAt: 1739016240000 },
  { conversationId: 1, userId: 4, type: "text" as const, body: "I'm building a new side project.", reactions: { like: 5, love: 2, laugh: 1 }, createdAt: 1739016300000 },
  { conversationId: 1, userId: 4, type: "text" as const, body: "What's your favorite editor?", reactions: { like: 0, love: 1, laugh: 1 }, createdAt: 1739016360000 },
  { conversationId: 1, userId: 2, type: "text" as const, body: "What's your favorite editor?", reactions: { like: 0, love: 0, laugh: 1 }, createdAt: 1739016420000 },
  { conversationId: 1, userId: 4, type: "text" as const, body: "I'm building a new side project.", reactions: { like: 0, love: 0, laugh: 2 }, createdAt: 1739016480000 },
  { conversationId: 1, userId: 2, type: "text" as const, body: "React is amazing!", reactions: { like: 4, love: 1, laugh: 2 }, createdAt: 1739016540000 },
  // Conversation 2
  { conversationId: 2, userId: 3, type: "text" as const, body: "Firebase is great for real-time apps.", reactions: { like: 1, love: 3, laugh: 0 }, createdAt: 1739016000000 },
  { conversationId: 2, userId: 3, type: "text" as const, body: "What's your favorite programming language?", reactions: { like: 2, love: 3, laugh: 2 }, createdAt: 1739016060000 },
  { conversationId: 2, userId: 1, type: "text" as const, body: "Open-source contributions are fun!", reactions: { like: 5, love: 1, laugh: 0 }, createdAt: 1739016120000 },
  { conversationId: 2, userId: 3, type: "text" as const, body: "Have you used Next.js?", reactions: { like: 3, love: 0, laugh: 2 }, createdAt: 1739016180000 },
  { conversationId: 2, userId: 3, type: "text" as const, body: "Let's meet up sometime!", reactions: { like: 3, love: 0, laugh: 0 }, createdAt: 1739016240000 },
  { conversationId: 2, userId: 1, type: "text" as const, body: "How do you test your frontend?", reactions: { like: 1, love: 2, laugh: 0 }, createdAt: 1739016300000 },
  { conversationId: 2, userId: 1, type: "text" as const, body: "I love working with WebSockets.", reactions: { like: 3, love: 0, laugh: 1 }, createdAt: 1739016360000 },
  { conversationId: 2, userId: 3, type: "text" as const, body: "What's your favorite programming language?", reactions: { like: 5, love: 0, laugh: 2 }, createdAt: 1739016420000 },
  { conversationId: 2, userId: 1, type: "text" as const, body: "Any good DevOps tips?", reactions: { like: 1, love: 3, laugh: 2 }, createdAt: 1739016480000 },
  { conversationId: 2, userId: 3, type: "system" as const, body: "System message: A user has joined the conversation!", reactions: { like: 2, love: 3, laugh: 1 }, createdAt: 1739016540000 },
  // Conversation 3
  { conversationId: 3, userId: 3, type: "text" as const, body: "Let's meet up sometime!", reactions: { like: 0, love: 1, laugh: 1 }, createdAt: 1739016000000 },
  { conversationId: 3, userId: 3, type: "text" as const, body: "Svelte is underrated.", reactions: { like: 2, love: 0, laugh: 1 }, createdAt: 1739016060000 },
  { conversationId: 3, userId: 2, type: "text" as const, body: "Do you like writing documentation?", reactions: { like: 0, love: 3, laugh: 1 }, createdAt: 1739016120000 },
  { conversationId: 3, userId: 3, type: "text" as const, body: "Nice to meet you!", reactions: { like: 2, love: 3, laugh: 0 }, createdAt: 1739016180000 },
  { conversationId: 3, userId: 2, type: "text" as const, body: "Do you deploy with Vercel or Netlify?", reactions: { like: 4, love: 2, laugh: 1 }, createdAt: 1739016240000 },
  { conversationId: 3, userId: 3, type: "image" as const, image: "https://picsum.photos/seed/3_5/200/300", reactions: { like: 2, love: 0, laugh: 1 }, createdAt: 1739016300000 },
  { conversationId: 3, userId: 3, type: "text" as const, body: "Any good DevOps tips?", reactions: { like: 2, love: 3, laugh: 1 }, createdAt: 1739016360000 },
  { conversationId: 3, userId: 2, type: "image" as const, image: "https://picsum.photos/seed/3_7/200/300", reactions: { like: 4, love: 0, laugh: 2 }, createdAt: 1739016420000 },
  { conversationId: 3, userId: 3, type: "text" as const, body: "Tailwind CSS is awesome!", reactions: { like: 3, love: 2, laugh: 2 }, createdAt: 1739016480000 },
  { conversationId: 3, userId: 3, type: "text" as const, body: "What's your favorite editor?", reactions: { like: 2, love: 0, laugh: 0 }, createdAt: 1739016540000 },
  // Conversation 4
  { conversationId: 4, userId: 2, type: "text" as const, body: "Hello!", reactions: { like: 0, love: 2, laugh: 0 }, createdAt: 1739016000000 },
  { conversationId: 4, userId: 1, type: "text" as const, body: "Good morning!", reactions: { like: 2, love: 0, laugh: 0 }, createdAt: 1739016060000 },
  { conversationId: 4, userId: 1, type: "text" as const, body: "Jest vs Cypress?", reactions: { like: 3, love: 0, laugh: 0 }, createdAt: 1739016120000 },
  { conversationId: 4, userId: 2, type: "system" as const, body: "System message: A user has joined the conversation!", reactions: { like: 3, love: 0, laugh: 2 }, createdAt: 1739016180000 },
  { conversationId: 4, userId: 2, type: "text" as const, body: "Hello!", reactions: { like: 2, love: 3, laugh: 1 }, createdAt: 1739016240000 },
  { conversationId: 4, userId: 1, type: "text" as const, body: "Any book recommendations for developers?", reactions: { like: 2, love: 0, laugh: 2 }, createdAt: 1739016300000 },
  { conversationId: 4, userId: 1, type: "text" as const, body: "TypeScript or JavaScript?", reactions: { like: 0, love: 1, laugh: 2 }, createdAt: 1739016360000 },
  { conversationId: 4, userId: 2, type: "text" as const, body: "Do you deploy with Vercel or Netlify?", reactions: { like: 5, love: 2, laugh: 2 }, createdAt: 1739016420000 },
  { conversationId: 4, userId: 1, type: "text" as const, body: "Have you used Next.js?", reactions: { like: 4, love: 2, laugh: 0 }, createdAt: 1739016480000 },
  { conversationId: 4, userId: 1, type: "text" as const, body: "Are you using server-side rendering?", reactions: { like: 0, love: 1, laugh: 0 }, createdAt: 1739016540000 },
  // Conversation 5
  { conversationId: 5, userId: 4, type: "text" as const, body: "Open-source contributions are fun!", reactions: { like: 2, love: 0, laugh: 1 }, createdAt: 1739016000000 },
  { conversationId: 5, userId: 4, type: "image" as const, image: "https://picsum.photos/seed/5_1/200/300", reactions: { like: 2, love: 3, laugh: 0 }, createdAt: 1739016060000 },
  { conversationId: 5, userId: 4, type: "text" as const, body: "Nice to meet you!", reactions: { like: 3, love: 2, laugh: 2 }, createdAt: 1739016120000 },
  { conversationId: 5, userId: 4, type: "text" as const, body: "Ever tried GraphQL?", reactions: { like: 0, love: 1, laugh: 1 }, createdAt: 1739016180000 },
  { conversationId: 5, userId: 4, type: "text" as const, body: "What's your favorite editor?", reactions: { like: 4, love: 2, laugh: 2 }, createdAt: 1739016240000 },
  { conversationId: 5, userId: 4, type: "system" as const, body: "System message: A user has joined the conversation!", reactions: { like: 5, love: 0, laugh: 1 }, createdAt: 1739016300000 },
  { conversationId: 5, userId: 4, type: "text" as const, body: "TypeScript or JavaScript?", reactions: { like: 4, love: 1, laugh: 1 }, createdAt: 1739016360000 },
  { conversationId: 5, userId: 4, type: "text" as const, body: "Good morning!", reactions: { like: 2, love: 0, laugh: 0 }, createdAt: 1739016420000 },
  { conversationId: 5, userId: 5, type: "text" as const, body: "Any good DevOps tips?", reactions: { like: 3, love: 0, laugh: 0 }, createdAt: 1739016480000 },
  { conversationId: 5, userId: 4, type: "image" as const, image: "https://picsum.photos/seed/5_9/200/300", reactions: { like: 3, love: 0, laugh: 1 }, createdAt: 1739016540000 },
  // Conversation 6
  { conversationId: 6, userId: 1, type: "text" as const, body: "I'm building a new side project.", reactions: { like: 4, love: 0, laugh: 0 }, createdAt: 1739016000000 },
  { conversationId: 6, userId: 1, type: "text" as const, body: "Firebase is great for real-time apps.", reactions: { like: 3, love: 2, laugh: 0 }, createdAt: 1739016060000 },
  { conversationId: 6, userId: 2, type: "system" as const, body: "System message: A user has joined the conversation!", reactions: { like: 5, love: 1, laugh: 0 }, createdAt: 1739016120000 },
  { conversationId: 6, userId: 1, type: "system" as const, body: "System message: A user has joined the conversation!", reactions: { like: 3, love: 2, laugh: 2 }, createdAt: 1739016180000 },
  { conversationId: 6, userId: 1, type: "text" as const, body: "Any good DevOps tips?", reactions: { like: 5, love: 2, laugh: 1 }, createdAt: 1739016240000 },
  { conversationId: 6, userId: 2, type: "text" as const, body: "Firebase is great for real-time apps.", reactions: { like: 0, love: 0, laugh: 1 }, createdAt: 1739016300000 },
  { conversationId: 6, userId: 2, type: "text" as const, body: "Tailwind CSS is awesome!", reactions: { like: 1, love: 1, laugh: 0 }, createdAt: 1739016360000 },
  { conversationId: 6, userId: 1, type: "text" as const, body: "How do you handle state management?", reactions: { like: 2, love: 1, laugh: 0 }, createdAt: 1739016420000 },
  { conversationId: 6, userId: 2, type: "text" as const, body: "Ever tried GraphQL?", reactions: { like: 4, love: 1, laugh: 1 }, createdAt: 1739016480000 },
  { conversationId: 6, userId: 2, type: "text" as const, body: "What's your favorite programming language?", reactions: { like: 0, love: 3, laugh: 1 }, createdAt: 1739016540000 },
  // Conversation 7
  { conversationId: 7, userId: 4, type: "text" as const, body: "Ever tried GraphQL?", reactions: { like: 4, love: 2, laugh: 2 }, createdAt: 1739016000000 },
  { conversationId: 7, userId: 4, type: "text" as const, body: "Firebase is great for real-time apps.", reactions: { like: 5, love: 1, laugh: 2 }, createdAt: 1739016060000 },
  { conversationId: 7, userId: 5, type: "text" as const, body: "Microservices vs Monolith?", reactions: { like: 1, love: 2, laugh: 0 }, createdAt: 1739016120000 },
  { conversationId: 7, userId: 5, type: "text" as const, body: "Do you deploy with Vercel or Netlify?", reactions: { like: 2, love: 0, laugh: 2 }, createdAt: 1739016180000 },
  { conversationId: 7, userId: 5, type: "text" as const, body: "Have you used Next.js?", reactions: { like: 3, love: 3, laugh: 2 }, createdAt: 1739016240000 },
  { conversationId: 7, userId: 4, type: "text" as const, body: "Microservices vs Monolith?", reactions: { like: 2, love: 0, laugh: 2 }, createdAt: 1739016300000 },
  { conversationId: 7, userId: 5, type: "text" as const, body: "Hello!", reactions: { like: 5, love: 3, laugh: 2 }, createdAt: 1739016360000 },
  { conversationId: 7, userId: 5, type: "text" as const, body: "Any book recommendations for developers?", reactions: { like: 4, love: 2, laugh: 1 }, createdAt: 1739016420000 },
  { conversationId: 7, userId: 4, type: "text" as const, body: "Ever tried GraphQL?", reactions: { like: 4, love: 2, laugh: 1 }, createdAt: 1739016480000 },
  { conversationId: 7, userId: 5, type: "text" as const, body: "Redux or Zustand?", reactions: { like: 3, love: 3, laugh: 0 }, createdAt: 1739016540000 },
  // Conversation 8
  { conversationId: 8, userId: 3, type: "text" as const, body: "Hello!", reactions: { like: 3, love: 1, laugh: 1 }, createdAt: 1739016000000 },
  { conversationId: 8, userId: 1, type: "text" as const, body: "How do you handle state management?", reactions: { like: 0, love: 2, laugh: 2 }, createdAt: 1739016060000 },
  { conversationId: 8, userId: 3, type: "text" as const, body: "Redux or Zustand?", reactions: { like: 2, love: 3, laugh: 0 }, createdAt: 1739016120000 },
  { conversationId: 8, userId: 1, type: "text" as const, body: "Redux or Zustand?", reactions: { like: 1, love: 3, laugh: 2 }, createdAt: 1739016180000 },
  { conversationId: 8, userId: 3, type: "text" as const, body: "Firebase is great for real-time apps.", reactions: { like: 2, love: 0, laugh: 2 }, createdAt: 1739016240000 },
  { conversationId: 8, userId: 1, type: "system" as const, body: "System message: A user has joined the conversation!", reactions: { like: 4, love: 2, laugh: 0 }, createdAt: 1739016300000 },
  { conversationId: 8, userId: 3, type: "image" as const, image: "https://picsum.photos/seed/8_6/200/300", reactions: { like: 4, love: 1, laugh: 1 }, createdAt: 1739016360000 },
  { conversationId: 8, userId: 3, type: "text" as const, body: "Any book recommendations for developers?", reactions: { like: 4, love: 3, laugh: 2 }, createdAt: 1739016420000 },
  { conversationId: 8, userId: 1, type: "text" as const, body: "Nice to meet you!", reactions: { like: 0, love: 3, laugh: 1 }, createdAt: 1739016480000 },
  { conversationId: 8, userId: 3, type: "text" as const, body: "Redux or Zustand?", reactions: { like: 0, love: 1, laugh: 0 }, createdAt: 1739016540000 },
  // Conversation 9
  { conversationId: 9, userId: 1, type: "text" as const, body: "Good morning!", reactions: { like: 3, love: 2, laugh: 2 }, createdAt: 1739016000000 },
  { conversationId: 9, userId: 3, type: "text" as const, body: "Firebase is great for real-time apps.", reactions: { like: 4, love: 1, laugh: 1 }, createdAt: 1739016060000 },
  { conversationId: 9, userId: 3, type: "text" as const, body: "Any good UI libraries to recommend?", reactions: { like: 0, love: 1, laugh: 0 }, createdAt: 1739016120000 },
  { conversationId: 9, userId: 1, type: "text" as const, body: "Do you like writing documentation?", reactions: { like: 2, love: 1, laugh: 2 }, createdAt: 1739016180000 },
  { conversationId: 9, userId: 3, type: "text" as const, body: "What's your favorite programming language?", reactions: { like: 0, love: 2, laugh: 2 }, createdAt: 1739016240000 },
  { conversationId: 9, userId: 3, type: "image" as const, image: "https://picsum.photos/seed/9_5/200/300", reactions: { like: 1, love: 0, laugh: 2 }, createdAt: 1739016300000 },
  { conversationId: 9, userId: 1, type: "text" as const, body: "Any good UI libraries to recommend?", reactions: { like: 4, love: 1, laugh: 2 }, createdAt: 1739016360000 },
  { conversationId: 9, userId: 3, type: "text" as const, body: "Redux or Zustand?", reactions: { like: 4, love: 2, laugh: 1 }, createdAt: 1739016420000 },
  { conversationId: 9, userId: 3, type: "text" as const, body: "What are you working on?", reactions: { like: 5, love: 1, laugh: 1 }, createdAt: 1739016480000 },
  { conversationId: 9, userId: 1, type: "text" as const, body: "Svelte is underrated.", reactions: { like: 0, love: 2, laugh: 0 }, createdAt: 1739016540000 },
  // Conversation 10
  { conversationId: 10, userId: 1, type: "text" as const, body: "Any book recommendations for developers?", reactions: { like: 4, love: 1, laugh: 1 }, createdAt: 1739016000000 },
  { conversationId: 10, userId: 1, type: "text" as const, body: "Do you deploy with Vercel or Netlify?", reactions: { like: 1, love: 3, laugh: 2 }, createdAt: 1739016060000 },
  { conversationId: 10, userId: 5, type: "text" as const, body: "Let's meet up sometime!", reactions: { like: 2, love: 0, laugh: 2 }, createdAt: 1739016120000 },
  { conversationId: 10, userId: 5, type: "image" as const, image: "https://picsum.photos/seed/10_3/200/300", reactions: { like: 3, love: 3, laugh: 1 }, createdAt: 1739016180000 },
  { conversationId: 10, userId: 1, type: "image" as const, image: "https://picsum.photos/seed/10_4/200/300", reactions: { like: 4, love: 1, laugh: 0 }, createdAt: 1739016240000 },
  { conversationId: 10, userId: 1, type: "text" as const, body: "Let's meet up sometime!", reactions: { like: 5, love: 1, laugh: 2 }, createdAt: 1739016300000 },
  { conversationId: 10, userId: 1, type: "text" as const, body: "How do you test your frontend?", reactions: { like: 5, love: 2, laugh: 2 }, createdAt: 1739016360000 },
  { conversationId: 10, userId: 5, type: "text" as const, body: "Do you like writing documentation?", reactions: { like: 0, love: 0, laugh: 1 }, createdAt: 1739016420000 },
  { conversationId: 10, userId: 1, type: "text" as const, body: "Nice to meet you!", reactions: { like: 1, love: 0, laugh: 2 }, createdAt: 1739016480000 },
  { conversationId: 10, userId: 5, type: "text" as const, body: "Open-source contributions are fun!", reactions: { like: 0, love: 1, laugh: 1 }, createdAt: 1739016540000 },
];

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existingUsers = await ctx.db.query("users").collect();
    if (existingUsers.length > 0) {
      return { status: "already_seeded", message: "Database already has data" };
    }

    // Create users and store mapping
    const userIdMap = new Map<number, Id<"users">>();
    for (const user of users) {
      const id = await ctx.db.insert("users", {
        name: user.name,
        email: user.email,
        image: user.image,
        tokenIdentifier: user.tokenIdentifier,
      });
      userIdMap.set(user.id, id);
    }

    // Create conversations and store mapping
    const conversationIdMap = new Map<number, Id<"conversations">>();
    for (const conv of conversations) {
      const id = await ctx.db.insert("conversations", {
        isGroup: false,
        lastMessageAt: conv.lastMessageAt,
      });
      conversationIdMap.set(conv.id, id);

      // Create conversation members
      for (const participantId of conv.participants) {
        const userId = userIdMap.get(participantId);
        if (userId) {
          await ctx.db.insert("conversationMembers", {
            conversationId: id,
            userId,
          });
        }
      }
    }

    // Create messages and track last message per conversation
    const lastMessageMap = new Map<number, Id<"messages">>();
    for (const msg of messages) {
      const conversationId = conversationIdMap.get(msg.conversationId);
      const senderId = userIdMap.get(msg.userId);

      if (conversationId && senderId) {
        const messageId = await ctx.db.insert("messages", {
          conversationId,
          senderId,
          type: msg.type,
          body: msg.body,
          image: msg.image,
          createdAt: msg.createdAt,
          reactionCounts: msg.reactions,
        });
        // Track last message (messages are ordered by createdAt, so last one wins)
        lastMessageMap.set(msg.conversationId, messageId);
      }
    }

    // Update conversations with lastMessageId
    for (const [convId, messageId] of lastMessageMap) {
      const conversationId = conversationIdMap.get(convId);
      if (conversationId) {
        await ctx.db.patch(conversationId, { lastMessageId: messageId });
      }
    }

    return {
      status: "success",
      users: users.length,
      conversations: conversations.length,
      messages: messages.length,
    };
  },
});

export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    // Delete in order due to foreign key relationships
    const reactions = await ctx.db.query("messageReactions").collect();
    for (const r of reactions) {
      await ctx.db.delete(r._id);
    }

    const messages = await ctx.db.query("messages").collect();
    for (const m of messages) {
      await ctx.db.delete(m._id);
    }

    const members = await ctx.db.query("conversationMembers").collect();
    for (const m of members) {
      await ctx.db.delete(m._id);
    }

    const conversations = await ctx.db.query("conversations").collect();
    for (const c of conversations) {
      await ctx.db.delete(c._id);
    }

    const users = await ctx.db.query("users").collect();
    for (const u of users) {
      await ctx.db.delete(u._id);
    }

    return { status: "cleared" };
  },
});

export const clearAndSeed = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear all tables
    const tables = [
      "typingIndicators",
      "messageReactions",
      "messages",
      "conversationMembers",
      "conversations",
      "users",
    ] as const;

    for (const table of tables) {
      const docs = await ctx.db.query(table).collect();
      for (const doc of docs) {
        await ctx.db.delete(doc._id);
      }
    }

    // Create users and store mapping
    const userIdMap = new Map<number, Id<"users">>();
    for (const user of users) {
      const id = await ctx.db.insert("users", {
        name: user.name,
        email: user.email,
        image: user.image,
        tokenIdentifier: user.tokenIdentifier,
      });
      userIdMap.set(user.id, id);
    }

    // Create conversations and store mapping
    const conversationIdMap = new Map<number, Id<"conversations">>();
    for (const conv of conversations) {
      const id = await ctx.db.insert("conversations", {
        isGroup: false,
        lastMessageAt: conv.lastMessageAt,
      });
      conversationIdMap.set(conv.id, id);

      // Create conversation members
      for (const participantId of conv.participants) {
        const userId = userIdMap.get(participantId);
        if (userId) {
          await ctx.db.insert("conversationMembers", {
            conversationId: id,
            userId,
          });
        }
      }
    }

    // Create messages and track last message per conversation
    const lastMessageMap = new Map<number, Id<"messages">>();
    for (const msg of messages) {
      const conversationId = conversationIdMap.get(msg.conversationId);
      const senderId = userIdMap.get(msg.userId);

      if (conversationId && senderId) {
        const messageId = await ctx.db.insert("messages", {
          conversationId,
          senderId,
          type: msg.type,
          body: msg.body,
          image: msg.image,
          createdAt: msg.createdAt,
          reactionCounts: msg.reactions,
        });
        lastMessageMap.set(msg.conversationId, messageId);
      }
    }

    // Update conversations with lastMessageId
    for (const [convId, messageId] of lastMessageMap) {
      const conversationId = conversationIdMap.get(convId);
      if (conversationId) {
        await ctx.db.patch(conversationId, { lastMessageId: messageId });
      }
    }

    return {
      status: "success",
      cleared: true,
      users: users.length,
      conversations: conversations.length,
      messages: messages.length,
    };
  },
});
