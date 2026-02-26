"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";

export default function SideBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = useAuth();
  const roleUser = user.sessionClaims?.metadata?.role;

  return (
    <div>
      <nav className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/75">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
          <button
            type="button"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-gray-700"
          >
            Menú
          </button>
          <p className="text-sm font-semibold tracking-wide">
            Página principal
          </p>
          <div className="flex items-center gap-2">
            {user.isLoaded ? (
              user.isSignedIn ? (
                <UserButton />
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/signup"
                    className="rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    Registrarse
                  </Link>
                  <Link
                    href="/login"
                    className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
                  >
                    Iniciar sesión
                  </Link>
                </div>
              )
            ) : (
              <p className="text-sm text-gray-500"></p>
            )}
          </div>
        </div>
      </nav>
      <div
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-foreground/20 transition-opacity duration-300 ease-out ${
          isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 border-r border-border bg-background/95 p-4 backdrop-blur transition-all duration-300 ease-out ${
          isSidebarOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold tracking-wide">Opciones</p>
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-md border border-border px-2.5 py-1 text-sm transition-colors hover:bg-gray-700"
          >
            Cerrar
          </button>
        </div>
        <nav className="flex flex-col gap-2 text-sm">
          <Link
            href="/home"
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-md px-2 py-1.5 transition-colors hover:bg-gray-800"
          >
            Inicio
          </Link>
          {roleUser === "admin" && (
            <Link
              href="/admin"
              onClick={() => setIsSidebarOpen(false)}
              className="rounded-md px-2 py-1.5 transition-colors hover:bg-gray-800"
            >
              Dashboard
            </Link>
          )}
          <Link
            href="/about"
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-md px-2 py-1.5 transition-colors hover:bg-gray-800"
          >
            About
          </Link>
        </nav>
      </aside>
    </div>
  );
}
