import { SearchUsers } from "@src/app/admin/SearchUsers";
import { clerkClient } from "@clerk/nextjs/server";
import { removeRole, setRole } from "@src/app/admin/_actions";
import Link from "next/link";

export default async function ChangeRolesAdmin(params: {
  searchParams: Promise<{ search?: string }>;
}) {
  const query = (await params.searchParams).search;
  const client = await clerkClient();
  const users = query
    ? (await client.users.getUserList({ query })).data
    : (await client.users.getUserList()).data;

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-6">
      <div className="flex items-start">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-amber-700"
        >
          <span aria-hidden="true">⬅️</span>
          <span>Volver al dashboard</span>
        </Link>
      </div>

      <SearchUsers />

      {query && users.length === 0 && (
        <p className="rounded-lg border border-border bg-background/80 p-4 text-sm text-muted-foreground backdrop-blur">
          No se encontraron usuarios para {query}.
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {users.map((user) => {
          const email = user.emailAddresses.find(
            (e) => e.id === user.primaryEmailAddressId,
          )?.emailAddress;
          const currentRole = (user.publicMetadata.role as string) || "Sin rol";
          const normalizedRole = currentRole.toLowerCase();
          const rolePillClass =
            normalizedRole === "admin"
              ? "border-foreground/30 bg-foreground/10 text-foreground"
              : normalizedRole === "user"
                ? "border-border bg-muted text-foreground"
                : "border-border bg-background text-muted-foreground";

          return (
            <article
              key={user.id}
              className="rounded-lg border-2 bg-background/80 p-4 backdrop-blur"
            >
              <div className="mb-4 space-y-1">
                <div className="mb-2">
                  <img
                    width={50}
                    src={user.imageUrl}
                    alt={`Imagen de ${user.firstName}`}
                    className="rounded-4xl mb-1"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-wide text-foreground p-1">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground p-1">{email}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground p-1">
                  <span>Rol actual:</span>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide ${rolePillClass} p-1`}
                  >
                    {currentRole}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap justify-start gap-2">
                <form
                  action={async (formData) => {
                    "use server";
                    await setRole(formData);
                  }}
                >
                  <input type="hidden" value={user.id} name="id" />
                  <input type="hidden" value="user" name="role" />
                  <button
                    type="submit"
                    className="rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-green-700"
                  >
                    Hacer usuario
                  </button>
                </form>
                <form
                  action={async (formData) => {
                    "use server";
                    await setRole(formData);
                  }}
                >
                  <input type="hidden" value={user.id} name="id" />
                  <input type="hidden" value="admin" name="role" />
                  <button
                    type="submit"
                    className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background transition-colors hover:bg-red-600"
                  >
                    Hacer admin
                  </button>
                </form>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
