"use client";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CartStickyBarProps { totalItems: number; ongkir: number; total: number; discount: number; }

export function CartStickyBar({ totalItems, ongkir, total, discount }: CartStickyBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-navy text-white px-10 py-4 flex justify-between items-center z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
      <div>
        <div className="text-[11px] text-white/60 mb-0.5">
          {totalItems} item · {ongkir === 0 ? "✓ Free Ongkir" : `Ongkir ${formatPrice(ongkir)}`}
        </div>
        <div className="font-serif text-[22px] text-gold">{formatPrice(total)}</div>
        {discount > 0 && <div className="text-[11px] text-gold-light">Hemat {formatPrice(discount)}</div>}
      </div>
      <Link href="/checkout"><Button variant="gold" className="text-sm px-9 py-3.5">Lanjut ke Checkout →</Button></Link>
    </div>
  );
}
