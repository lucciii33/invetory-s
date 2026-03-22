import type { InventoryItem } from "./inventoryApi";
import type { CreateOrderDTO, Order } from "./ordersApi";

// Public endpoints — no auth token needed
// NOTE: Your backend must allow unauthenticated access to these endpoints for the store to work:
//   GET  /api/inventory/getItemsByUserId/:id  (public read)
//   POST /api/order/createOrder               (public create)

export async function fetchPublicInventory(userId: string): Promise<InventoryItem[]> {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/inventory/getItemsByUserId/${userId}`,
    { method: "GET", headers: { "Content-Type": "application/json" } }
  );
  if (!response.ok) throw new Error("No se pudieron cargar los productos");
  return response.json();
}

export async function createPublicOrder(order: CreateOrderDTO): Promise<Order> {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/order/createOrder`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    }
  );
  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || "Error al procesar la orden");
  }
  return response.json();
}
