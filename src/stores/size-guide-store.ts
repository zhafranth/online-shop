"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SIZE_GUIDE } from "@/lib/constants";
import type { SizeRow } from "@/types/size-guide";

const ROW_SEED: SizeRow[] = SIZE_GUIDE.map((row, i) => ({ ...row, order: i + 1 }));

const NOTE_SEED =
  "Ukur pada bagian terlebar dalam posisi berdiri tegak. Hasil dapat berbeda 1–2 cm tergantung bahan & potongan.";

interface SizeGuideStore {
  rows: SizeRow[];
  note: string;
  addRow: (row: Omit<SizeRow, "order">) => void;
  updateRow: (originalSize: string, patch: Partial<SizeRow>) => void;
  deleteRow: (size: string) => void;
  moveUp: (size: string) => void;
  moveDown: (size: string) => void;
  setNote: (note: string) => void;
  getSorted: () => SizeRow[];
}

export const useSizeGuideStore = create<SizeGuideStore>()(
  persist(
    (set, get) => ({
      rows: ROW_SEED,
      note: NOTE_SEED,

      addRow: (row) =>
        set((s) => {
          const nextOrder =
            s.rows.length > 0
              ? Math.max(...s.rows.map((r) => r.order)) + 1
              : 1;
          return { rows: [...s.rows, { ...row, order: nextOrder }] };
        }),

      updateRow: (originalSize, patch) =>
        set((s) => ({
          rows: s.rows.map((r) =>
            r.size === originalSize ? { ...r, ...patch } : r,
          ),
        })),

      deleteRow: (size) =>
        set((s) => ({ rows: s.rows.filter((r) => r.size !== size) })),

      moveUp: (size) =>
        set((s) => {
          const sorted = [...s.rows].sort((a, b) => a.order - b.order);
          const idx = sorted.findIndex((r) => r.size === size);
          if (idx <= 0) return s;
          const prev = sorted[idx - 1];
          const cur = sorted[idx];
          return {
            rows: s.rows.map((r) => {
              if (r.size === cur.size) return { ...r, order: prev.order };
              if (r.size === prev.size) return { ...r, order: cur.order };
              return r;
            }),
          };
        }),

      moveDown: (size) =>
        set((s) => {
          const sorted = [...s.rows].sort((a, b) => a.order - b.order);
          const idx = sorted.findIndex((r) => r.size === size);
          if (idx < 0 || idx >= sorted.length - 1) return s;
          const next = sorted[idx + 1];
          const cur = sorted[idx];
          return {
            rows: s.rows.map((r) => {
              if (r.size === cur.size) return { ...r, order: next.order };
              if (r.size === next.size) return { ...r, order: cur.order };
              return r;
            }),
          };
        }),

      setNote: (note) => set({ note }),

      getSorted: () =>
        [...get().rows].sort((a, b) => a.order - b.order),
    }),
    {
      name: "thickapparel-size-guide",
      partialize: (s) => ({ rows: s.rows, note: s.note }),
    },
  ),
);
