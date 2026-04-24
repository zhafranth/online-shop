export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  productId: number;
  productName: string;
  price: number;
  qty: number;
  size: string;
  color: string;
}

export interface Order {
  id: string;                // "ORD-001", "ORD-002", ...
  userId: number;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  shippingAddress: string;
  paymentMethod: string;
  createdAt: string;         // ISO 8601
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  joinedAt: string;          // ISO 8601
  totalOrders: number;
  totalSpent: number;
}

export interface AdminUser {
  email: string;
  name: string;
}
