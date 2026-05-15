"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ShippingAddress, ShippingOption } from "@/types/raja-ongkir";

interface ShippingStore {
  address: ShippingAddress | null;
  selectedOption: ShippingOption | null;
  setAddress: (address: ShippingAddress) => void;
  setOption: (option: ShippingOption) => void;
  reset: () => void;
}

export const useShippingStore = create<ShippingStore>()(
  persist(
    (set) => ({
      address: null,
      selectedOption: null,

      setAddress: (address) => set({ address }),
      setOption: (option) => set({ selectedOption: option }),
      reset: () => set({ address: null, selectedOption: null }),
    }),
    {
      name: "thickapparel-shipping",
      partialize: (state) => ({
        address: state.address,
        selectedOption: state.selectedOption,
      }),
    },
  ),
);
