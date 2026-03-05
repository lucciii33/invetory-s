import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { UseInventoryApi } from "~/api/inventoryApi";
import type { UnitType } from "~/api/inventoryApi";
import InventoryForm from "../../comp/InventoryForm";

type InventoryFormData = {
  name: string;
  sku: string;
  barcode: string;
  description: string;
  quantity: string;
  minimumStock: string;
  unit: UnitType;
  costPrice: string;
  salePrice: string;
  currency: string;
  location: string;
  supplier: string;
  expirationDate: string;
  isActive: boolean;
};

const defaultForm: InventoryFormData = {
  name: "",
  sku: "",
  barcode: "",
  description: "",
  quantity: "0",
  minimumStock: "0",
  unit: "unit",
  costPrice: "0",
  salePrice: "0",
  currency: "USD",
  location: "",
  supplier: "",
  expirationDate: "",
  isActive: true,
};

export default function EditInventory() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getInventoryById, updateInventory, loading, mutating, error } =
    UseInventoryApi();
  const [formData, setFormData] = useState<InventoryFormData>(defaultForm);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    getInventoryById(id)
      .then((item) => {
        setFormData({
          name: item.name,
          sku: item.sku,
          barcode: item.barcode ?? "",
          description: item.description ?? "",
          quantity: String(item.quantity),
          minimumStock: String(item.minimumStock),
          unit: item.unit,
          costPrice: String(item.costPrice),
          salePrice: String(item.salePrice),
          currency: item.currency,
          location: item.location ?? "",
          supplier: item.supplier ?? "",
          expirationDate: item.expirationDate ?? "",
          isActive: item.isActive,
        });
      })
      .catch(() => setNotFound(true));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    await updateInventory(id, {
      name: formData.name,
      sku: formData.sku,
      barcode: formData.barcode || undefined,
      description: formData.description || undefined,
      quantity: Number(formData.quantity),
      minimumStock: Number(formData.minimumStock),
      unit: formData.unit,
      costPrice: Number(formData.costPrice),
      salePrice: Number(formData.salePrice),
      currency: formData.currency,
      location: formData.location || undefined,
      supplier: formData.supplier || undefined,
      expirationDate: formData.expirationDate || undefined,
      isActive: formData.isActive,
    });
    navigate(`/inventory/${id}`);
  };

  if (notFound) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 text-sm mb-4">Producto no encontrado</p>
          <Link
            to="/inventory"
            className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
          >
            ← Volver al inventario
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-teal-500/5 blur-[80px] pointer-events-none" />

      <header className="flex items-center justify-between px-12 py-8 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Link
            to={`/inventory/${id}`}
            className="text-white/30 hover:text-white/60 transition-colors text-sm"
          >
            ← volver
          </Link>
          <span className="text-white/10">|</span>
          <span className="text-white font-bold text-lg tracking-tight">
            inventory<span className="text-white/25">·edit</span>
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
              Editar Producto
            </h1>
            <p className="text-white/40 text-sm mt-1 font-light">
              {formData.name || "Cargando..."}
            </p>
          </div>

          {loading ? (
            <div className="text-white/30 text-sm py-16 text-center">
              Cargando...
            </div>
          ) : (
            <InventoryForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              submitLabel={mutating ? "Guardando..." : "Guardar cambios"}
            />
          )}
        </div>
      </div>
    </main>
  );
}
