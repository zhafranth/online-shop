"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Order, OrderStatus } from "@/types/admin";
import { SEED_ORDERS } from "@/lib/admin-seeds";

interface OrderStore {
  orders: Order[];
  updateStatus: (id: string, status: OrderStatus) => void;
  getById: (id: string) => Order | undefined;
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
    }),
    {
      name: "vestire-orders",
      partialize: (state) => ({ orders: state.orders }),
    }
  )
);
