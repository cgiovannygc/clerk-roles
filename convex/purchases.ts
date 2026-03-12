// convex/purchases.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createPurchase = mutation({
  args: {
    userId: v.id("users"),
    productId: v.id("products"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) throw new Error("Producto no encontrado");

    // 2. Verificamos stock
    if (product.stock && product.stock < args.quantity) {
      throw new Error("Stock insuficiente");
    }

    const purchaseId = await ctx.db.insert("purchases", {
      userId: args.userId,
      productId: args.productId,
      quantity: args.quantity,
      pricePaid: product.price, // precio al momento de comprar
      createdAt: Date.now(), // timestamp actual
      status: "completed",
    });

    if (product.stock) {
      await ctx.db.patch(args.productId, {
        stock: product.stock - args.quantity,
      });
    }

    return purchaseId;
  },
});

export const getPurchasesByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    // 1. Obtenemos todas las compras del usuario
    const purchases = await ctx.db
      .query("purchases")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // 2. Por cada compra, obtenemos el producto
    const purchasesWithProducts = await Promise.all(
      purchases.map(async (purchase) => {
        const product = await ctx.db.get(purchase.productId);
        return {
          ...purchase,
          product, // adjuntamos la info del producto
        };
      }),
    );

    return purchasesWithProducts;
  },
});
