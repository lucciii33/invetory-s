import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("post/:id", "routes/post.$id.tsx"),
  route("dashboard/:id", "routes/dashboard.$id.tsx"),
  route("inventory", "routes/inventory/inventory.tsx"),
  route("inventory/create", "routes/inventory/createInventory.tsx"),
  route("inventory/:id", "routes/inventory/inventory.$id.tsx"),
  route("orders", "routes/orders/orders.tsx"),


  // route("orders/:id", "routes/orders/orders.$id.tsx"),
] satisfies RouteConfig;