import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { UseOrdersApi } from "~/api/ordersApi";
import { UseInventoryApi } from "~/api/inventoryApi";
import { getAuthUser } from "auth";
import DeleteConfirmModal from "~/comp/DeleteConfirmModal";
import CreateOrderModal from "~/comp/CreateOrderModal";

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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    orderNumber: string;
  } | null>(null);

  const {
    getOrdersByUserId,
    deleteOrder,
    createOrder,
    loading,
    mutating,
    data: orders,
  } = UseOrdersApi();

  const { getInventoryByUserId, data: inventoryItems } = UseInventoryApi();

  useEffect(() => {
    const id = getAuthUser();
    getOrdersByUserId(id);
    getInventoryByUserId(id);
  }, []);

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteOrder(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    }
  };

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
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all duration-300 cursor-pointer"
        >
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
              {orders.length} órdenes en total
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
          <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_0.6fr] bg-white/[0.03] border-b border-white/[0.06] px-6 py-3">
            {[
              "# Orden",
              "Cliente",
              "Items",
              "Total",
              "Estado",
              "Fecha",
              "Acciones",
            ].map((col) => (
              <span
                key={col}
                className="text-[11px] font-medium tracking-[0.1em] uppercase text-white/30"
              >
                {col}
              </span>
            ))}
          </div>

          {/* Loading */}
          {loading ? (
            <div className="text-center py-16 text-white/25 text-sm">
              Cargando...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-white/25 text-sm">
              No se encontraron órdenes
            </div>
          ) : (
            filtered.map((order) => (
              <div
                key={order._id}
                className="group grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_0.6fr] px-6 py-4 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors duration-200 cursor-pointer"
                onClick={() => navigate(`/orders/${order._id}`)}
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
                  {order.customer.email && (
                    <p className="text-xs text-white/30 mt-0.5">
                      {order.customer.email}
                    </p>
                  )}
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
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${statusConfig[order.status].classes}`}
                  >
                    {statusConfig[order.status].label}
                  </span>
                </div>

                {/* Fecha */}
                <div className="flex items-center">
                  <span className="text-xs text-white/30 font-light">
                    {new Date(order.createdAt).toLocaleDateString("es", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Acciones */}
                <div
                  className="flex items-center gap-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link
                    to={`/orders/${order._id}`}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Ver
                  </Link>
                  <button
                    onClick={() =>
                      setDeleteTarget({
                        id: order._id,
                        orderNumber: order.orderNumber,
                      })
                    }
                    className="text-xs text-white/25 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <p className="text-xs text-white/20 mt-4 text-right">
          Mostrando {filtered.length} de {orders.length} órdenes
        </p>
      </div>

      {/* Create modal */}
      {showCreateModal && (
        <CreateOrderModal
          inventoryItems={inventoryItems}
          ownerId={getAuthUser()}
          mutating={mutating}
          onClose={() => setShowCreateModal(false)}
          onSubmit={createOrder}
        />
      )}

      {/* Delete modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          itemName={deleteTarget.orderNumber}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </main>
  );
}
