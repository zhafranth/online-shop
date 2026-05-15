"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { QrisPayment } from "@/types/raja-ongkir";

interface PaymentStore {
  sessions: Record<string, QrisPayment>;
  add: (payment: QrisPayment) => void;
  markPaid: (paymentId: string, paidAt: string) => void;
  cancel: (paymentId: string) => void;
  expire: (paymentId: string) => void;
  getById: (paymentId: string) => QrisPayment | undefined;
}

export const usePaymentStore = create<PaymentStore>()(
  persist(
    (set, get) => ({
      sessions: {},

      add: (payment) =>
        set((state) => ({
          sessions: { ...state.sessions, [payment.payment_id]: payment },
        })),

      markPaid: (paymentId, paidAt) =>
        set((state) => {
          const session = state.sessions[paymentId];
          if (!session) return state;
          return {
            sessions: {
              ...state.sessions,
              [paymentId]: { ...session, status: "PAID", paid_at: paidAt },
            },
          };
        }),

      cancel: (paymentId) =>
        set((state) => {
          const session = state.sessions[paymentId];
          if (!session) return state;
          return {
            sessions: {
              ...state.sessions,
              [paymentId]: { ...session, status: "CANCELLED" },
            },
          };
        }),

      expire: (paymentId) =>
        set((state) => {
          const session = state.sessions[paymentId];
          if (!session) return state;
          return {
            sessions: {
              ...state.sessions,
              [paymentId]: { ...session, status: "EXPIRED" },
            },
          };
        }),

      getById: (paymentId) => get().sessions[paymentId],
    }),
    {
      name: "thickapparel-payments",
      partialize: (state) => ({ sessions: state.sessions }),
    },
  ),
);
