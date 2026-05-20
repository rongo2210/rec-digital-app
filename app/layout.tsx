import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-black text-white">

        {/* NAVBAR */}
        <header className="w-full px-6 py-4 flex items-center justify-between border-b border-white/10">
          
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-500 via-orange-400 to-cyan-400 flex items-center justify-center text-black font-black">
              R
            </div>
            <span className="font-bold text-lg">REC Digital</span>
          </Link>

          <nav className="flex gap-6 text-sm text-slate-300">
            <Link href="/" className="hover:text-white">
              Inicio
            </Link>
            <Link href="/Presupuesto/nuevo" className="hover:text-white">
              Nuevo presupuesto
            </Link>
          </nav>

        </header>

        {/* CONTENIDO */}
        <main>{children}</main>

      </body>
    </html>
  );
}