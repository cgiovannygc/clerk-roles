"use client";

import { SignedIn, SignedOut, useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";

export default function SideBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = useAuth();
  const roleUser = user.sessionClaims?.metadata?.role;

  return (
    <div>
      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-[#e6e8ee] bg-white/90 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Left: menu + brand */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="rounded-xl border border-[#e2e5ec] bg-white px-3 py-1.5 text-sm font-medium text-[#3d4451] transition hover:border-[#0f4f43] hover:text-[#0f4f43]"
            >
              Menú
            </button>
          </div>

          {/* Center: nav links */}
          <div className="hidden items-center gap-1 md:flex">
            {[
              { href: "/home", label: "Inicio" },
              { href: "/store", label: "Tienda" },
              { href: "/about", label: "About" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-full px-4 py-1.5 text-sm font-medium text-[#4b5563] transition hover:bg-[#f1f5f3] hover:text-[#0f4f43]"
              >
                {label}
              </Link>
            ))}
            {roleUser === "admin" && (
              <Link
                href="/admin"
                className="rounded-full px-4 py-1.5 text-sm font-medium text-[#4b5563] transition hover:bg-[#f1f5f3] hover:text-[#0f4f43]"
              >
                Dashboard
              </Link>
            )}
            <SignedIn>
              <Link
                href="/tasks"
                className="rounded-full px-4 py-1.5 text-sm font-medium text-[#4b5563] transition hover:bg-[#f1f5f3] hover:text-[#0f4f43]"
              >
                Tareas
              </Link>
            </SignedIn>
          </div>

          {/* Right: auth */}
          <div className="flex items-center gap-2">
            {user.isLoaded ? (
              <>
                <SignedIn>
                  <UserButton />
                </SignedIn>
                <SignedOut>
                  <Link
                    href="/signup"
                    className="rounded-full border border-[#e2e5ec] bg-white px-4 py-1.5 text-sm font-medium text-[#3d4451] transition hover:border-[#0f4f43] hover:text-[#0f4f43]"
                  >
                    Registrarse
                  </Link>
                  <Link
                    href="/login"
                    className="rounded-full bg-[#0f4f43] px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-[#0a3d33]"
                  >
                    Iniciar sesión
                  </Link>
                </SignedOut>
              </>
            ) : null}
          </div>
        </div>
      </nav>

      {/* Overlay */}
      <div
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-[#e6e8ee] bg-white p-5 shadow-xl transition-all duration-300 ease-out ${
          isSidebarOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-xl border border-[#e2e5ec] px-2.5 py-1 text-sm text-[#3d4451] transition hover:border-[#0f4f43] hover:text-[#0f4f43]"
          >
            Cerrar
          </button>
        </div>

        <nav className="flex flex-col gap-1 text-sm">
          {[
            { href: "/home", label: "Inicio" },
            { href: "/store", label: "Tienda" },
            { href: "/about", label: "About" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsSidebarOpen(false)}
              className="rounded-xl px-3 py-2 font-medium text-[#3d4451] transition hover:bg-[#f1f5f3] hover:text-[#0f4f43]"
            >
              {label}
            </Link>
          ))}
          {roleUser === "admin" && (
            <Link
              href="/admin"
              onClick={() => setIsSidebarOpen(false)}
              className="rounded-xl px-3 py-2 font-medium text-[#3d4451] transition hover:bg-[#f1f5f3] hover:text-[#0f4f43]"
            >
              Dashboard
            </Link>
          )}
          <SignedIn>
            <Link
              href="/tasks"
              onClick={() => setIsSidebarOpen(false)}
              className="rounded-xl px-3 py-2 font-medium text-[#3d4451] transition hover:bg-[#f1f5f3] hover:text-[#0f4f43]"
            >
              Tareas
            </Link>
          </SignedIn>
        </nav>

        <div className="mt-auto border-t border-[#e6e8ee] pt-5">
          <SignedOut>
            <div className="flex flex-col gap-2">
              <Link
                href="/signup"
                onClick={() => setIsSidebarOpen(false)}
                className="rounded-xl border border-[#e2e5ec] px-4 py-2 text-center text-sm font-medium text-[#3d4451] transition hover:border-[#0f4f43] hover:text-[#0f4f43]"
              >
                Registrarse
              </Link>
              <Link
                href="/login"
                onClick={() => setIsSidebarOpen(false)}
                className="rounded-xl bg-[#0f4f43] px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-[#0a3d33]"
              >
                Iniciar sesión
              </Link>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-3">
              <UserButton />
              <span className="text-xs text-[#697282]">Mi cuenta</span>
            </div>
          </SignedIn>
        </div>
      </aside>
    </div>
  );
}
