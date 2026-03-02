import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getProducts = query({
  handler: async (ctx) => {
    return ctx.db.query("products").collect();
  },
});

export const createProduct = mutation({
  args: {
    name: v.string(),
    price: v.number(),
    description: v.string(),
    imageUrl: v.string(),
    stock: v.number(),
  },
  handler: async (ctx, { name, price, description, imageUrl, stock }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Usuario no autorizado");
    }

    const id = await ctx.db.insert("products", {
      name,
      price,
      description,
      imageUrl,
      stock,
    });
    return id;
  },
});

export const updateProduct = mutation({
  args: {
    id: v.id("products"),
    name: v.string(),
    price: v.number(),
    description: v.string(),
    imageUrl: v.string(),
    stock: v.number(),
  },
  handler: async (ctx, { id, name, price, description, imageUrl, stock }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Usuario no autorizado");
    }
    await ctx.db.replace(id, {
      name,
      price,
      description,
      imageUrl,
      stock,
    });
  },
});

export const deleteProduct = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Usuario no autorizado");
    }
    await ctx.db.delete(id);
  },
});

export const getProductById = query({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const updateStockProduct = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    const product = await ctx.db.get(id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    return await ctx.db.patch("products", id, { stock: product.stock - 1 });
  },
});
