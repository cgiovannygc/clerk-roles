import {
  internalMutation,
  internalQuery,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server";

import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { UserJSON } from "@clerk/backend";

/**
 * Whether the current user is fully logged in, including having their information
 * synced from Clerk via webhook.
 *
 * Like all Convex queries, errors on expired Clerk token.
 */
export const userLoginStatus = query(
  async (
    ctx,
  ): Promise<
    | ["No JWT Token", null]
    | ["No Clerk User", null]
    | ["Logged In", Doc<"users">]
  > => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      // no JWT token, user hasn't completed login flow yet
      return ["No JWT Token", null];
    }
    const user = await getCurrentUser(ctx);
    if (user === null) {
      // If Clerk has not told us about this user we're still waiting for the
      // webhook notification.
      return ["No Clerk User", null];
    }
    return ["Logged In", user]; // return message and user for autenticate
  },
);

/** The current user, containing user preferences and Clerk user info. */
export const currentUser = query((ctx: QueryCtx) => getCurrentUser(ctx));

/** Get user by Clerk use id (AKA "subject" on auth)  */
export const getUser = internalQuery({
  args: { subject: v.string() },
  async handler(ctx, args) {
    return await userQuery(ctx, args.subject);
  },
});

/** */
export const createUserWithWebhookClerk = internalMutation({
  args: { clerkUser: v.any() },
  handler: async (ctx, { clerkUser }: { clerkUser: UserJSON }) => {
    const { id, first_name, last_name, email_addresses, image_url } = clerkUser;
    console.log(
      `----> CONVEX <---- Creating user: email: ${email_addresses[0].email_address} id: ${id}`,
    );

    await ctx.db.insert("users", {
      clerkId: id,
      firstName: first_name ?? "",
      lastName: last_name ?? "",
      email: email_addresses?.[0]?.email_address ?? "",
      role: "user",
      imageUrl: image_url ?? "",
    });
  },
});

/** Delete a user by clerk user ID. */
export const deleteUserWithWebhookClerk = internalMutation({
  args: { id: v.string() },
  async handler(ctx, { id }) {
    const userRecord = await userQuery(ctx, id);

    if (userRecord === null) {
      console.warn("can't delete user, does not exist", id);
    } else {
      console.log(`Deleting user with email: ${userRecord.email}, id: ${id}`);
      await ctx.db.delete(userRecord._id);
    }
  },
});

/** Update role of user selected. */
export const updateRolWithWebhookClerk = internalMutation({
  args: {
    clerkId: v.string(),
    role: v.union(v.literal("admin"), v.literal("user")),
  },
  handler: async (ctx, args) => {
    const userToUpdate = await userQuery(ctx, args.clerkId);
    console.log(
      `-----> CONVEX <----- Updating user: email: ${userToUpdate?.email}, role: ${args.role}`,
    );
    if (!userToUpdate)
      throw new Error(`User not found in convex, clerk id: ${args.clerkId}`);
    await ctx.db.patch("users", userToUpdate!._id, { role: args.role });
  },
});

/** Set the user preference of the color of their text. */
export const setRole = mutation({
  args: { role: v.string() },
  handler: async (ctx, { role }) => {
    const user = await mustGetCurrentUser(ctx);
    await ctx.db.patch(user._id, { role });
  },
});

// Helpers

export async function userQuery(
  ctx: QueryCtx,
  clerkUserId: string,
): Promise<Doc<"users"> | null> {
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkUserId))
    .unique();
}

export async function userById(
  ctx: QueryCtx,
  id: Id<"users">,
): Promise<Doc<"users"> | null> {
  return await ctx.db.get(id);
}

async function getCurrentUser(ctx: QueryCtx): Promise<Doc<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();

  if (identity === null) {
    throw new Error("----> getCurrentUser <----: Can't get current user");
  }
  return await userQuery(ctx, identity.subject);
}

export async function mustGetCurrentUser(ctx: QueryCtx): Promise<Doc<"users">> {
  const userRecord = await getCurrentUser(ctx);
  console.log(`----> mustGetCurrentUser <----, return: ${userRecord}`);
  return userRecord!;
}
