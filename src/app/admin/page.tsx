import { redirect } from "next/navigation";
import { checkRole } from "@/utils/roles";
import { SearchUsers } from "./SearchUsers";
import { clerkClient } from "@clerk/nextjs/server";
import { removeRole, setRole } from "./_actions";

export default async function AdminDashboard(params: {
  searchParams: Promise<{ search?: string }>;
}) {
  if (!checkRole("admin")) redirect("/");

  const query = (await params.searchParams).search;
  const client = await clerkClient();
  const users = query ? (await client.users.getUserList({ query })).data : [];

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-6">
      <SearchUsers />
      {!query && (
        <p className="rounded-lg border border-border bg-background/80 p-4 text-sm text-muted-foreground backdrop-blur">
          Busca por nombre o email para administrar roles.
        </p>
      )}

      {query && users.length === 0 && (
        <p className="rounded-lg border border-border bg-background/80 p-4 text-sm text-muted-foreground backdrop-blur">
          No se encontraron usuarios para {query}.
        </p>
      )}

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
            className="rounded-lg border border-border bg-background/80 p-4 backdrop-blur"
          >
            <div className="mb-4 space-y-1">
              <p className="text-sm font-semibold tracking-wide text-foreground">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-muted-foreground">{email}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Rol actual:</span>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide ${rolePillClass}`}
                >
                  {currentRole}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
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
                  className="rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Hacer admin
                </button>
              </form>

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
                  className="rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Hacer usuario
                </button>
              </form>

              <form
                action={async (formData) => {
                  "use server";
                  await removeRole(formData);
                }}
              >
                <input type="hidden" value={user.id} name="id" />
                <button
                  type="submit"
                  className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
                >
                  Remover Rol
                </button>
              </form>
            </div>
          </article>
        );
      })}
    </section>
  );
}
