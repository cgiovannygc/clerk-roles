"use client";

import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Doc } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

export default function Products() {
  const router = useRouter();
  const products = useQuery(api.products.getProducts);
  if (!products) {
    return (
      <div className="w-full flex justify-center items-center text-6xl font-bold">
        <h2>Sin productos...</h2>
      </div>
    );
  }
  const handlePay = async (product: Doc<"products">) => {
    try {
      const res = await fetch("/api/checkout", {
        // hacia a donde hare la peticion
        method: "POST", // etodo de la peticion que cachara el backend
        headers: {
          // indicarle que los datos iran en formato json dentro de la request
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product), // converimos el objeto en json para enviarlo
      });

      if (!res.ok) {
        // verificar que no fallo la peticion
        throw new Error("Failed to create checkout session");
      }

      const session = await res.json();

      if (session.url) {
        router.push(session.url);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      // Consider showing an error message to the user
    }
  };
  return (
    <>
      <h1 className="text-5xl mb-10 text-center">Todos los productos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, i) => (
          <div
            key={i}
            className="bg-black border border-white text-center p-4 rounded-md text-white"
          >
            <h2 className="font-bold text-lg">{product.name}</h2>
            <p className="text-xs font-light">{product.description}</p>
            <p className="text-2xl font-bold">$ {product.price}</p>
            <p className="">Disponibles: {product.stock}</p>
            <button
              className="bg-black border border-white transition-colors hover:bg-green-700 text-white px-4 py-2 rounded-md mt-4 w-full"
              onClick={() => handlePay(product)}
            >
              Comprar
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
