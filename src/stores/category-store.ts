"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductCategory } from "@/types/category";

const SEED: ProductCategory[] = [
  { id: "men", label: "Men", slug: "men", enabled: true, order: 1 },
  { id: "women", label: "Women", slug: "women", enabled: true, order: 2 },
  { id: "unisex", label: "Unisex", slug: "unisex", enabled: true, order: 3 },
  { id: "aksesoris", label: "Aksesoris", slug: "aksesoris", enabled: true, order: 4 },
];

interface CategoryStore {
  categories: ProductCategory[];
  addCategory: (cat: ProductCategory) => void;
  updateCategory: (id: string, patch: Partial<ProductCategory>) => void;
  deleteCategory: (id: string) => boolean;
  moveUp: (id: string) => void;
  moveDown: (id: string) => void;
  getById: (id: string) => ProductCategory | undefined;
  getEnabledSorted: () => ProductCategory[];
}

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: SEED,

      addCategory: (cat) =>
        set((s) => ({
          categories: [...s.categories, cat].sort((a, b) => a.order - b.order),
        })),

      updateCategory: (id, patch) =>
        set((s) => ({
          categories: s.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),

      deleteCategory: (id) => {
        const exists = get().categories.some((c) => c.id === id);
        if (!exists) return false;
        set((s) => ({ categories: s.categories.filter((c) => c.id !== id) }));
        return true;
      },

      moveUp: (id) =>
        set((s) => {
          const sorted = [...s.categories].sort((a, b) => a.order - b.order);
          const idx = sorted.findIndex((c) => c.id === id);
          if (idx <= 0) return s;
          const prev = sorted[idx - 1];
          const cur = sorted[idx];
          return {
            categories: s.categories.map((c) => {
              if (c.id === cur.id) return { ...c, order: prev.order };
              if (c.id === prev.id) return { ...c, order: cur.order };
              return c;
            }),
          };
        }),

      moveDown: (id) =>
        set((s) => {
          const sorted = [...s.categories].sort((a, b) => a.order - b.order);
          const idx = sorted.findIndex((c) => c.id === id);
          if (idx < 0 || idx >= sorted.length - 1) return s;
          const next = sorted[idx + 1];
          const cur = sorted[idx];
          return {
            categories: s.categories.map((c) => {
              if (c.id === cur.id) return { ...c, order: next.order };
              if (c.id === next.id) return { ...c, order: cur.order };
              return c;
            }),
          };
        }),

      getById: (id) => get().categories.find((c) => c.id === id),

      getEnabledSorted: () =>
        [...get().categories]
          .filter((c) => c.enabled)
          .sort((a, b) => a.order - b.order),
    }),
    {
      name: "thickapparel-categories",
      partialize: (s) => ({ categories: s.categories }),
    },
  ),
);
