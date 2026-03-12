import Link from "next/link";

export default function HomePage() {
  return (
    <div className="w-full h-full flex justify-end items-center p-5">
      <div className="">
        <Link
          className="border border-white bg-black transition-colors hover:bg-amber-700 text-white px-4 py-2 rounded font-bold text-5xl"
          href={"/tasks"}
        >
          <span>Ir a las tareas </span>
          <span aria-hidden="true">➡️</span>
        </Link>
      </div>
    </div>
  );
}
