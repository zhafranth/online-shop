"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Promo } from "@/types/promo";

const PROMO_SEED: Promo[] = [
  {
    id: "welcome10",
    code: "WELCOME10",
    label: "Diskon Selamat Datang",
    description: "Potongan 10% untuk pelanggan baru, berlaku untuk seluruh koleksi.",
    type: "percent",
    value: 10,
    maxDiscount: 75000,
    minPurchase: 250000,
    startsAt: "2026-01-01T00:00:00.000Z",
    endsAt: "2026-12-31T23:59:59.000Z",
    usageLimit: 500,
    usageCount: 128,
    applicability: "first-order",
    categoryId: null,
    enabled: true,
    createdAt: "2025-12-20T08:00:00.000Z",
  },
  {
    id: "raya2026",
    code: "RAYA2026",
    label: "Hari Raya Edit",
    description: "Diskon 20% untuk koleksi Raya — terbatas selama bulan suci.",
    type: "percent",
    value: 20,
    maxDiscount: 150000,
    minPurchase: 400000,
    startsAt: "2026-03-10T00:00:00.000Z",
    endsAt: "2026-04-15T23:59:59.000Z",
    usageLimit: 1000,
    usageCount: 642,
    applicability: "all",
    categoryId: null,
    enabled: true,
    createdAt: "2026-02-22T09:30:00.000Z",
  },
  {
    id: "gratisongkir",
    code: "GRATISONGKIR",
    label: "Gratis Ongkir Nasional",
    description: "Bebas ongkir ke seluruh Indonesia, minimum belanja Rp 350.000.",
    type: "shipping",
    value: 0,
    maxDiscount: null,
    minPurchase: 350000,
    startsAt: "2026-04-01T00:00:00.000Z",
    endsAt: "2026-06-30T23:59:59.000Z",
    usageLimit: null,
    usageCount: 412,
    applicability: "all",
    categoryId: null,
    enabled: true,
    createdAt: "2026-03-28T11:15:00.000Z",
  },
  {
    id: "flash50k",
    code: "FLASH50K",
    label: "Flash 50K",
    description: "Potongan langsung Rp 50.000 untuk minimum belanja Rp 300.000.",
    type: "fixed",
    value: 50000,
    maxDiscount: null,
    minPurchase: 300000,
    startsAt: "2026-05-01T00:00:00.000Z",
    endsAt: "2026-05-31T23:59:59.000Z",
    usageLimit: 300,
    usageCount: 87,
    applicability: "all",
    categoryId: null,
    enabled: true,
    createdAt: "2026-04-25T14:20:00.000Z",
  },
  {
    id: "loyal15",
    code: "LOYAL15",
    label: "Apresiasi Pelanggan Setia",
    description: "Diskon 15% untuk pelanggan dengan riwayat 3 transaksi atau lebih.",
    type: "percent",
    value: 15,
    maxDiscount: 100000,
    minPurchase: 300000,
    startsAt: "2026-06-01T00:00:00.000Z",
    endsAt: "2026-08-31T23:59:59.000Z",
    usageLimit: null,
    usageCount: 0,
    applicability: "all",
    categoryId: null,
    enabled: true,
    createdAt: "2026-05-12T10:00:00.000Z",
  },
  {
    id: "aksesoris25",
    code: "AKSESORIS25",
    label: "Edit Aksesoris",
    description: "Diskon 25% khusus kategori aksesoris pilihan.",
    type: "percent",
    value: 25,
    maxDiscount: 200000,
    minPurchase: 500000,
    startsAt: "2026-07-15T00:00:00.000Z",
    endsAt: "2026-09-15T23:59:59.000Z",
    usageLimit: 200,
    usageCount: 0,
    applicability: "category",
    categoryId: "aksesoris",
    enabled: true,
    createdAt: "2026-06-30T13:45:00.000Z",
  },
  {
    id: "newyear24",
    code: "NEWYEAR24",
    label: "New Year Refresh",
    description: "Promo akhir tahun lalu — sudah berakhir per Januari 2026.",
    type: "percent",
    value: 12,
    maxDiscount: 80000,
    minPurchase: 250000,
    startsAt: "2025-12-15T00:00:00.000Z",
    endsAt: "2026-01-15T23:59:59.000Z",
    usageLimit: 500,
    usageCount: 487,
    applicability: "all",
    categoryId: null,
    enabled: false,
    createdAt: "2025-12-10T09:00:00.000Z",
  },
  {
    id: "weekend9k",
    code: "WEEKEND9K",
    label: "Ongkir Hemat Akhir Pekan",
    description: "Diskon ongkir Rp 9.000 untuk pesanan akhir pekan.",
    type: "fixed",
    value: 9000,
    maxDiscount: null,
    minPurchase: 150000,
    startsAt: "2026-05-10T00:00:00.000Z",
    endsAt: "2026-07-31T23:59:59.000Z",
    usageLimit: null,
    usageCount: 35,
    applicability: "all",
    categoryId: null,
    enabled: false,
    createdAt: "2026-05-05T12:00:00.000Z",
  },
];

interface AdminPromoStore {
  promos: Promo[];
  addPromo: (promo: Promo) => void;
  updatePromo: (id: string, patch: Partial<Promo>) => void;
  deletePromo: (id: string) => void;
  toggleEnabled: (id: string) => void;
  getById: (id: string) => Promo | undefined;
}

export const useAdminPromoStore = create<AdminPromoStore>()(
  persist(
    (set, get) => ({
      promos: PROMO_SEED,

      addPromo: (promo) =>
        set((s) => ({ promos: [promo, ...s.promos] })),

      updatePromo: (id, patch) =>
        set((s) => ({
          promos: s.promos.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),

      deletePromo: (id) =>
        set((s) => ({ promos: s.promos.filter((p) => p.id !== id) })),

      toggleEnabled: (id) =>
        set((s) => ({
          promos: s.promos.map((p) =>
            p.id === id ? { ...p, enabled: !p.enabled } : p,
          ),
        })),

      getById: (id) => get().promos.find((p) => p.id === id),
    }),
    {
      name: "thickapparel-admin-promo",
      partialize: (s) => ({ promos: s.promos }),
    },
  ),
);
