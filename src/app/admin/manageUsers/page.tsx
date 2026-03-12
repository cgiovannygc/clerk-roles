import Link from "next/link";
import { SearchUsers } from "../SearchUsers";
import { clerkClient } from "@clerk/nextjs/server";
import { deleteUser } from "../_actions";

export default async function manageUsers(params: {
  searchParams: Promise<{ search?: string }>;
}) {
  const query = (await params.searchParams).search;
  const client = await clerkClient();
  const users = query
    ? (await client.users.getUserList({ query })).data
    : (await client.users.getUserList()).data;

  return (
    <div className="app-page">
      <section className="app-shell flex w-full flex-col gap-5">
        <div className="app-hero">
          <p className="app-section-label">Modulo de usuarios</p>
          <h1 className="app-title mt-3">Administra cuentas registradas</h1>
          <p className="app-body-text mt-3 max-w-2xl">
            Revisa usuarios rapidamente y elimina cuentas cuando necesites
            limpiar o moderar el sistema.
          </p>
        </div>

        <div className="flex items-start">
          <Link
            href="/admin"
            className="app-pill-button inline-flex items-center gap-2 px-4"
          >
            <span aria-hidden="true">←</span>
            <span>Volver al dashboard</span>
          </Link>
        </div>

        <SearchUsers />

        {query && users.length === 0 && (
          <p className="app-card p-4 text-sm text-(--app-text)">
            No se encontraron usuarios para {query}.
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {users.map((user) => {
            const email = user.emailAddresses.find(
              (e) => e.id === user.primaryEmailAddressId,
            )?.emailAddress;
            const currentRole =
              (user.publicMetadata.role as string) || "Sin rol";
            const normalizedRole = currentRole.toLowerCase();
            const rolePillClass =
              normalizedRole === "admin"
                ? "border-[#cce2dc] bg-[#eef7f4] text-[#0f4f43]"
                : normalizedRole === "user"
                  ? "border-[#dbe2ea] bg-[#f4f7fa] text-[#324152]"
                  : "border-[#eceff4] bg-[#fafbfd] text-[#7a8596]";
            const fullName = [user.firstName, user.lastName]
              .filter(Boolean)
              .join(" ")
              .trim();
            const initials =
              (user.firstName?.[0] || "U") + (user.lastName?.[0] || "");

            return (
              <article
                key={user.id}
                className="app-card group p-4 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative mb-4 flex h-36 items-center justify-center overflow-hidden rounded-xl bg-[#f1f4f7]">
                  <span className="absolute right-3 top-3 rounded-full border border-[#d2d7e0] bg-white px-2 py-1 text-xs text-[#6b7482]">
                    {currentRole}
                  </span>
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#d9e8e4] text-xl font-black text-[#0f4f43] transition group-hover:scale-105">
                    {user.imageUrl ? (
                      <img
                        width={80}
                        height={80}
                        src={user.imageUrl}
                        alt={`Imagen de ${user.firstName}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                </div>

                <p className="line-clamp-1 text-base font-bold tracking-tight text-[#202735]">
                  {fullName || "Usuario sin nombre"}
                </p>
                <p className="mt-1 min-h-10 break-all text-xs text-[#697282]">
                  {email}
                </p>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7a8596]">
                    Rol actual
                  </p>
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${rolePillClass}`}
                  >
                    {currentRole}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <form
                    action={async (formData) => {
                      "use server";
                      await deleteUser(formData);
                    }}
                  >
                    <input type="hidden" value={user.id} name="id" />
                    <button
                      type="submit"
                      className="rounded-full border border-[#f2c8c8] bg-[#fff5f5] px-4 py-2 text-sm font-semibold text-[#a93b3b] transition hover:border-[#e09a9a] hover:bg-[#fdeaea]"
                    >
                      Eliminar usuario
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
