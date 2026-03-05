import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { UseInventoryApi } from "~/api/inventoryApi";
import { getAuthUser } from "auth";
import DeleteConfirmModal from "~/comp/DeleteConfirmModal";

export default function Inventory() {
  const [search, setSearch] = useState("");
  const { getInventoryByUserId, loading, data, deleteInventoryItem } =
    UseInventoryApi();
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    const id = getAuthUser();
    getInventoryByUserId(id);
  }, []);

  const filtered = data.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()),
  );
  const navigate = useNavigate();

  const removeItem = async (id: string) => {
    if (!deleteTarget) return;
    try {
      await deleteInventoryItem(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      {/* Blobs */}
      <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-teal-500/5 blur-[80px] pointer-events-none" />

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

        {/* Boton crear */}
        <button
          className="group relative flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all duration-300 cursor-pointer"
          onClick={() => navigate("/inventory/create")}
        >
          <span className="text-lg leading-none">+</span>
          Crear producto
        </button>
      </header>

      {/* Content */}
      <div className="px-12 py-10 relative z-10">
        {/* Title + search */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-medium tracking-[0.14em] uppercase text-white/30 mb-2">
              Gestión
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Inventario
            </h1>
            <p className="text-white/40 text-sm mt-1 font-light">
              {data.length} productos registrados
            </p>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all duration-300 w-72"
          />
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
          {/* Table header */}
          <div className="group grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_0.5fr] bg-white/[0.03] border-b border-white/[0.06] px-6 py-3">
            {[
              "Producto",
              "SKU",
              "Stock",
              "Precio Costo",
              "Precio Venta",
              "Ubicación",
              "Estado",
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

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-white/25 text-sm">
              No se encontraron productos
            </div>
          ) : (
            filtered.map((item, i) => {
              const lowStock = item.quantity <= item.minimumStock;
              const outOfStock = item.quantity === 0;

              return (
                <div
                  key={item._id}
                  className="group grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_0.5fr] px-6 py-4 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors duration-200 cursor-pointer"
                >
                  {/* Nombre */}
                  <div>
                    <Link to={`/inventory/${item._id}`}>
                      <p className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">
                        {item.name}
                      </p>
                    </Link>
                    {item.supplier && (
                      <p className="text-xs text-white/30 mt-0.5">
                        {item.supplier}
                      </p>
                    )}
                  </div>

                  {/* SKU */}
                  <div className="flex items-center">
                    <span className="text-xs font-mono bg-white/[0.05] border border-white/[0.08] px-2 py-1 rounded-lg text-white/50">
                      {item.sku}
                    </span>
                  </div>

                  {/* Stock */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold ${outOfStock ? "text-red-400" : lowStock ? "text-amber-400" : "text-teal-400"}`}
                    >
                      {item.quantity}
                    </span>
                    <span className="text-white/25 text-xs">{item.unit}</span>
                    {lowStock && !outOfStock && (
                      <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded-md">
                        bajo
                      </span>
                    )}
                    {outOfStock && (
                      <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded-md">
                        agotado
                      </span>
                    )}
                  </div>

                  {/* Precio costo */}
                  <div className="flex items-center">
                    <span className="text-sm text-white/50">
                      {item.currency} {item.costPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Precio venta */}
                  <div className="flex items-center">
                    <span className="text-sm text-white font-medium">
                      {item.currency} {item.salePrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Ubicación */}
                  <div className="flex items-center">
                    <span className="text-xs text-white/40 font-light">
                      {item.location ?? "—"}
                    </span>
                  </div>

                  {/* Estado */}
                  <div className="flex items-center">
                    <span
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${
                        item.isActive
                          ? "bg-teal-500/10 text-teal-400 border-teal-500/20"
                          : "bg-white/[0.03] text-white/30 border-white/10"
                      }`}
                    >
                      {item.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div>
                      <Link
                        to={`/inventory/${item._id}`}
                        className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        Editar
                      </Link>
                    </div>
                    <div
                      className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                      onClick={() =>
                        setDeleteTarget({ id: item._id, name: item.name })
                      }
                    >
                      Delete
                    </div>
                  </div>
                  {deleteTarget && (
                    <DeleteConfirmModal
                      itemName={deleteTarget.name}
                      onConfirm={removeItem}
                      onCancel={() => setDeleteTarget(null)}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer count */}
        <p className="text-xs text-white/20 mt-4 text-right">
          Mostrando {filtered.length} de {data.length} productos
        </p>
      </div>
    </main>
  );
}
