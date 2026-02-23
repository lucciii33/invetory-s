import React from "react";
import type { UnitType } from "../api/inventoryApi";

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

type Props = {
  formData: InventoryFormData;
  setFormData: React.Dispatch<React.SetStateAction<InventoryFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
};

export default function InventoryForm({
  formData,
  setFormData,
  onSubmit,
  submitLabel,
}: Props) {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const inputClass =
    "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all duration-300";
  const labelClass =
    "block text-[11px] font-medium tracking-[0.1em] uppercase text-white/40 mb-2";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {/* Identificación */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <p className="text-xs font-medium tracking-[0.12em] uppercase text-white/25 mb-5">
          Identificación
        </p>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nombre *</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Ej: Laptop Dell XPS 15"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>SKU *</label>
              <input
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
                placeholder="Ej: DELL-XPS-001"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Código de barras</label>
              <input
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                placeholder="Ej: 7501234567890"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Proveedor</label>
              <input
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                placeholder="Ej: Dell Inc."
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción del producto..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>
      </div>

      {/* Stock */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <p className="text-xs font-medium tracking-[0.12em] uppercase text-white/25 mb-5">
          Stock
        </p>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Cantidad *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min={0}
                placeholder="0"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Stock mínimo</label>
              <input
                type="number"
                name="minimumStock"
                value={formData.minimumStock}
                onChange={handleChange}
                min={0}
                placeholder="0"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Unidad</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className={inputClass}
              >
                {["unit", "kg", "g", "liter", "meter", "box"].map((u) => (
                  <option key={u} value={u} className="bg-[#0a0a0f]">
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Ubicación</label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ej: Warehouse A / Shelf 3"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Fecha de expiración</label>
              <input
                type="date"
                name="expirationDate"
                value={formData.expirationDate}
                onChange={handleChange}
                className={`${inputClass} [color-scheme:dark]`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Precios */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <p className="text-xs font-medium tracking-[0.12em] uppercase text-white/25 mb-5">
          Precios
        </p>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Precio costo</label>
            <input
              type="number"
              name="costPrice"
              value={formData.costPrice}
              onChange={handleChange}
              min={0}
              step="0.01"
              placeholder="0.00"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Precio venta</label>
            <input
              type="number"
              name="salePrice"
              value={formData.salePrice}
              onChange={handleChange}
              min={0}
              step="0.01"
              placeholder="0.00"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Moneda</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className={inputClass}
            >
              {["USD", "EUR", "MXN", "COP", "VES"].map((c) => (
                <option key={c} value={c} className="bg-[#0a0a0f]">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center justify-between pt-2">
        <div
          onClick={() => setFormData((p) => ({ ...p, isActive: !p.isActive }))}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div
            className={`w-10 h-5 rounded-full transition-colors duration-300 relative ${
              formData.isActive ? "bg-teal-500/60" : "bg-white/10"
            }`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                formData.isActive ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </div>
          <span className="text-sm text-white/50">
            {formData.isActive ? "Activo" : "Inactivo"}
          </span>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl text-sm font-medium bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 hover:border-indigo-500/50 text-indigo-300 transition-all duration-300 cursor-pointer"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
