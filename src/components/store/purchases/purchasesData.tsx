"use client";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

interface PurchasesDataByUserProps {
  user: Doc<"users">;
}

export default function PurchasesDataByUser({
  user,
}: PurchasesDataByUserProps) {
  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat("es-MX", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(timestamp));
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusClass = (status: "pending" | "completed" | "refunded") => {
    if (status === "completed") {
      return "border-[#cce2dc] bg-[#eef7f4] text-[#0f4f43]";
    }

    if (status === "pending") {
      return "border-[#f3dfb3] bg-[#fff4dc] text-[#9a6a13]";
    }

    return "border-[#dbe2ea] bg-[#f4f7fa] text-[#4d5868]";
  };

  const purchasesOfUser = useQuery(api.purchases.getPurchasesByUser, {
    userId: user._id,
  });

  if (purchasesOfUser === undefined)
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-72 animate-pulse rounded-2xl border border-[#e6e8ee] bg-white"
          />
        ))}
      </div>
    );

  if (!purchasesOfUser || purchasesOfUser.length === 0)
    return (
      <div className="rounded-2xl border border-dashed border-[#d8dde6] bg-white p-10 text-center shadow-sm">
        <h3 className="text-lg font-semibold text-[#1f2733]">
          Aun no tienes compras registradas
        </h3>
        <p className="mt-2 text-sm text-[#667080]">
          Cuando hagas una compra en la tienda aparecera aqui automaticamente.
        </p>
      </div>
    );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {purchasesOfUser.map((purchase) => {
        const fallbackName = "Producto sin nombre";
        const imageUrl = purchase.product?.imageUrl;
        const productName = purchase.product?.name ?? fallbackName;
        const initials = productName.charAt(0).toUpperCase();

        return (
          <article
            key={purchase._id}
            className="group rounded-2xl border border-[#e6e8ee] bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative mb-4 flex h-40 items-center justify-center overflow-hidden rounded-xl bg-[#f1f4f7]">
              <span
                className={`absolute right-3 top-3 inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                  purchase.status,
                )}`}
              >
                {purchase.status}
              </span>

              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#d9e8e4] text-4xl font-black text-[#0f4f43] transition group-hover:scale-105">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="h-full w-full object-cover"
                    src={imageUrl}
                    alt={`Imagen de ${productName}`}
                  />
                ) : (
                  initials
                )}
              </div>
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7a8596]">
              Compra
            </p>
            <h3 className="mt-2 line-clamp-1 text-lg font-bold text-[#202735]">
              {productName}
            </h3>

            <div className="mt-4 space-y-3 text-sm text-[#5f6876]">
              <div className="flex items-center justify-between gap-3">
                <span>Cantidad</span>
                <span className="rounded-full bg-[#eef3f2] px-2 py-1 text-xs font-semibold text-[#355c54]">
                  {purchase.quantity}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Precio pagado</span>
                <span className="text-base font-extrabold text-[#111827]">
                  {formatPrice(purchase.pricePaid)}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span>Fecha</span>
                <span className="max-w-[60%] text-right text-xs font-medium text-[#697282]">
                  {formatDate(purchase.createdAt)}
                </span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
