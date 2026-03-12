"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProductAndUserProps } from "@/lib/props/props";

interface ProductProps {
  products: Doc<"products">[];
  user: Doc<"users">;
}

export default function Product({ products, user }: ProductProps) {
  const router = useRouter();

  const handlePay = async (product: Doc<"products">) => {
    try {
      const payload: ProductAndUserProps = { product, user };
      const res = await fetch("/api/checkout", {
        // hacia a donde hare la peticion
        method: "POST", // metodo de la peticion que cachara el backend
        headers: {
          // indicarle que los datos iran en formato json
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // converimos el objeto en texto con formato json para enviarlo
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
    <section className="app-shell">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h2 className="app-title">Todos los productos</h2>
        <Link className="app-pill-button" href="/store/purchases">
          Mis compras
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <article
            key={product._id}
            className="app-card group p-4 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative mb-4 flex h-40 items-center justify-center overflow-hidden rounded-xl bg-[#f1f4f7]">
              <span className="absolute right-3 top-3 rounded-full border border-[#d2d7e0] bg-white px-2 py-1 text-xs text-[#6b7482]">
                Nuevo
              </span>
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#d9e8e4] text-4xl font-black text-[#0f4f43] transition group-hover:scale-105">
                {product.name.charAt(0).toUpperCase()}
              </div>
            </div>

            <h3 className="line-clamp-1 text-sm font-bold text-[#202735]">
              {product.name}
            </h3>
            <p className="mt-1 min-h-10 line-clamp-2 text-xs text-[#697282]">
              {product.description}
            </p>

            <div className="mt-4 flex items-end justify-between">
              <p className="text-xl font-extrabold leading-none text-[#111827]">
                ${product.price}
              </p>
              <p className="rounded-full bg-[#eef3f2] px-2 py-1 text-xs font-medium text-[#355c54]">
                Stock {product.stock}
              </p>
            </div>

            <button
              className="mt-4 w-full rounded-full border border-[#0f4f43] bg-white px-4 py-2 text-sm font-semibold text-[#0f4f43] transition hover:bg-[#0f4f43] hover:text-white"
              onClick={() => handlePay(product)}
            >
              Add to cart
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
