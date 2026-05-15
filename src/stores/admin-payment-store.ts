// Admin payment method config store.
// NOTE: This is DIFFERENT from `payment-store.ts` (which tracks QRIS session state).
// This store owns the admin-controlled catalogue of payment methods rendered at checkout.

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PaymentMethod } from "@/types/payment-admin";

const SEED: PaymentMethod[] = [
  {
    id: "transfer",
    type: "transfer",
    label: "Transfer Bank",
    description: "BCA, Mandiri, BNI, BRI",
    icon: "🏦",
    enabled: true,
    order: 1,
    bankAccounts: [
      { bankName: "BCA", accountNo: "1234567890", accountHolder: "PT Thick Apparel" },
      { bankName: "Mandiri", accountNo: "9876543210", accountHolder: "PT Thick Apparel" },
    ],
  },
  {
    id: "gopay",
    type: "ewallet",
    label: "GoPay / OVO",
    description: "Bayar via dompet digital",
    icon: "📱",
    enabled: true,
    order: 2,
  },
  {
    id: "cc",
    type: "cc",
    label: "Kartu Kredit / Debit",
    description: "Visa, Mastercard, JCB",
    icon: "💳",
    enabled: true,
    order: 3,
  },
  {
    id: "cod",
    type: "cod",
    label: "Bayar di Tempat (COD)",
    description: "Khusus area tertentu",
    icon: "🤝",
    enabled: true,
    order: 4,
  },
  {
    id: "paylater",
    type: "paylater",
    label: "Kredivo / Akulaku",
    description: "Cicilan 0%",
    icon: "📋",
    enabled: false,
    order: 5,
  },
];

interface AdminPaymentStore {
  methods: PaymentMethod[];
  addMethod: (method: PaymentMethod) => void;
  updateMethod: (id: string, patch: Partial<PaymentMethod>) => void;
  deleteMethod: (id: string) => void;
  toggleEnabled: (id: string) => void;
  moveUp: (id: string) => void;
  moveDown: (id: string) => void;
  getById: (id: string) => PaymentMethod | undefined;
  getEnabledSorted: () => PaymentMethod[];
}

export const useAdminPaymentStore = create<AdminPaymentStore>()(
  persist(
    (set, get) => ({
      methods: SEED,

      addMethod: (method) =>
        set((s) => ({
          methods: [...s.methods, method].sort((a, b) => a.order - b.order),
        })),

      updateMethod: (id, patch) =>
        set((s) => ({
          methods: s.methods.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        })),

      deleteMethod: (id) =>
        set((s) => ({ methods: s.methods.filter((m) => m.id !== id) })),

      toggleEnabled: (id) =>
        set((s) => ({
          methods: s.methods.map((m) =>
            m.id === id ? { ...m, enabled: !m.enabled } : m,
          ),
        })),

      moveUp: (id) =>
        set((s) => {
          const sorted = [...s.methods].sort((a, b) => a.order - b.order);
          const idx = sorted.findIndex((m) => m.id === id);
          if (idx <= 0) return s;
          const prev = sorted[idx - 1];
          const cur = sorted[idx];
          return {
            methods: s.methods.map((m) => {
              if (m.id === cur.id) return { ...m, order: prev.order };
              if (m.id === prev.id) return { ...m, order: cur.order };
              return m;
            }),
          };
        }),

      moveDown: (id) =>
        set((s) => {
          const sorted = [...s.methods].sort((a, b) => a.order - b.order);
          const idx = sorted.findIndex((m) => m.id === id);
          if (idx < 0 || idx >= sorted.length - 1) return s;
          const next = sorted[idx + 1];
          const cur = sorted[idx];
          return {
            methods: s.methods.map((m) => {
              if (m.id === cur.id) return { ...m, order: next.order };
              if (m.id === next.id) return { ...m, order: cur.order };
              return m;
            }),
          };
        }),

      getById: (id) => get().methods.find((m) => m.id === id),

      getEnabledSorted: () =>
        [...get().methods]
          .filter((m) => m.enabled)
          .sort((a, b) => a.order - b.order),
    }),
    {
      name: "thickapparel-admin-payment",
      partialize: (s) => ({ methods: s.methods }),
    },
  ),
);
