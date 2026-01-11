import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./lib/utils";

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await getAuthenticatedUser(ctx);

    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (existingUser) {
      // Update existing user if name/email changed
      if (
        existingUser.name !== identity.name ||
        existingUser.email !== identity.email ||
        existingUser.image !== identity.pictureUrl
      ) {
        await ctx.db.patch(existingUser._id, {
          name: identity.name ?? existingUser.name,
          email: identity.email ?? existingUser.email,
          image: identity.pictureUrl,
        });
      }
      return existingUser._id;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      name: identity.name ?? "Unknown",
      email: identity.email ?? "",
      image: identity.pictureUrl,
      tokenIdentifier: identity.tokenIdentifier,
    });

    return userId;
  },
});

export const current = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    return user;
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    await getAuthenticatedUser(ctx);
    return await ctx.db.query("users").collect();
  },
});
