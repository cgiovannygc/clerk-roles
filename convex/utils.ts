import { MutationCtx, QueryCtx } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { UserIdentity } from "convex/server";

/** Funcion para obtener la información del usuario autenticado desde Convex */
export async function getInfoUserFromConvex(
  ctx: QueryCtx | MutationCtx,
): Promise<Doc<"users">> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();

  if (!user) throw new Error("Usuario no encontrado");
  return user;
}

/** Funcion para obtener la información del usuario autenticado desde Clerk */
export async function getInfoUserFromClerk(
  ctx: QueryCtx | MutationCtx,
): Promise<UserIdentity> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  return identity;
}

/** Funcion para verificar si el usuario está autenticado sin retorno de informacion */
export async function isAutenticateInClerk(
  ctx: QueryCtx | MutationCtx,
): Promise<null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  return null;
}
