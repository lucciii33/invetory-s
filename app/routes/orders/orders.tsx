import { Link } from "react-router";
import { useState } from "react";

const mockOrders = [
  {
    _id: "1",
    orderNumber: "ORD-0001",
    customer: {
      name: "Carlos Méndez",
      email: "carlos@gmail.com",
      phone: "+1 555-0101",
    },
    items: [
      {
        product: "Laptop Dell XPS 15",
        quantity: 1,
        unitPrice: 1599,
        subtotal: 1599,
      },
      { product: "Cable HDMI 2m", quantity: 2, unitPrice: 15, subtotal: 30 },
    ],
    status: "accepted",
    inventoryDeducted: true,
    total: 1629,
    currency: "USD",
    notes: "Entregar en oficina",
    createdAt: "2024-01-15",
  },
  {
    _id: "2",
    orderNumber: "ORD-0002",
    customer: {
      name: "María González",
      email: "maria@empresa.com",
      phone: "+1 555-0102",
    },
    items: [
      {
        product: "Teclado Mecánico RGB",
        quantity: 3,
        unitPrice: 89,
        subtotal: 267,
      },
    ],
    status: "pending",
    inventoryDeducted: false,
    total: 267,
    currency: "USD",
    notes: "",
    createdAt: "2024-01-16",
  },
  {
    _id: "3",
    orderNumber: "ORD-0003",
    customer: {
      name: "Pedro Ramírez",
      email: "pedro@correo.com",
      phone: "+1 555-0103",
    },
    items: [
      { product: "Papel Bond A4", quantity: 10, unitPrice: 9, subtotal: 90 },
      {
        product: "Aceite de Motor 5W-30",
        quantity: 5,
        unitPrice: 22,
        subtotal: 110,
      },
    ],
    status: "cancelled",
    inventoryDeducted: false,
    total: 200,
    currency: "USD",
    notes: "Cliente canceló por demora",
    createdAt: "2024-01-17",
  },
  {
    _id: "4",
    orderNumber: "ORD-0004",
    customer: {
      name: "Ana Torres",
      email: "ana@shop.com",
      phone: "+1 555-0104",
    },
    items: [
      {
        product: "Laptop Dell XPS 15",
        quantity: 2,
        unitPrice: 1599,
        subtotal: 3198,
      },
    ],
    status: "pending",
    inventoryDeducted: false,
    total: 3198,
    currency: "USD",
    notes: "",
    createdAt: "2024-01-18",
  },
  {
    _id: "5",
    orderNumber: "ORD-0005",
    customer: {
      name: "Luis Castillo",
      email: "luis@ventas.com",
      phone: "+1 555-0105",
    },
    items: [
      {
        product: "Teclado Mecánico RGB",
        quantity: 1,
        unitPrice: 89,
        subtotal: 89,
      },
      { product: "Cable HDMI 2m", quantity: 4, unitPrice: 15, subtotal: 60 },
    ],
    status: "accepted",
    inventoryDeducted: true,
    total: 149,
    currency: "USD",
    notes: "",
    createdAt: "2024-01-19",
  },
];

