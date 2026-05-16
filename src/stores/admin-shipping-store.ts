// Admin shipping config store.
// NOTE: This is DIFFERENT from `shipping-store.ts` (checkout session address/option state).
// Owns the admin-controlled catalogue of couriers + warehouse origin used at checkout.

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ShippingCourier,
  WarehouseOrigin,
} from "@/types/shipping-admin";

const COURIER_SEED: ShippingCourier[] = [
  {
    code: "jne",
    label: "JNE REG",
    description: "Estimasi 2–3 hari kerja",
    price: 15000,
    etdMin: 2,
    etdMax: 3,
    enabled: true,
    order: 1,
  },
  {
    code: "jnt",
    label: "J&T Express",
    description: "Estimasi 2–4 hari kerja",
    price: 12000,
    etdMin: 2,
    etdMax: 4,
    enabled: true,
    order: 2,
  },
  {
    code: "sicepat",
    label: "SiCepat HEMAT",
    description: "Estimasi 3–5 hari kerja",
    price: 9000,
    etdMin: 3,
    etdMax: 5,
    enabled: true,
    order: 3,
  },
  {
    code: "gosend",
    label: "GoSend Same Day",
    description: "Tiba hari ini (area tertentu)",
    price: 35000,
    etdMin: 1,
    etdMax: 1,
    enabled: true,
    order: 4,
  },
];

const WAREHOUSE_SEED: WarehouseOrigin = {
  provinceId: 9,
  provinceName: "JAWA BARAT",
  cityId: 22,
  cityName: "BANDUNG",
  districtId: 1391,
  districtName: "BANDUNG WETAN",
  zipCode: "40115",
};

interface AdminShippingStore {
  couriers: ShippingCourier[];
  warehouse: WarehouseOrigin;
  addCourier: (courier: ShippingCourier) => void;
  updateCourier: (code: string, patch: Partial<ShippingCourier>) => void;
  deleteCourier: (code: string) => void;
  toggleEnabled: (code: string) => void;
  moveUp: (code: string) => void;
  moveDown: (code: string) => void;
  setWarehouse: (warehouse: WarehouseOrigin) => void;
  getByCode: (code: string) => ShippingCourier | undefined;
  getEnabledSorted: () => ShippingCourier[];
}

export const useAdminShippingStore = create<AdminShippingStore>()(
  persist(
    (set, get) => ({
      couriers: COURIER_SEED,
      warehouse: WAREHOUSE_SEED,

      addCourier: (courier) =>
        set((s) => ({
          couriers: [...s.couriers, courier].sort((a, b) => a.order - b.order),
        })),

      updateCourier: (code, patch) =>
        set((s) => ({
          couriers: s.couriers.map((c) =>
            c.code === code ? { ...c, ...patch } : c,
          ),
        })),

      deleteCourier: (code) =>
        set((s) => ({ couriers: s.couriers.filter((c) => c.code !== code) })),

      toggleEnabled: (code) =>
        set((s) => ({
          couriers: s.couriers.map((c) =>
            c.code === code ? { ...c, enabled: !c.enabled } : c,
          ),
        })),

      moveUp: (code) =>
        set((s) => {
          const sorted = [...s.couriers].sort((a, b) => a.order - b.order);
          const idx = sorted.findIndex((c) => c.code === code);
          if (idx <= 0) return s;
          const prev = sorted[idx - 1];
          const cur = sorted[idx];
          return {
            couriers: s.couriers.map((c) => {
              if (c.code === cur.code) return { ...c, order: prev.order };
              if (c.code === prev.code) return { ...c, order: cur.order };
              return c;
            }),
          };
        }),

      moveDown: (code) =>
        set((s) => {
          const sorted = [...s.couriers].sort((a, b) => a.order - b.order);
          const idx = sorted.findIndex((c) => c.code === code);
          if (idx < 0 || idx >= sorted.length - 1) return s;
          const next = sorted[idx + 1];
          const cur = sorted[idx];
          return {
            couriers: s.couriers.map((c) => {
              if (c.code === cur.code) return { ...c, order: next.order };
              if (c.code === next.code) return { ...c, order: cur.order };
              return c;
            }),
          };
        }),

      setWarehouse: (warehouse) => set({ warehouse }),

      getByCode: (code) => get().couriers.find((c) => c.code === code),

      getEnabledSorted: () =>
        [...get().couriers]
          .filter((c) => c.enabled)
          .sort((a, b) => a.order - b.order),
    }),
    {
      name: "thickapparel-admin-shipping",
      partialize: (s) => ({ couriers: s.couriers, warehouse: s.warehouse }),
    },
  ),
);
