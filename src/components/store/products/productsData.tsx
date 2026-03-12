"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Product from "./product";

export default function ProductsData() {
  const productsData = useQuery(api.products.getProducts);
  const user = useQuery(api.users.userLoginStatus);

  if (!productsData) {
    return (
      <div className="w-full flex justify-center items-center text-6xl font-bold">
        <h2>Sin productos...</h2>
      </div>
    );
  }
  if (user === undefined) {
    return (
      <div className="w-full flex justify-center items-center text-6xl font-bold">
        <h2>Cargando...</h2>
      </div>
    );
  }
  if (!user || user[0] !== "Logged In") {
    throw new Error(
      `Usuario no logueado o sin información de Clerk, ${user[1]}`,
    );
  }

  return <Product products={productsData} user={user[1]} />;
}
