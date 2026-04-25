"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";
import { PRODUCTS } from "@/lib/constants";

interface ProductStore {
  products: Product[];
  addProduct: (data: Omit<Product, "id">) => Product;
  updateProduct: (id: number, data: Partial<Omit<Product, "id">>) => void;
  deleteProduct: (id: number) => void;
  getById: (id: number) => Product | undefined;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: PRODUCTS,

      addProduct: (data) => {
        const { products } = get();
        const nextId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
        const product: Product = { id: nextId, ...data };
        set({ products: [...products, product] });
        return product;
      },

      updateProduct: (id, data) => {
        set({
          products: get().products.map((p) => (p.id === id ? { ...p, ...data } : p)),
        });
      },

      deleteProduct: (id) => {
        set({ products: get().products.filter((p) => p.id !== id) });
      },

      getById: (id) => get().products.find((p) => p.id === id),
    }),
    {
      name: "vestire-products",
      partialize: (state) => ({ products: state.products }),
    }
  )
);
