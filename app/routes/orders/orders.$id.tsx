import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { UseOrdersApi } from "~/api/ordersApi";
import type { Order, OrderStatus } from "~/api/ordersApi";
import { UseInventoryApi } from "~/api/inventoryApi";
import { getAuthUser } from "auth";
import DeleteConfirmModal from "~/comp/DeleteConfirmModal";

const statusConfig = {
  pending: {
    label: "Pendiente",
    classes: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  accepted: {
    label: "Aceptada",
    classes: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  },
  active: {
    label: "Activa",
    classes: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  },
  delivered: {
    label: "Entregada",
    classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  cancelled: {
    label: "Cancelada",
    classes: "bg-red-500/10 text-red-400 border-red-500/20",
  },
};

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { getOrderById, updateOrderStatus, deleteOrder, loading, mutating } =
    UseOrdersApi();
  const { getInventoryByUserId, data: inventoryItems } = UseInventoryApi();

  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [confirmAccept, setConfirmAccept] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    getOrderById(id)
      .then((data) => setOrder(data))
      .catch(() => setNotFound(true));
    const userId = getAuthUser();
    getInventoryByUserId(userId);
  }, [id]);

  const getProductInfo = (productId: string) => {
    return inventoryItems.find((item) => item._id === productId);
  };

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order) return;
    if (newStatus === "accepted" && !confirmAccept) {
      setConfirmAccept(true);
      return;
    }
    setConfirmAccept(false);
    setStatusError(null);
    try {
      const updated = await updateOrderStatus(order._id, newStatus);
      setOrder(updated);
    } catch (err) {
      setStatusError(
        err instanceof Error ? err.message : "Error al actualizar la orden",
      );
    }
  };

  const handleDelete = async () => {
    if (!order) return;
    try {
      await deleteOrder(order._id);
      navigate("/orders");
    } catch (err) {
      console.error(err);
    }
  };

  if (notFound) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 text-sm mb-4">Orden no encontrada</p>
          <Link
            to="/orders"
            className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
          >
            ← Volver a órdenes
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-teal-500/5 blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[80px] pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between px-12 py-8 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Link
            to="/orders"
            className="text-white/30 hover:text-white/60 transition-colors text-sm"
          >
            ← volver
          </Link>
          <span className="text-white/10">|</span>
          <span className="text-white font-bold text-lg tracking-tight">
            inventory<span className="text-white/25">·orders</span>
          </span>
        </div>
      </header>

      <div className="flex justify-center px-6 py-10 relative z-10">
        <div className="w-full max-w-3xl">
          {/* Title */}
          <div className="mb-8">
            <p className="text-xs font-medium tracking-[0.14em] uppercase text-white/30 mb-2">
              Detalle
            </p>
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-extrabold tracking-tight">
                {order?.orderNumber ?? "Cargando..."}
              </h1>
              {order && (
                <span
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${statusConfig[order.status].classes}`}
                >
                  {statusConfig[order.status].label}
                </span>
              )}
            </div>
          </div>

          {loading && !order ? (
            <div className="text-white/30 text-sm py-16 text-center">
              Cargando...
            </div>
          ) : order ? (
            <div className="flex flex-col gap-6">
              {/* Cliente + Meta */}
              <div className="grid grid-cols-2 gap-4">
                {/* Cliente */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
                  <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-white/25 mb-3">
                    Cliente
                  </p>
                  <p className="text-sm font-semibold text-white mb-1">
                    {order.customer.name}
                  </p>
                  {order.customer.email && (
                    <p className="text-xs text-white/40">{order.customer.email}</p>
                  )}
                  {order.customer.phone && (
                    <p className="text-xs text-white/40 mt-0.5">
                      {order.customer.phone}
                    </p>
                  )}
                </div>

                {/* Info */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
                  <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-white/25 mb-3">
                    Información
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/40">Moneda</span>
                      <span className="text-xs text-white/70 font-mono">
                        {order.currency}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/40">Inventario</span>
                      <span
                        className={`text-xs ${order.inventoryDeducted ? "text-teal-400" : "text-white/40"}`}
                      >
                        {order.inventoryDeducted ? "Descontado" : "Sin descontar"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/40">Creada</span>
                      <span className="text-xs text-white/50">
                        {new Date(order.createdAt).toLocaleDateString("es", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/40">Actualizada</span>
                      <span className="text-xs text-white/50">
                        {new Date(order.updatedAt).toLocaleDateString("es", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Productos */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
                <div className="px-5 pt-5 pb-3 border-b border-white/[0.06]">
                  <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-white/25">
                    Productos
                  </p>
                </div>

                {/* Items header */}
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] px-5 py-2.5 border-b border-white/[0.04]">
                  {["Producto", "Stock actual", "Cantidad", "Precio unit.", "Subtotal"].map(
                    (h) => (
                      <span
                        key={h}
                        className="text-[10px] font-medium tracking-[0.1em] uppercase text-white/25"
                      >
                        {h}
                      </span>
                    ),
                  )}
                </div>

                {/* Item rows */}
                {order.items.map((item, i) => {
                  const product = getProductInfo(item.product);
                  const outOfStock = product && product.quantity === 0;
                  const lowStock =
                    product &&
                    product.quantity > 0 &&
                    product.quantity <= product.minimumStock;

                  return (
                    <div
                      key={i}
                      className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] px-5 py-3.5 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Producto */}
                      <div>
                        <p className="text-sm text-white font-medium">
                          {product?.name ?? item.product}
                        </p>
                        {product?.sku && (
                          <p className="text-[10px] font-mono text-white/25 mt-0.5">
                            {product.sku}
                          </p>
                        )}
                      </div>

                      {/* Stock actual */}
                      <div className="flex items-center gap-1.5">
                        {product ? (
                          <>
                            <span
                              className={`text-sm font-semibold ${outOfStock ? "text-red-400" : lowStock ? "text-amber-400" : "text-teal-400"}`}
                            >
                              {product.quantity}
                            </span>
                            <span className="text-white/25 text-xs">
                              {product.unit}
                            </span>
                            {outOfStock && (
                              <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded-md">
                                agotado
                              </span>
                            )}
                            {lowStock && (
                              <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded-md">
                                bajo
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-white/20">—</span>
                        )}
                      </div>

                      {/* Cantidad */}
                      <div className="flex items-center">
                        <span className="text-sm text-white/60">
                          {item.quantity}
                        </span>
                      </div>

                      {/* Precio unitario */}
                      <div className="flex items-center">
                        <span className="text-sm text-white/50">
                          {order.currency} {item.unitPrice.toFixed(2)}
                        </span>
                      </div>

                      {/* Subtotal */}
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-white">
                          {order.currency} {item.subtotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Total row */}
                <div className="flex items-center justify-between px-5 py-4">
                  <span className="text-xs text-white/30 uppercase tracking-widest">
                    Total
                  </span>
                  <span className="text-lg font-bold text-white">
                    {order.currency}{" "}
                    {order.total.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
                  <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-white/25 mb-2">
                    Notas
                  </p>
                  <p className="text-sm text-white/50 italic">{order.notes}</p>
                </div>
              )}

              {/* Status management */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
                <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-white/25 mb-4">
                  Gestionar estado
                </p>

                {order.status === "cancelled" ? (
                  <p className="text-sm text-white/30">
                    Esta orden fue cancelada y no puede modificarse.
                  </p>
                ) : order.status === "delivered" ? (
                  <p className="text-sm text-white/30">
                    Esta orden fue entregada. No requiere más acciones.
                  </p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {/* Accept warning */}
                    {confirmAccept && (
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
                        <p className="text-sm text-amber-400 font-medium mb-1">
                          Atención: esta acción descuenta inventario
                        </p>
                        <p className="text-xs text-amber-400/70">
                          Al aceptar esta orden, el stock de cada producto se
                          deducirá automáticamente. Si no hay stock suficiente,
                          la operación será rechazada.
                        </p>
                      </div>
                    )}

                    {/* Status error */}
                    {statusError && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                        <p className="text-sm text-red-400">{statusError}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-3 flex-wrap">
                      {/* PENDING → accept or cancel */}
                      {order.status === "pending" && (
                        <>
                          {!confirmAccept ? (
                            <button
                              onClick={() => handleStatusChange("accepted")}
                              disabled={mutating}
                              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 hover:border-teal-500/50 text-teal-300 transition-all duration-300 disabled:opacity-50 cursor-pointer"
                            >
                              Aceptar orden
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleStatusChange("accepted")}
                                disabled={mutating}
                                className="px-5 py-2.5 rounded-xl text-sm font-medium bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 hover:border-teal-500/50 text-teal-300 transition-all duration-300 disabled:opacity-50 cursor-pointer"
                              >
                                {mutating ? "Procesando..." : "Confirmar aceptar"}
                              </button>
                              <button
                                onClick={() => setConfirmAccept(false)}
                                disabled={mutating}
                                className="px-4 py-2.5 rounded-xl text-sm text-white/50 hover:text-white/80 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] transition-all duration-200 cursor-pointer"
                              >
                                Cancelar
                              </button>
                            </>
                          )}
                          {!confirmAccept && (
                            <button
                              onClick={() => handleStatusChange("cancelled")}
                              disabled={mutating}
                              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 transition-all duration-300 disabled:opacity-50 cursor-pointer"
                            >
                              Cancelar orden
                            </button>
                          )}
                        </>
                      )}

                      {/* ACCEPTED → mark active or cancel */}
                      {order.status === "accepted" && (
                        <>
                          <button
                            onClick={() => handleStatusChange("active")}
                            disabled={mutating}
                            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 hover:border-indigo-500/50 text-indigo-300 transition-all duration-300 disabled:opacity-50 cursor-pointer"
                          >
                            {mutating ? "Procesando..." : "Marcar como activa"}
                          </button>
                          <button
                            onClick={() => handleStatusChange("cancelled")}
                            disabled={mutating}
                            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 transition-all duration-300 disabled:opacity-50 cursor-pointer"
                          >
                            Cancelar orden
                          </button>
                        </>
                      )}

                      {/* ACTIVE → mark delivered or cancel */}
                      {order.status === "active" && (
                        <>
                          <button
                            onClick={() => handleStatusChange("delivered")}
                            disabled={mutating}
                            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-300 transition-all duration-300 disabled:opacity-50 cursor-pointer"
                          >
                            {mutating ? "Procesando..." : "Marcar como entregada"}
                          </button>
                          <button
                            onClick={() => handleStatusChange("cancelled")}
                            disabled={mutating}
                            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 transition-all duration-300 disabled:opacity-50 cursor-pointer"
                          >
                            Cancelar orden
                          </button>
                        </>
                      )}
                    </div>

                    {(order.status === "accepted" || order.status === "active") && (
                      <p className="text-xs text-white/25">
                        Al cancelar una orden aceptada, el inventario se
                        restaurará automáticamente.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Delete */}
              <div className="flex justify-end pb-4">
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 rounded-xl text-sm text-red-400/60 hover:text-red-400 bg-red-500/[0.05] hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 transition-all duration-200 cursor-pointer"
                >
                  Eliminar orden
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Delete modal */}
      {showDeleteModal && order && (
        <DeleteConfirmModal
          itemName={order.orderNumber}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </main>
  );
}
