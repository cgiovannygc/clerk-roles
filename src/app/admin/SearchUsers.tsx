"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const SearchUsers = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") ?? "";

  return (
    <form
      className="flex w-full max-w-xl flex-col gap-2 rounded-lg border border-border bg-background/80 p-4 backdrop-blur"
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
        className="text-sm font-semibold tracking-wide text-foreground"
      >
        Buscar usuarios
      </label>
      <div className="flex items-center gap-2">
        <input
          id="search"
          name="search"
          type="text"
          defaultValue={currentSearch}
          placeholder="Nombre o email"
          className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/40"
        />
        <button
          type="submit"
          className="h-10 rounded-md bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Buscar
        </button>
      </div>
    </form>
  );
};
