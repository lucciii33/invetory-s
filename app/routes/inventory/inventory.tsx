import { Link, useNavigate } from "react-router";
import { useState } from "react";

const mockInventory = [
  {
    _id: "1",
    name: "Laptop Dell XPS 15",
    sku: "DELL-XPS-001",
    quantity: 12,
    minimumStock: 5,
    unit: "unit",
    costPrice: 1200,
    salePrice: 1599,
    currency: "USD",
    location: "Warehouse A / Shelf 1",
    supplier: "Dell Inc.",
    isActive: true,
    expirationDate: null,
  },
  {
    _id: "2",
    name: "Cable HDMI 2m",
    sku: "CAB-HDMI-002",
    quantity: 3,
    minimumStock: 10,
    unit: "unit",
    costPrice: 8,
    salePrice: 15,
    currency: "USD",
    location: "Warehouse B / Shelf 4",
    supplier: "CableCo",
    isActive: true,
    expirationDate: null,
  },
  {
    _id: "3",
    name: "Papel Bond A4",
    sku: "PAP-A4-003",
    quantity: 200,
    minimumStock: 50,
    unit: "box",
    costPrice: 5,
    salePrice: 9,
    currency: "USD",
    location: "Warehouse A / Shelf 2",
    supplier: "OfficeMax",
    isActive: true,
    expirationDate: "2026-12-01",
  },
  {
    _id: "4",
    name: "Aceite de Motor 5W-30",
    sku: "ACE-MOT-004",
    quantity: 0,
    minimumStock: 20,
    unit: "liter",
    costPrice: 12,
    salePrice: 22,
    currency: "USD",
    location: "Warehouse C / Shelf 1",
    supplier: "Mobil",
    isActive: false,
    expirationDate: "2025-06-01",
  },
  {
    _id: "5",
    name: "Teclado Mecánico RGB",
    sku: "TEC-MEC-005",
    quantity: 8,
    minimumStock: 3,
    unit: "unit",
    costPrice: 45,
    salePrice: 89,
    currency: "USD",
    location: "Warehouse A / Shelf 3",
    supplier: "Corsair",
    isActive: true,
    expirationDate: null,
  },
];

export default function Inventory() {
  const [search, setSearch] = useState("");

  const filtered = mockInventory.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()),
  );
  const navigate = useNavigate();
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
              {mockInventory.length} productos registrados
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
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] bg-white/[0.03] border-b border-white/[0.06] px-6 py-3">
            {[
              "Producto",
              "SKU",
              "Stock",
              "Precio Costo",
              "Precio Venta",
              "Ubicación",
              "Estado",
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
                  className="group grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] px-6 py-4 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors duration-200 cursor-pointer"
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
                </div>
              );
            })
          )}
        </div>

        {/* Footer count */}
        <p className="text-xs text-white/20 mt-4 text-right">
          Mostrando {filtered.length} de {mockInventory.length} productos
        </p>
      </div>
    </main>
  );
}
