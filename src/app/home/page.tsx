import Link from "next/link";

export default function HomePage() {
  return (
    <div className="w-full h-full flex justify-center items-center p-5">
      <div className="font-bold text-6xl">
        <Link href={"/tasks"}>Ir a las tareas</Link>
      </div>
    </div>
  );
}
