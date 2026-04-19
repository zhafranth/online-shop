"use client";
import { useCartStore } from "@/stores/cart-store";

export function Toast() {
  const toast = useCartStore((state) => state.toast);
  if (!toast) return null;
  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-navy text-white px-6 py-3 text-[13px] font-medium z-[9999] whitespace-nowrap animate-toast-in">
      {toast}
    </div>
  );
}
