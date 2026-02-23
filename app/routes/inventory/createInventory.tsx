import { Link, useNavigate } from "react-router";
import { useState } from "react";
import InventoryForm from "../../comp/InventoryForm"; // ajusta el path
import { UseInventoryApi } from "~/api/inventoryApi";

export default function CreateInventory() {
  const navigate = useNavigate();
  const { createInventory, loading } = UseInventoryApi();

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    barcode: "",
    description: "",
    quantity: "",
    minimumStock: "",
    unit: "unit" as const,
    costPrice: "",
    salePrice: "",
    currency: "USD",
    location: "",
    supplier: "",
    expirationDate: "",
    isActive: true,
  });

  const parseFormData = (data: typeof formData) => ({
    ...data,
    quantity: Number(data.quantity || 0),
    minimumStock: Number(data.minimumStock || 0),
    costPrice: Number(data.costPrice || 0),
    salePrice: Number(data.salePrice || 0),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createInventory(parseFormData(formData));
      navigate("/inventory");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="flex items-center justify-between px-12 py-8 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Link
            to="/inventory"
            className="text-white/30 hover:text-white/60 transition-colors text-sm"
          >
            ← volver
          </Link>
          <span className="text-white/10">|</span>
          <span className="text-white font-bold text-lg tracking-tight">
            inventory<span className="text-white/25">·s</span>
          </span>
        </div>
      </header>

      <div className="flex justify-center px-6 py-10">
        <div className="w-full max-w-2xl">
          <div className="mb-10">
            <p className="text-xs font-medium tracking-[0.14em] uppercase text-white/30 mb-2">
              Gestión
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Nuevo Producto
            </h1>
            <p className="text-white/40 text-sm mt-1 font-light">
              Completa la información del producto
            </p>
          </div>

          <InventoryForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            submitLabel="Crear producto"
          />
        </div>
      </div>
    </main>
  );
}
