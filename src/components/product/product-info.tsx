"use client";
import { useState } from "react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { Badge } from "@/components/ui/badge";
import { Tag } from "@/components/ui/tag";
import { Button } from "@/components/ui/button";
import { SizeGuide } from "./size-guide";

interface ProductInfoProps { product: Product; }

export function ProductInfo({ product: p }: ProductInfoProps) {
  const [selColor, setSelColor] = useState(p.colors[0]);
  const [selSize, setSelSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = () => {
    if (!selSize) return;
    addItem({ ...p, selectedColor: selColor, selectedSize: selSize, qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discountPct = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;

  return (
    <div className="lg:sticky lg:top-[90px]">
      {p.badge && <Badge className="mb-3">{p.badge}</Badge>}
      <h1 className="font-serif font-normal text-2xl md:text-[32px] leading-[1.2] mb-1.5">{p.name}</h1>
      <div className="flex items-center gap-2 mb-4 text-[13px]">
        <span className="text-gold">★★★★★</span>
        <span className="text-site-gray">4.9 (128 ulasan)</span>
      </div>
      <div className="flex items-baseline gap-2.5 mb-6 pb-6 border-b border-site-border flex-wrap">
        <span className="font-serif text-2xl md:text-[28px] font-semibold text-navy">{formatPrice(p.price)}</span>
        {p.originalPrice && (
          <>
            <span className="text-base text-site-gray line-through">{formatPrice(p.originalPrice)}</span>
            <span className="text-xs bg-gold text-white px-2 py-0.5">-{discountPct}%</span>
          </>
        )}
      </div>
      {/* Color */}
      <div className="mb-6">
        <div className="text-xs font-semibold tracking-[0.1em] uppercase mb-2.5">
          Warna: <span className="text-site-gray font-normal normal-case">{selColor}</span>
        </div>
        <div className="flex gap-2">
          {p.colors.map((c) => (
            <div key={c} onClick={() => setSelColor(c)} className={`px-3.5 py-[5px] text-xs cursor-pointer border-[1.5px] transition-all ${selColor === c ? "border-navy bg-navy text-white" : "border-site-border bg-white text-site-text"}`}>{c}</div>
          ))}
        </div>
      </div>
      {/* Size */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2.5">
          <div className="text-xs font-semibold tracking-[0.1em] uppercase">Ukuran</div>
          <button onClick={() => setSizeGuideOpen(!sizeGuideOpen)} className="bg-transparent border-none text-xs text-gold cursor-pointer font-sans underline underline-offset-[3px]">
            📐 Panduan Ukuran {sizeGuideOpen ? "▲" : "▼"}
          </button>
        </div>
        <div className="flex gap-1.5 flex-wrap mb-3">
          {p.sizes.map((s) => (
            <Tag key={s} active={selSize === s} onClick={() => setSelSize(s)} className="min-w-[44px] justify-center text-[13px]">{s}</Tag>
          ))}
        </div>
        {!selSize && <div className="text-xs text-gold mt-1">↑ Pilih ukuran terlebih dahulu</div>}
        {sizeGuideOpen && <SizeGuide selectedSize={selSize} onSizeSelect={setSelSize} />}
      </div>
      {/* Qty + CTA */}
      <div className="flex gap-2.5 mb-3">
        <div className="flex border-[1.5px] border-site-border items-center">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-12 bg-transparent border-none text-lg cursor-pointer text-navy">−</button>
          <span className="w-10 text-center text-sm font-semibold">{qty}</span>
          <button onClick={() => setQty(qty + 1)} className="w-10 h-12 bg-transparent border-none text-lg cursor-pointer text-navy">+</button>
        </div>
        <Button variant="primary" className={`flex-1 ${!selSize ? "opacity-40 cursor-not-allowed" : ""} ${added ? "!bg-gold" : ""}`} onClick={handleAdd} disabled={!selSize}>
          {added ? "✓ Ditambahkan!" : "Tambah ke Keranjang"}
        </Button>
      </div>
      <Button variant="outline" fullWidth className="mb-5">♡ Simpan ke Wishlist</Button>
      <div className="text-xs text-site-gray leading-[2] border-t border-site-border pt-4">
        <div>✓ Stok tersedia · Pengiriman 1–3 hari kerja</div>
        <div>✓ Free ongkir min. Rp 200.000</div>
        <div>✓ Retur mudah dalam 14 hari</div>
      </div>
    </div>
  );
}
