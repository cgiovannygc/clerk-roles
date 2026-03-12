import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="app-page">
      <section className="app-shell">
        <div className="app-hero mb-8">
          <p className="app-section-label">Shopcart admin</p>
          <h1 className="app-title mt-3 md:text-4xl">
            Gestiona usuarios y permisos desde un solo lugar
          </h1>
          <p className="app-body-text mt-3 max-w-2xl md:text-base">
            Usa los modulos del panel para actualizar roles, revisar cuentas y
            mantener el control administrativo de la plataforma.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Link
            className="app-card group p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            href={"/admin/changeRoles"}
          >
            <div className="relative mb-4 flex h-32 items-center justify-center overflow-hidden rounded-xl bg-[#f1f4f7]">
              <span className="absolute right-3 top-3 rounded-full border border-[#d2d7e0] bg-white px-2 py-1 text-xs text-[#6b7482]">
                Roles
              </span>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#d9e8e4] text-xl font-black text-[#0f4f43] transition group-hover:scale-105">
                AR
              </div>
            </div>
            <h2 className="text-xl font-bold text-[#1f2733]">
              Administrar roles
            </h2>
            <p className="mt-2 text-sm text-[#667080]">
              Define permisos de admin o usuario con una vista clara y directa.
            </p>
            <span className="mt-5 inline-flex items-center text-sm font-semibold text-[#0f4f43] transition group-hover:translate-x-1">
              Abrir modulo
            </span>
          </Link>
          <Link
            className="app-card group p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            href={"/admin/manageUsers"}
          >
            <div className="relative mb-4 flex h-32 items-center justify-center overflow-hidden rounded-xl bg-[#f1f4f7]">
              <span className="absolute right-3 top-3 rounded-full border border-[#d2d7e0] bg-white px-2 py-1 text-xs text-[#6b7482]">
                Usuarios
              </span>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#d9e8e4] text-xl font-black text-[#0f4f43] transition group-hover:scale-105">
                AU
              </div>
            </div>
            <h2 className="text-xl font-bold text-[#1f2733]">
              Administrar usuarios
            </h2>
            <p className="mt-2 text-sm text-[#667080]">
              Revisa cuentas, identifica usuarios y elimina registros cuando
              haga falta.
            </p>
            <span className="mt-5 inline-flex items-center text-sm font-semibold text-[#0f4f43] transition group-hover:translate-x-1">
              Abrir modulo
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
