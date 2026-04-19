"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types";

interface CartStore {
  items: CartItem[];
  toast: string | null;
  addItem: (item: CartItem) => void;
  updateQty: (index: number, qty: number) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
  showToast: (message: string) => void;
  dismissToast: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      toast: null,

      addItem: (item) => {
        const { items } = get();
        const existingIndex = items.findIndex(
          (c) =>
            c.id === item.id &&
            c.selectedSize === item.selectedSize &&
            c.selectedColor === item.selectedColor
        );

        if (existingIndex >= 0) {
          const updated = items.map((c, i) =>
            i === existingIndex ? { ...c, qty: c.qty + item.qty } : c
          );
          set({ items: updated });
        } else {
          set({ items: [...items, item] });
        }

        get().showToast(`✓ ${item.name} ditambahkan ke keranjang`);
      },

      updateQty: (index, qty) => {
        set({
          items: get().items.map((c, i) =>
            i === index ? { ...c, qty } : c
          ),
        });
      },

      removeItem: (index) => {
        set({ items: get().items.filter((_, i) => i !== index) });
      },

      clearCart: () => set({ items: [] }),

      showToast: (message) => {
        set({ toast: message });
        setTimeout(() => set({ toast: null }), 2300);
      },

      dismissToast: () => set({ toast: null }),

      totalItems: () => get().items.reduce((sum, item) => sum + item.qty, 0),

      subtotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.qty, 0),
    }),
    {
      name: "vestire-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
