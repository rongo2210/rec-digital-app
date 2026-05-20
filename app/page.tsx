"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">

        <h1 className="text-5xl font-black">
          REC Digital
        </h1>

        <p className="text-slate-400 mt-4">
          Sistema inteligente de presupuestos
        </p>

        <button
          onClick={() => router.push("/Presupuesto/nuevo")}
          className="mt-10 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-orange-500 text-white font-bold"
        >
          Nuevo presupuesto
        </button>

      </div>
    </main>
  );
}