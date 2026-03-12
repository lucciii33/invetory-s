import { getAuthToken } from "../../auth";
import { useState } from "react";

export type OrderStatus = "pending" | "accepted" | "cancelled";

export interface OrderCustomer {
  name: string;
  email?: string;
  phone?: string;
}

export interface OrderItem {
  product: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  owner: string;
  customer: OrderCustomer;
  items: OrderItem[];
  status: OrderStatus;
  inventoryDeducted: boolean;
  total: number;
  currency: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDTO {
  owner: string;
  customer: OrderCustomer;
  items: OrderItem[];
  currency?: string;
  notes?: string;
  total: number; 
}

interface OrdersState {
  loading: boolean;
  mutating: boolean;
  error: string | null;
  data: Order[];
}

export function UseOrdersApi() {
  const [state, setState] = useState<OrdersState>({
    loading: false,
    mutating: false,
    error: null,
    data: [],
  });

  const createOrder = async (order: CreateOrderDTO) => {
    setState((prev) => ({ ...prev, mutating: true, error: null }));
    const token = getAuthToken();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/order/createOrder`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(order),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || "Error al crear la orden");
      }
      const data: Order = await response.json();
      setState((prev) => ({ ...prev, mutating: false, data: [data, ...prev.data] }));
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al crear la orden";
      setState((prev) => ({ ...prev, mutating: false, error: message }));
      throw error;
    }
  };

  const getOrdersByUserId = async (id: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    const token = getAuthToken();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/order/getOrdersByUserId/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al obtener las órdenes");
      const data: Order[] = await response.json();
      setState((prev) => ({ ...prev, loading: false, data }));
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al obtener las órdenes";
      setState((prev) => ({ ...prev, loading: false, error: message }));
      throw error;
    }
  };

  const getOrderById = async (id: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    const token = getAuthToken();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/getOrderById/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al obtener la orden");
      const data: Order = await response.json();
      setState((prev) => ({ ...prev, loading: false }));
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al obtener la orden";
      setState((prev) => ({ ...prev, loading: false, error: message }));
      throw error;
    }
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    setState((prev) => ({ ...prev, mutating: true, error: null }));
    const token = getAuthToken();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/updateOrderById/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || "Error al actualizar la orden");
      }
      const data: Order = await response.json();
      setState((prev) => ({
        ...prev,
        mutating: false,
        data: prev.data.map((o) => (o._id === id ? data : o)),
      }));
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al actualizar la orden";
      setState((prev) => ({ ...prev, mutating: false, error: message }));
      throw error;
    }
  };

  const deleteOrder = async (id: string) => {
    setState((prev) => ({ ...prev, mutating: true, error: null }));
    const token = getAuthToken();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/deleteOrderById/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al eliminar la orden");
      const data: Order = await response.json();
      setState((prev) => ({
        ...prev,
        mutating: false,
        data: prev.data.filter((o) => o._id !== id),
      }));
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al eliminar la orden";
      setState((prev) => ({ ...prev, mutating: false, error: message }));
      throw error;
    }
  };

  return {
    ...state,
    createOrder,
    getOrdersByUserId,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
  };
}
