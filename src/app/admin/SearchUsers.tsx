"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const SearchUsers = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") ?? "";

  return (
    <form
      className="app-card p-5"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const queryTerm = (formData.get("search") as string).trim();

        if (!queryTerm) {
          router.push(pathname);
          return;
        }

        router.push(pathname + "?search=" + encodeURIComponent(queryTerm));
      }}
    >
      <label
        htmlFor="search"
        className="text-lg font-bold tracking-tight text-(--app-title)"
      >
        Buscar usuarios
      </label>
      <p className="app-body-text mt-1">
        Encuentra usuarios por nombre o correo para administrar su cuenta.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          id="search"
          name="search"
          type="text"
          defaultValue={currentSearch}
          placeholder="Buscar por nombre o email"
          className="app-input h-11 flex-1 rounded-full"
        />
        <div className="flex gap-2 sm:w-auto">
          <button type="submit" className="app-pill-button-solid h-11">
            Buscar
          </button>
          {currentSearch && (
            <button
              type="button"
              onClick={() => router.push(pathname)}
              className="app-pill-button-soft h-11"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>
    </form>
  );
};
