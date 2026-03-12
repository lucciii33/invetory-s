import { useState } from "react";
import type { InventoryItem } from "~/api/inventoryApi";
import type { CreateOrderDTO, Order } from "~/api/ordersApi";

type ItemRow = {
  productId: string;
  quantity: string;
  unitPrice: string;
};

type Props = {
  inventoryItems: InventoryItem[];
  ownerId: string;
  mutating: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateOrderDTO) => Promise<Order>;
};

export default function CreateOrderModal({
  inventoryItems,
  ownerId,
  mutating,
  onClose,
  onSubmit,
}: Props) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<ItemRow[]>([
    { productId: "", quantity: "1", unitPrice: "0" },
  ]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const getSubtotal = (item: ItemRow) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    return qty * price;
  };

  const total = items.reduce((sum, item) => sum + getSubtotal(item), 0);

  const handleProductChange = (index: number, productId: string) => {
    const product = inventoryItems.find((p) => p._id === productId);
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              productId,
              unitPrice: product ? String(product.salePrice) : "0",
            }
          : item,
      ),
    );
  };

  const handleItemChange = (
    index: number,
    field: "quantity" | "unitPrice",
    value: string,
  ) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { productId: "", quantity: "1", unitPrice: "0" },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!customerName.trim()) {
      setSubmitError("El nombre del cliente es obligatorio");
      return;
    }
    const validItems = items.filter((i) => i.productId);
    if (validItems.length === 0) {
      setSubmitError("Agrega al menos un producto a la orden");
      return;
    }

    const dto: CreateOrderDTO = {
      owner: ownerId,
      customer: {
        name: customerName.trim(),
        email: customerEmail.trim() || undefined,
        phone: customerPhone.trim() || undefined,
      },
      items: validItems.map((i) => ({
        product: i.productId,
        quantity: Number(i.quantity) || 1,
        unitPrice: Number(i.unitPrice) || 0,
        subtotal: getSubtotal(i),
      })),
      currency,
      total,
      notes: notes.trim() || undefined,
    };

    try {
      await onSubmit(dto);
      onClose();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Error al crear la orden",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-6 pb-6 px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#0f0f17] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/[0.06]">
          <div>
            <p className="text-xs font-medium tracking-[0.14em] uppercase text-white/30 mb-1">
              Nueva
            </p>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Crear Orden
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/70 transition-colors text-xl leading-none cursor-pointer"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-6">
          {/* Cliente */}
          <div>
            <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-white/30 mb-3">
              Cliente
            </p>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Nombre *"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all duration-300"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="email"
                  placeholder="Email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all duration-300"
                />
                <input
                  type="text"
                  placeholder="Teléfono"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Productos */}
          <div>
            <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-white/30 mb-3">
              Productos
            </p>

            {/* Items header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_0.8fr_0.3fr] gap-2 px-1 mb-2">
              {["Producto", "Cantidad", "Precio unit.", "Subtotal", ""].map(
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
            <div className="flex flex-col gap-2">
              {items.map((item, i) => {
                const subtotal = getSubtotal(item);
                const product = inventoryItems.find(
                  (p) => p._id === item.productId,
                );
                return (
                  <div
                    key={i}
                    className="grid grid-cols-[2fr_1fr_1fr_0.8fr_0.3fr] gap-2 items-center"
                  >
                    {/* Product select */}
                    <div>
                      <select
                        value={item.productId}
                        onChange={(e) => handleProductChange(i, e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all duration-300 cursor-pointer"
                      >
                        <option value="" className="bg-[#0f0f17]">
                          Seleccionar...
                        </option>
                        {inventoryItems.map((p) => (
                          <option
                            key={p._id}
                            value={p._id}
                            className="bg-[#0f0f17]"
                          >
                            {p.name} (stock: {p.quantity} {p.unit})
                          </option>
                        ))}
                      </select>
                      {product && (
                        <p
                          className={`text-[10px] mt-0.5 pl-1 ${product.quantity === 0 ? "text-red-400/70" : product.quantity <= product.minimumStock ? "text-amber-400/70" : "text-teal-400/70"}`}
                        >
                          {product.quantity === 0
                            ? "Sin stock"
                            : product.quantity <= product.minimumStock
                              ? `Stock bajo: ${product.quantity}`
                              : `Disponible: ${product.quantity}`}
                        </p>
                      )}
                    </div>

                    {/* Quantity */}
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(i, "quantity", e.target.value)
                      }
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all duration-300"
                    />

                    {/* Unit price */}
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleItemChange(i, "unitPrice", e.target.value)
                      }
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all duration-300"
                    />

                    {/* Subtotal */}
                    <div className="flex items-center">
                      <span className="text-sm text-white/50 font-medium">
                        {subtotal.toFixed(2)}
                      </span>
                    </div>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeItem(i)}
                      disabled={items.length === 1}
                      className="text-white/20 hover:text-red-400 disabled:opacity-0 transition-colors text-lg leading-none cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={addItem}
              className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
            >
              + Agregar producto
            </button>
          </div>

          {/* Config */}
          <div>
            <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-white/30 mb-3">
              Configuración
            </p>
            <div className="flex flex-col gap-3">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all duration-300 cursor-pointer"
              >
                {["USD", "EUR", "MXN", "COP", "VES"].map((c) => (
                  <option key={c} value={c} className="bg-[#0f0f17]">
                    {c}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="Notas (opcional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all duration-300 resize-none"
              />
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between py-3 border-t border-white/[0.06]">
            <span className="text-sm text-white/40">Total</span>
            <span className="text-lg font-bold text-white">
              {currency}{" "}
              {total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Error */}
          {submitError && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              {submitError}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pb-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white/80 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] transition-all duration-200 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={mutating}
              className="px-5 py-2 rounded-xl text-sm font-medium bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 hover:border-indigo-500/50 text-indigo-300 transition-all duration-300 disabled:opacity-50 cursor-pointer"
            >
              {mutating ? "Creando..." : "Crear Orden"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
