import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="text-3xl text-center font-bold h-full p-5 flex items-center justify-center">
      <div>
        <span className="text-7xl mb-2">🎉</span>
        <h1>Thanks for buy</h1>
        <Link href="/store" className="text-blue-500 block mt-4">
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
}
