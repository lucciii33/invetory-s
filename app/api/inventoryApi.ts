import { getAuthToken } from "../../auth";
import { useState } from "react";

export type UnitType = "unit" | "kg" | "g" | "liter" | "meter" | "box";

export interface InventoryItem {
  _id: string;

  name: string;
  sku: string;

  barcode?: string;
  description?: string;

  owner: string;

  quantity: number;
  minimumStock: number;

  unit: UnitType;

  costPrice: number;
  salePrice: number;
  currency: string;

  location?: string;
  supplier?: string;

  expirationDate?: string;
  lastRestockedAt?: string;

  isActive: boolean;

  images: string[];

  createdAt: string;
  updatedAt: string;
}

export interface CreateInventoryDTO {
  name: string;
  sku: string;

  barcode?: string;
  description?: string;

  quantity?: number;
  minimumStock?: number;

  unit?: UnitType;

  costPrice?: number;
  salePrice?: number;
  currency?: string;

  location?: string;
  supplier?: string;

  expirationDate?: string;

  images?: string[];
}

export type UpdateInventoryDTO = Partial<CreateInventoryDTO> & {
  isActive?: boolean;
  lastRestockedAt?: string;
};

export interface InventoryState {
  loading: boolean;
  error: string | null;
  data: InventoryItem[];
}

export function UseInventoryApi() {
  const [state, setState] = useState<InventoryState>({
    loading: false,
    error: null,
    data: [],
  });

  const createInventory = async (inventory: CreateInventoryDTO) => {
    setState({ loading: true, error: null, data: [] });
     const token = getAuthToken();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/inventory/createItem`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(inventory),
      });

      if (!response.ok) throw new Error("Error al crear el inventario");

      const data: InventoryItem = await response.json();
      setState({ loading: false, error: null, data: [data] });
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al crear el inventario";
      setState({ loading: false, error: message, data: [] });
      throw error;
    }
  };

    const getInventoryByUserId = async (id: string) => {
    setState({ loading: true, error: null, data: [] });
    const token = getAuthToken();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/inventory/getItemsByUserId/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al obtener el inventario");

      const data: InventoryItem[] = await response.json();
      setState({ loading: false, error: null, data });
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al obtener el inventario";
      setState({ loading: false, error: message, data: [] });
      throw error;
    }
  };

  

  return {
    ...state,
    createInventory,
    getInventoryByUserId
  };
}