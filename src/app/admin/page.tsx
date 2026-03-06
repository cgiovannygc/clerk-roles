import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="w-full h-full mt-5">
      <div className="flex flex-col md:flex-row lg:flex-row items-center justify-center md:justify-around lg:justify-around">
        <Link
          className="border border-white bg-black transition-colors hover:bg-amber-700 text-white rounded-md px-4 py-2 w-4/12 text-center mb-2 md:mb-0 lg:mb-0"
          href={"/admin/changeRoles"}
        >
          Administrar roles
        </Link>
        <Link
          className="border border-white bg-black transition-colors hover:bg-emerald-700 text-white rounded-md px-4 py-2 w-4/12 text-center mt-2 md:mt-0 lg:mt-0"
          href={"/admin/manageUsers"}
        >
          Administrar usuarios
        </Link>
      </div>
    </div>
  );
}
