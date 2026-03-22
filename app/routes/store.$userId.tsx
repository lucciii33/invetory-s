import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { InventoryItem } from "~/api/inventoryApi";
import { fetchPublicInventory, createPublicOrder } from "~/api/storeApi";

// Cart stored as { productId: quantity } in localStorage
type CartMap = Record<string, number>;

const CURRENCIES = ["USD", "EUR", "MXN", "COP", "VES"];

function cartKey(userId: string) {
  return `store_cart_${userId}`;
}

function PlaceholderImage() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-white/[0.03]">
      <svg
        className="w-12 h-12 text-white/10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  );
}

export default function StorePage() {
  const { userId } = useParams<{ userId: string }>();

  const [products, setProducts] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // cart: productId → quantity
  const [cart, setCart] = useState<CartMap>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [view, setView] = useState<"cart" | "checkout" | "success">("cart");

  // Checkout form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [submitting, setSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState("");

  // Load cart from localStorage
  useEffect(() => {
    if (!userId) return;
    try {
      const saved = localStorage.getItem(cartKey(userId));
      if (saved) setCart(JSON.parse(saved));
    } catch {}
  }, [userId]);

  // Persist cart
  useEffect(() => {
    if (!userId) return;
    localStorage.setItem(cartKey(userId), JSON.stringify(cart));
  }, [cart, userId]);

  // Fetch products
  useEffect(() => {
    if (!userId) return;
    fetchPublicInventory(userId)
      .then((data) => {
        setProducts(data.filter((p) => p.isActive));
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudieron cargar los productos. Intenta más tarde.");
        setLoading(false);
      });
  }, [userId]);

  const addToCart = (product: InventoryItem) => {
    setCart((prev) => ({
      ...prev,
      [product._id]: Math.min((prev[product._id] ?? 0) + 1, product.quantity),
    }));
  };

  const setQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
    } else {
      const product = products.find((p) => p._id === productId);
      setCart((prev) => ({
        ...prev,
        [productId]: Math.min(qty, product?.quantity ?? qty),
      }));
    }
  };

  const cartItems = Object.entries(cart)
    .map(([id, qty]) => {
      const product = products.find((p) => p._id === id);
      return product ? { product, quantity: qty } : null;
    })
    .filter(Boolean) as { product: InventoryItem; quantity: number }[];

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const total = cartItems.reduce(
    (sum, i) => sum + i.product.salePrice * i.quantity,
    0
  );

  const handleCheckout = async () => {
    if (!name.trim()) {
      setCheckoutError("El nombre es requerido");
      return;
    }
    if (cartItems.length === 0) {
      setCheckoutError("El carrito está vacío");
      return;
    }
    setCheckoutError(null);
    setSubmitting(true);
    try {
      const order = await createPublicOrder({
        owner: userId!,
        customer: {
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
        },
        items: cartItems.map((i) => ({
          product: i.product._id,
          quantity: i.quantity,
          unitPrice: i.product.salePrice,
          subtotal: i.product.salePrice * i.quantity,
        })),
        currency,
        notes: notes.trim() || undefined,
        total,
      });
      setOrderNumber(order.orderNumber);
      setCart({});
      setView("success");
    } catch (err) {
      setCheckoutError(
        err instanceof Error ? err.message : "Error al procesar la orden"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetCart = () => {
    setView("cart");
    setCartOpen(false);
    setName("");
    setEmail("");
    setPhone("");
    setNotes("");
    setCurrency("USD");
    setCheckoutError(null);
    setOrderNumber("");
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute -top-24 -right-24 w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 -left-32 w-[400px] h-[400px] rounded-full bg-teal-500/4 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-[300px] h-[300px] rounded-full bg-purple-500/4 blur-[80px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-md">
        <span className="text-white font-bold text-lg tracking-tight">
          inventory<span className="text-white/25">·s</span>
        </span>

        {/* Cart button */}
        <button
          onClick={() => {
            setCartOpen(true);
            setView("cart");
          }}
          className="relative flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.1] hover:border-white/[0.2] text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <span>Carrito</span>
          {cartCount > 0 && (
            <span className="flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-indigo-500 text-white rounded-full">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </button>
      </header>

      {/* Hero */}
      <div className="px-6 md:px-12 pt-14 pb-10 relative z-10">
        <p className="text-xs font-medium tracking-[0.16em] uppercase text-white/25 mb-3">
          Catálogo
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
          Nuestros Productos
        </h1>
        <p className="text-white/35 text-sm font-light">
          {loading
            ? "Cargando productos..."
            : error
            ? ""
            : `${products.length} producto${products.length !== 1 ? "s" : ""} disponible${products.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Products */}
      <div className="px-6 md:px-12 pb-24 relative z-10">
        {error && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <p className="text-white/40 text-sm">{error}</p>
          </div>
        )}

        {loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-white/[0.03]" />
                <div className="p-4 flex flex-col gap-3">
                  <div className="h-4 bg-white/[0.05] rounded-lg w-3/4" />
                  <div className="h-3 bg-white/[0.03] rounded-lg w-full" />
                  <div className="h-3 bg-white/[0.03] rounded-lg w-2/3" />
                  <div className="h-8 bg-white/[0.05] rounded-xl mt-2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-white/20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <p className="text-white/30 text-sm">
              No hay productos disponibles aún
            </p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => {
              const inCartQty = cart[product._id] ?? 0;
              const outOfStock = product.quantity === 0;

              return (
                <div
                  key={product._id}
                  className="group bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.07] hover:border-white/[0.14] rounded-2xl overflow-hidden transition-all duration-300 flex flex-col"
                >
                  {/* Image */}
                  <div className="h-48 overflow-hidden relative bg-white/[0.02]">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <PlaceholderImage />
                    )}
                    {outOfStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-xs font-semibold text-white/60 bg-white/10 border border-white/20 px-3 py-1 rounded-full">
                          Agotado
                        </span>
                      </div>
                    )}
                    {!outOfStock &&
                      product.quantity <= product.minimumStock && (
                        <div className="absolute top-3 right-3">
                          <span className="text-[10px] font-medium bg-amber-500/20 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded-full">
                            Últimas unidades
                          </span>
                        </div>
                      )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <h3 className="text-sm font-semibold text-white leading-snug">
                      {product.name}
                    </h3>

                    {product.description && (
                      <p className="text-xs text-white/35 leading-relaxed line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-end justify-between mt-auto pt-2">
                      <div>
                        <p className="text-lg font-bold text-white">
                          {product.currency}{" "}
                          {product.salePrice.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                        <p className="text-[10px] text-white/20 font-mono">
                          por {product.unit}
                        </p>
                      </div>
                    </div>

                    {/* Cart controls */}
                    {inCartQty === 0 ? (
                      <button
                        onClick={() => addToCart(product)}
                        disabled={outOfStock}
                        className="mt-2 w-full py-2.5 rounded-xl text-sm font-medium bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/25 hover:border-indigo-500/50 text-indigo-300 hover:text-indigo-200 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {outOfStock ? "Agotado" : "Agregar al carrito"}
                      </button>
                    ) : (
                      <div className="mt-2 flex items-center justify-between bg-white/[0.04] border border-white/[0.08] rounded-xl px-2 py-1">
                        <button
                          onClick={() => setQty(product._id, inCartQty - 1)}
                          className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white rounded-lg hover:bg-white/[0.08] transition-all cursor-pointer text-base"
                        >
                          −
                        </button>
                        <span className="text-sm font-semibold text-white w-6 text-center">
                          {inCartQty}
                        </span>
                        <button
                          onClick={() => addToCart(product)}
                          disabled={inCartQty >= product.quantity}
                          className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white rounded-lg hover:bg-white/[0.08] transition-all cursor-pointer text-base disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cart Drawer Overlay */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Cart Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md z-50 flex flex-col bg-[#0f0f18] border-l border-white/[0.08] shadow-2xl transition-transform duration-300 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
          {view === "checkout" ? (
            <button
              onClick={() => setView("cart")}
              className="flex items-center gap-2 text-white/40 hover:text-white/80 text-sm transition-colors cursor-pointer"
            >
              ← Volver al carrito
            </button>
          ) : view === "success" ? (
            <span className="text-sm font-semibold text-white">
              ¡Orden confirmada!
            </span>
          ) : (
            <span className="text-sm font-semibold text-white">
              Carrito{" "}
              {cartCount > 0 && (
                <span className="text-white/30 font-normal">
                  ({cartCount} item{cartCount !== 1 ? "s" : ""})
                </span>
              )}
            </span>
          )}
          <button
            onClick={() => setCartOpen(false)}
            className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-white rounded-lg hover:bg-white/[0.06] transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto">
          {/* SUCCESS */}
          {view === "success" && (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center gap-5">
              <div className="w-16 h-16 rounded-full bg-teal-500/15 border border-teal-500/25 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-teal-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  ¡Listo! Tu orden fue registrada
                </h2>
                <p className="text-white/40 text-sm leading-relaxed">
                  Tu orden{" "}
                  <span className="font-mono text-white/70">{orderNumber}</span>{" "}
                  ha sido recibida y está en proceso. Pronto nos pondremos en
                  contacto contigo.
                </p>
              </div>
              <button
                onClick={resetCart}
                className="px-6 py-2.5 rounded-xl text-sm font-medium bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.1] text-white transition-all cursor-pointer"
              >
                Seguir comprando
              </button>
            </div>
          )}

          {/* CART VIEW */}
          {view === "cart" && (
            <div className="px-6 py-4 flex flex-col gap-3">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                  <svg
                    className="w-10 h-10 text-white/10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <p className="text-white/25 text-sm">El carrito está vacío</p>
                </div>
              ) : (
                cartItems.map(({ product, quantity }) => (
                  <div
                    key={product._id}
                    className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl p-3"
                  >
                    {/* Mini image */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/[0.04] flex-shrink-0">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white/15"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-white/35">
                        {product.currency}{" "}
                        {(product.salePrice * quantity).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>

                    {/* Qty controls */}
                    <div className="flex items-center gap-1 bg-white/[0.05] border border-white/[0.08] rounded-lg px-1 py-0.5">
                      <button
                        onClick={() => setQty(product._id, quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-white/40 hover:text-white rounded transition-colors cursor-pointer"
                      >
                        −
                      </button>
                      <span className="text-sm text-white w-5 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => addToCart(product)}
                        disabled={quantity >= product.quantity}
                        className="w-6 h-6 flex items-center justify-center text-white/40 hover:text-white rounded transition-colors cursor-pointer disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => setQty(product._id, 0)}
                      className="text-white/20 hover:text-red-400 transition-colors cursor-pointer ml-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* CHECKOUT VIEW */}
          {view === "checkout" && (
            <div className="px-6 py-4 flex flex-col gap-4">
              <p className="text-xs font-medium tracking-[0.12em] uppercase text-white/25 mb-1">
                Tus datos
              </p>

              {/* Name */}
              <div>
                <label className="block text-xs text-white/40 mb-1.5">
                  Nombre <span className="text-indigo-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre completo"
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs text-white/40 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs text-white/40 mb-1.5">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 000 000 0000"
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all"
                />
              </div>

              {/* Currency */}
              <div>
                <label className="block text-xs text-white/40 mb-1.5">
                  Moneda
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50 transition-all cursor-pointer"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c} className="bg-[#0f0f18]">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs text-white/40 mb-1.5">
                  Notas (opcional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Instrucciones de entrega, dirección, etc."
                  rows={3}
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all resize-none"
                />
              </div>

              {/* Order summary */}
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 mt-1">
                <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-white/25 mb-3">
                  Resumen
                </p>
                {cartItems.map(({ product, quantity }) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between py-1"
                  >
                    <span className="text-xs text-white/50 truncate max-w-[180px]">
                      {quantity}x {product.name}
                    </span>
                    <span className="text-xs text-white/70 font-medium">
                      {currency}{" "}
                      {(product.salePrice * quantity).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                ))}
                <div className="border-t border-white/[0.06] mt-2 pt-2 flex items-center justify-between">
                  <span className="text-xs text-white/40 uppercase tracking-widest">
                    Total
                  </span>
                  <span className="text-sm font-bold text-white">
                    {currency}{" "}
                    {total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {checkoutError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  <p className="text-sm text-red-400">{checkoutError}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {view !== "success" && (
          <div className="px-6 py-5 border-t border-white/[0.06] bg-[#0f0f18]">
            {view === "cart" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-white/40">Subtotal</span>
                  <span className="text-base font-bold text-white">
                    {cartItems.length > 0
                      ? `${cartItems[0]?.product.currency ?? "USD"} ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                      : "—"}
                  </span>
                </div>
                <button
                  onClick={() => setView("checkout")}
                  disabled={cartItems.length === 0}
                  className="w-full py-3 rounded-xl text-sm font-semibold bg-indigo-500/80 hover:bg-indigo-500 text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  Proceder al pago →
                </button>
              </>
            )}
            {view === "checkout" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-white/40">Total</span>
                  <span className="text-base font-bold text-white">
                    {currency}{" "}
                    {total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={submitting}
                  className="w-full py-3 rounded-xl text-sm font-semibold bg-indigo-500/80 hover:bg-indigo-500 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {submitting ? "Procesando..." : "Confirmar orden"}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
