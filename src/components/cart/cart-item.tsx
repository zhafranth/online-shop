"use client";
import Link from "next/link";
import { CartItem as CartItemType } from "@/types";
import { formatPrice } from "@/lib/utils";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

interface CartItemProps { item: CartItemType; index: number; onUpdateQty: (index: number, qty: number) => void; onRemove: (index: number) => void; }

export function CartItem({ item, index, onUpdateQty, onRemove }: CartItemProps) {
  return (
    <div className="flex gap-3 sm:gap-5 py-5 sm:py-6 border-b border-site-border items-start">
      <PlaceholderImage label={item.label} className="w-[80px] sm:w-[100px] h-[100px] sm:h-[120px] shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <div className="text-[11px] text-site-gray mb-0.5">{item.category}</div>
            <Link href={`/product/${item.id}`} className="font-serif text-base sm:text-lg mb-1.5 cursor-pointer no-underline text-site-text hover:text-navy block">{item.name}</Link>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-site-gray">
              <span>Ukuran: {item.selectedSize || "-"}</span>
              <span>Warna: {item.selectedColor || "-"}</span>
            </div>
          </div>
          <button onClick={() => onRemove(index)} className="bg-transparent border-none text-site-gray cursor-pointer text-lg shrink-0 hover:text-navy">×</button>
        </div>
        <div className="flex justify-between items-center mt-3 sm:mt-4 gap-2">
          <div className="flex border-[1.5px] border-site-border items-center">
            <button onClick={() => onUpdateQty(index, Math.max(1, item.qty - 1))} className="w-9 h-9 bg-transparent border-none text-lg cursor-pointer">−</button>
            <span className="w-9 text-center text-[13px] font-semibold">{item.qty}</span>
            <button onClick={() => onUpdateQty(index, item.qty + 1)} className="w-9 h-9 bg-transparent border-none text-lg cursor-pointer">+</button>
          </div>
          <div className="text-right">
            <div className="font-serif text-base sm:text-lg font-semibold text-navy">{formatPrice(item.price * item.qty)}</div>
            {item.qty > 1 && <div className="text-[11px] text-site-gray">{formatPrice(item.price)} × {item.qty}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
