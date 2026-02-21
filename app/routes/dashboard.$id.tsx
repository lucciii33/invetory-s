import { useParams, Link } from "react-router";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { id } = useParams();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0f] font-sans overflow-hidden relative">
      {/* Blobs */}
      <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-teal-500/5 blur-[80px] pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between px-12 py-8 border-b border-white/5">
        <span className="text-white font-bold text-lg tracking-tight">
          inventory·s
        </span>
        <span className="text-xs text-white/30 font-light">uid: {id}</span>
      </header>

      {/* Centro */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-81px)] gap-4 px-8">
        {/* Saludo */}
        <div
          className={`text-center mb-12 transition-all duration-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <p className="text-xs font-medium tracking-[0.14em] uppercase text-white/30 mb-3">
            Bienvenido de vuelta
          </p>
          <h1 className="text-5xl font-extrabold text-white tracking-tight leading-tight">
            ¿Qué haremos hoy?
          </h1>
        </div>

        {/* Cards */}
        <div className="flex gap-5 flex-wrap justify-center">
          {/* Inventario */}
          <Link
            to="/inventory"
            className={`group relative bg-white/[0.03] border border-white/[0.08] rounded-3xl p-12 w-[280px] no-underline
              transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:border-white/20 hover:bg-white/[0.06]
              ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
            `}
            style={{ transitionDelay: visible ? "150ms" : "0ms" }}
          >
            {/* Glow */}
            <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_50%_0%,rgba(99,102,241,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="w-13 h-13 rounded-2xl bg-indigo-500/15 flex items-center justify-center text-2xl mb-7">
              📦
            </div>
            <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-white/35 mb-2">
              Gestión
            </p>
            <h2 className="text-2xl font-extrabold text-white mb-3 leading-tight">
              Inventario
            </h2>
            <p className="text-sm text-white/40 leading-relaxed font-light">
              Administra tus productos, stock y categorías en un solo lugar.
            </p>

            {/* Arrow */}
            <span className="absolute bottom-10 right-10 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 text-sm transition-all duration-300 group-hover:border-white/40 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </Link>

          {/* Órdenes */}
          <Link
            to="/orders"
            className={`group relative bg-white/[0.03] border border-white/[0.08] rounded-3xl p-12 w-[280px] no-underline
              transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:border-white/20 hover:bg-white/[0.06]
              ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
            `}
            style={{ transitionDelay: visible ? "300ms" : "0ms" }}
          >
            {/* Glow */}
            <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_50%_0%,rgba(20,184,166,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="w-13 h-13 rounded-2xl bg-teal-500/15 flex items-center justify-center text-2xl mb-7">
              🛒
            </div>
            <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-white/35 mb-2">
              Seguimiento
            </p>
            <h2 className="text-2xl font-extrabold text-white mb-3 leading-tight">
              Mis Órdenes
            </h2>
            <p className="text-sm text-white/40 leading-relaxed font-light">
              Revisa el estado de tus pedidos, entregas y historial.
            </p>

            {/* Arrow */}
            <span className="absolute bottom-10 right-10 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 text-sm transition-all duration-300 group-hover:border-white/40 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
