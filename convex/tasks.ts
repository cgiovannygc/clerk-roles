import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import {
  getInfoUserFromClerk,
  getInfoUserFromConvex,
  isAutenticateInClerk,
} from "./utils";

/** Función para obtener una tarea por su ID */
export const getTaskById = query({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, { id }) => {
    const task = await ctx.db.get("tasks", id);
    if (!task) throw new Error("Tarea no encontrada");
    return task;
  },
});

/** Query para recoger todas las tareas registradas del usuario autenticado */
export const getTaskByUser = query({
  handler: async (ctx) => {
    const userAutenticate = await getInfoUserFromConvex(ctx);
    return await ctx.db
      .query("tasks")
      .withIndex("by_user_id", (q) =>
        q.eq("userId", userAutenticate._id as Id<"users">),
      )
      .collect();
  },
});

/** Query para recoger todas las tareas completadas del usuario autenticado */
export const getCompletedTasks = query({
  handler: async (ctx) => {
    const userAutenticate = await getInfoUserFromConvex(ctx);
    return await ctx.db
      .query("tasks")
      .withIndex("by_user_and_complete", (q) =>
        q
          .eq("userId", userAutenticate._id as Id<"users">)
          .eq("completed", true),
      )
      .collect();
  },
});

export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.string(),
  },
  async handler(ctx, { title, description }) {
    const identity = await getInfoUserFromClerk(ctx);
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) throw new Error("Usuario no encontrado");

    await ctx.db.insert("tasks", {
      userId: user._id as Id<"users">,
      title,
      description,
      completed: false,
    });
  },
});

export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    title: v.string(),
    description: v.string(),
  },
  async handler(ctx, { taskId, title, description }) {
    await isAutenticateInClerk(ctx);
    await ctx.db.patch("tasks", taskId, {
      title,
      description,
    });
  },
});

export const updateStatusOfTask = mutation({
  args: {
    taskId: v.id("tasks"),
    status: v.boolean(),
  },
  async handler(ctx, args) {
    await isAutenticateInClerk(ctx);
    await ctx.db.patch("tasks", args.taskId, {
      completed: args.status,
    });
  },
});

export const deleteTask = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  async handler(ctx, { taskId }) {
    await isAutenticateInClerk(ctx);
    await ctx.db.delete("tasks", taskId);
  },
});
