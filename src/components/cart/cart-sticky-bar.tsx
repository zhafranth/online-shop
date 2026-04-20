"use client";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CartStickyBarProps { totalItems: number; ongkir: number; total: number; discount: number; }

export function CartStickyBar({ totalItems, ongkir, total, discount }: CartStickyBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-navy text-white px-4 md:px-10 py-3 md:py-4 flex justify-between items-center gap-3 z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
      <div className="min-w-0">
        <div className="text-[11px] text-white/60 mb-0.5 hidden md:block">
          {totalItems} item · {ongkir === 0 ? "✓ Free Ongkir" : `Ongkir ${formatPrice(ongkir)}`}
        </div>
        <div className="text-[11px] text-white/60 mb-0.5 md:hidden">{totalItems} item</div>
        <div className="font-serif text-lg md:text-[22px] text-gold">{formatPrice(total)}</div>
        {discount > 0 && <div className="text-[11px] text-gold-light hidden md:block">Hemat {formatPrice(discount)}</div>}
      </div>
      <Link href="/checkout" className="shrink-0">
        <Button variant="gold" className="text-xs md:text-sm px-4 md:px-9 py-3 md:py-3.5 whitespace-nowrap">
          <span className="md:hidden">Checkout →</span>
          <span className="hidden md:inline">Lanjut ke Checkout →</span>
        </Button>
      </Link>
    </div>
  );
}
