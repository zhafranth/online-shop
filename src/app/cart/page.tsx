"use client";
import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/stores/cart-store";
import { PRODUCTS } from "@/lib/constants";
import { Navbar } from "@/components/layout/navbar";
import { Toast } from "@/components/ui/toast";
import { StepBar } from "@/components/ui/step-bar";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/components/cart/cart-item";
import { VoucherInput } from "@/components/cart/voucher-input";
import { CartRecommendations } from "@/components/cart/cart-recommendations";
import { CartStickyBar } from "@/components/cart/cart-sticky-bar";

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal: getSubtotal, totalItems } = useCartStore();
  const [discount, setDiscount] = useState(0);
  const sub = getSubtotal();
  const ongkir = sub >= 200000 ? 0 : 15000;
  const total = sub + ongkir - discount;
  const related = PRODUCTS.filter((p) => !items.find((c) => c.id === p.id)).slice(0, 3);

  const steps = [
    { label: "Keranjang", status: "active" as const },
    { label: "Pengiriman", status: "pending" as const },
    { label: "Pembayaran", status: "pending" as const },
    { label: "Selesai", status: "pending" as const },
  ];

  return (
    <div className="min-h-screen pt-[72px] animate-fade-up">
      <Navbar />
      <div className="bg-cream py-5 md:py-6 border-b border-site-border">
        <div className="container-site">
          <h1 className="font-serif font-normal text-2xl md:text-[28px]">Keranjang Belanja {items.length > 0 && `(${items.length})`}</h1>
        </div>
      </div>
      <div className="bg-white border-b border-site-border py-4 overflow-x-auto">
        <div className="container-site"><div className="max-w-[500px] min-w-[360px]"><StepBar steps={steps} /></div></div>
      </div>
      <div className="container-site py-6 md:py-10 pb-[140px] md:pb-[120px]">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="font-serif text-[28px] mb-3">Keranjang kosong</div>
            <p className="text-site-gray mb-7">Yuk, mulai belanja dan temukan koleksi favoritmu!</p>
            <Link href="/catalog"><Button variant="primary">Mulai Belanja</Button></Link>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              {items.map((item, idx) => (
                <CartItem key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} item={item} index={idx} onUpdateQty={updateQty} onRemove={removeItem} />
              ))}
            </div>
            <VoucherInput subtotal={sub} onApplyDiscount={setDiscount} />
            <CartRecommendations products={related} />
          </div>
        )}
      </div>
      {items.length > 0 && <CartStickyBar totalItems={totalItems()} ongkir={ongkir} total={total} discount={discount} />}
      <Toast />
    </div>
  );
}
