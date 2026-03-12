import { Doc } from "@/convex/_generated/dataModel";

export interface ProductAndUserProps {
  product: Doc<"products">;
  user: Doc<"users">;
}