const statusConfig = {
  pending: {
    label: "Pendiente",
    classes: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  accepted: {
    label: "Aceptada",
    classes: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  },
  cancelled: {
    label: "Cancelada",
    classes: "bg-red-500/10 text-red-400 border-red-500/20",
  },
};

export default function Orders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = mockOrders.filter((o) => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      {/* Blobs */}
      <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-teal-500/5 blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[80px] pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between px-12 py-8 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-white/30 hover:text-white/60 transition-colors text-sm"
          >
            ← volver
          </Link>
          <span className="text-white/10">|</span>
          <span className="text-white font-bold text-lg tracking-tight">
            inventory<span className="text-white/25">·s</span>
          </span>
        </div>
        <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all duration-300 cursor-pointer">
          <span className="text-lg leading-none">+</span>
          Nueva orden
        </button>
      </header>

      <div className="px-12 py-10 relative z-10">
        {/* Title + filtros */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-medium tracking-[0.14em] uppercase text-white/30 mb-2">
              Seguimiento
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Mis Órdenes
            </h1>
            <p className="text-white/40 text-sm mt-1 font-light">
              {mockOrders.length} órdenes en total
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filtro status */}
            <div className="flex gap-1 bg-white/[0.03] border border-white/[0.08] rounded-xl p-1">
              {["all", "pending", "accepted", "cancelled"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                    statusFilter === s
                      ? "bg-white/10 text-white font-medium"
                      : "text-white/30 hover:text-white/60"
                  }`}
                >
                  {s === "all"
                    ? "Todas"
                    : statusConfig[s as keyof typeof statusConfig].label}
                </button>
              ))}
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Buscar orden o cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all duration-300 w-64"
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] bg-white/[0.03] border-b border-white/[0.06] px-6 py-3">
            {["# Orden", "Cliente", "Items", "Total", "Estado", "Fecha"].map(
              (col) => (
                <span
                  key={col}
                  className="text-[11px] font-medium tracking-[0.1em] uppercase text-white/30"
                >
                  {col}
                </span>
              ),
            )}
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-white/25 text-sm">
              No se encontraron órdenes
            </div>
          ) : (
            filtered.map((order) => (
              <div key={order._id}>
                {/* Fila principal */}
                <div
                  onClick={() =>
                    setExpanded(expanded === order._id ? null : order._id)
                  }
                  className="group grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] px-6 py-4 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors duration-200 cursor-pointer"
                >
                  {/* Número */}
                  <div className="flex items-center">
                    <span className="text-xs font-mono bg-white/[0.05] border border-white/[0.08] px-2 py-1 rounded-lg text-white/60">
                      {order.orderNumber}
                    </span>
                  </div>

                  {/* Cliente */}
                  <div className="flex flex-col justify-center">
                    <p className="text-sm font-medium text-white group-hover:text-teal-300 transition-colors">
                      {order.customer.name}
                    </p>
                    <p className="text-xs text-white/30 mt-0.5">
                      {order.customer.email}
                    </p>
                  </div>

                  {/* Items count */}
                  <div className="flex items-center">
                    <span className="text-sm text-white/50">
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "producto" : "productos"}
                    </span>
                  </div>

                  {/* Total */}
                  <div className="flex items-center">
                    <span className="text-sm font-semibold text-white">
                      {order.currency}{" "}
                      {order.total.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="flex items-center">
                    <span
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${statusConfig[order.status as keyof typeof statusConfig].classes}`}
                    >
                      {
                        statusConfig[order.status as keyof typeof statusConfig]
                          .label
                      }
                    </span>
                  </div>

                  {/* Fecha */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/30 font-light">
                      {order.createdAt}
                    </span>
                    <span
                      className={`text-white/30 text-xs transition-transform duration-200 ${expanded === order._id ? "rotate-180" : ""}`}
                    >
                      ▾
                    </span>
                  </div>
                </div>

                {/* Expandido: detalle items */}
                {expanded === order._id && (
                  <div className="bg-white/[0.02] border-b border-white/[0.04] px-16 py-4">
                    <p className="text-[11px] uppercase tracking-widest text-white/25 mb-3">
                      Detalle de productos
                    </p>
                    <div className="flex flex-col gap-2">
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-white/60">{item.product}</span>
                          <div className="flex items-center gap-6 text-white/40 text-xs">
                            <span>
                              {item.quantity} × {order.currency}{" "}
                              {item.unitPrice}
                            </span>
                            <span className="text-white/70 font-medium">
                              {order.currency} {item.subtotal}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {order.notes && (
                      <p className="text-xs text-white/25 mt-3 italic">
                        📝 {order.notes}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <p className="text-xs text-white/20 mt-4 text-right">
          Mostrando {filtered.length} de {mockOrders.length} órdenes
        </p>
      </div>
    </main>
  );
}
