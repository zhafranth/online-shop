"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order, OrderStatus } from "@/types/admin";
import { SEED_ORDERS } from "@/lib/admin-seeds";

interface CreateOrderInput {
  userId: number;
  userName: string;
  userEmail: string;
  items: Order["items"];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  shippingAddress: string;
  shippingDetails?: Order["shippingDetails"];
}

interface MarkPaidInput {
  awb: string;
  paidAt: string;
}

interface OrderStore {
  orders: Order[];
  updateStatus: (id: string, status: OrderStatus) => void;
  getById: (id: string) => Order | undefined;
  create: (input: CreateOrderInput) => Order;
  markPaid: (id: string, input: MarkPaidInput) => void;
  cancel: (id: string) => void;
}

function generateOrderId(orders: Order[]): string {
  const year = new Date().getFullYear();
  const prefix = `ORD-${year}-`;
  const sameYear = orders.filter((o) => o.id.startsWith(prefix));
  let maxSeq = 0;
  for (const o of sameYear) {
    const seq = Number(o.id.slice(prefix.length));
    if (!Number.isNaN(seq) && seq > maxSeq) maxSeq = seq;
  }
  return `${prefix}${String(maxSeq + 1).padStart(4, "0")}`;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: SEED_ORDERS,

      updateStatus: (id, status) => {
        set({
          orders: get().orders.map((o) => (o.id === id ? { ...o, status } : o)),
        });
      },

      getById: (id) => get().orders.find((o) => o.id === id),

      create: (input) => {
        const newOrder: Order = {
          id: generateOrderId(get().orders),
          userId: input.userId,
          userName: input.userName,
          userEmail: input.userEmail,
          items: input.items,
          subtotal: input.subtotal,
          shipping: input.shipping,
          total: input.total,
          paymentMethod: input.paymentMethod,
          shippingAddress: input.shippingAddress,
          shippingDetails: input.shippingDetails,
          status: "pending",
          paymentStatus: "PENDING",
          shippingStatus: "Packing",
          createdAt: new Date().toISOString(),
        };
        set({ orders: [newOrder, ...get().orders] });
        return newOrder;
      },

      markPaid: (id, { awb, paidAt }) => {
        set({
          orders: get().orders.map((o) =>
            o.id === id
              ? {
                  ...o,
                  awb,
                  paidAt,
                  paymentStatus: "PAID",
                  status: "processing",
                  shippingStatus: "Packing",
                }
              : o,
          ),
        });
      },

      cancel: (id) => {
        set({
          orders: get().orders.map((o) =>
            o.id === id
              ? { ...o, status: "cancelled", shippingStatus: "Dibatalkan" }
              : o,
          ),
        });
      },
    }),
    {
      name: "thickapparel-orders",
      partialize: (state) => ({ orders: state.orders }),
    },
  ),
);
