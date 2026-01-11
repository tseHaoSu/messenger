import { ConvexError } from "convex/values";
import { QueryCtx, MutationCtx } from "../_generated/server";

export async function getAuthenticatedUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError({
      code: "UNAUTHORIZED",
      message: "User must be authenticated.",
    });
  }
  return identity;
}

export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const identity = await getAuthenticatedUser(ctx);

  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
    .unique();

  if (!user) {
    throw new ConvexError({
      code: "NOT_FOUND",
      message: "User not found.",
    });
  }

  return user;
}
