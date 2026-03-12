import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    firstName: v.string(),
    lastName: v.optional(v.string()),
    email: v.string(),
    role: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  }).index("by_clerk_id", ["clerkId"]),
  products: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(),
    imageUrl: v.optional(v.string()),
    stock: v.optional(v.number()),
  }),
  /** Tabla intermedia para guardar los productos que compro cada usuario */
  purchases: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    quantity: v.number(),
    pricePaid: v.number(),
    createdAt: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("refunded"),
    ),
  })
    .index("by_user", ["userId"]) // compras de un usuario
    .index("by_product", ["productId"]) // compras de un producto
    .index("by_user_and_product", ["userId", "productId"]), // ambos juntos
  tasks: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.string(),
    completed: v.boolean(),
  })
    .index("by_user_id", ["userId"])
    .index("by_user_and_complete", ["userId", "completed"]),
});
