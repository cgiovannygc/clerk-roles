"use client";

import { useQuery } from "convex/react";
import PurchasesDataByUser from "./purchasesData";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export default function PurchasesMain() {
  const user = useQuery(api.users.currentUser);
  if (user === undefined) {
    return (
      <div className="app-page">
        <div className="app-shell">
          <div className="app-card p-6 text-center text-(--app-text)">
            Cargando tus compras...
          </div>
        </div>
      </div>
    );
  }

  if (!user) throw new Error("Usuario no autenticado");

  return (
    <section className="app-shell">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <h2 className="app-title">Mis compras</h2>
        <Link className="app-pill-button" href={"/store"}>
          Volver a la tienda
        </Link>
      </div>

      <header className="app-hero mb-6">
        <p className="app-section-label">Mi historial</p>
        <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-(--app-title)">
          Revisa todos tus pedidos
        </h3>
        <p className="app-body-text mt-3 max-w-2xl">
          Consulta estado, cantidad, fecha y monto pagado en cada compra.
        </p>
      </header>

      <PurchasesDataByUser user={user} />
    </section>
  );
}
