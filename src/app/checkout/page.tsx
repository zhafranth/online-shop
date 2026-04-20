"use client";
import { useState } from "react";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";
import { Toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { AddressSection } from "@/components/checkout/address-section";
import { ShippingSection } from "@/components/checkout/shipping-section";
import { PaymentSection } from "@/components/checkout/payment-section";
import { OrderSummary } from "@/components/checkout/order-summary";
import { OrderSuccess } from "@/components/checkout/order-success";

export default function CheckoutPage() {
  const { items, subtotal: getSubtotal } = useCartStore();
  const [open, setOpen] = useState("address");
  const [done, setDone] = useState({ address: false, shipping: false, payment: false });
  const [form, setForm] = useState({ nama: "", telp: "", alamat: "", provinsi: "", kota: "", kodepos: "" });
  const [shipping, setShipping] = useState("jne");
  const [payment, setPayment] = useState("transfer");
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);

  const sub = getSubtotal();
  const shippingPrices: Record<string, number> = { jne: 15000, jnt: 12000, sicepat: 9000, gosend: 35000 };
  const ongkir = shippingPrices[shipping] || 15000;
  const isFreeShipping = sub >= 200000;
  const total = sub + (isFreeShipping ? 0 : ongkir);

  const toggle = (section: string) => setOpen(open === section ? "" : section);
  const handlePlace = () => { setPlacing(true); setTimeout(() => { setPlacing(false); setPlaced(true); }, 1800); };

  if (placed) return (
    <div className="min-h-screen pt-[72px] animate-fade-up"><Navbar /><OrderSuccess /></div>
  );

  return (
    <div className="min-h-screen pt-[72px] animate-fade-up">
      <Navbar />
      <div className="bg-cream py-5 md:py-6 border-b border-site-border">
        <div className="container-site">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h1 className="font-serif font-normal text-2xl md:text-[28px]">Checkout</h1>
            <div className="text-xs text-site-gray flex items-center gap-1.5"><span>🔒</span> <span className="hidden sm:inline">Pembayaran Aman & Terenkripsi</span><span className="sm:hidden">Aman & Terenkripsi</span></div>
          </div>
        </div>
      </div>
      <div className="container-site py-6 md:py-10 pb-12 md:pb-[60px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-12">
          <div>
            <AddressSection isOpen={open === "address"} isDone={done.address} form={form} onToggle={() => toggle("address")} onUpdate={(k, v) => setForm((f) => ({ ...f, [k]: v }))} onSave={() => { setDone((d) => ({ ...d, address: true })); setOpen("shipping"); }} />
            <ShippingSection isOpen={open === "shipping"} isDone={done.shipping} selected={shipping} isFreeShipping={isFreeShipping} onToggle={() => toggle("shipping")} onSelect={setShipping} onSave={() => { setDone((d) => ({ ...d, shipping: true })); setOpen("payment"); }} />
            <PaymentSection isOpen={open === "payment"} isDone={done.payment} selected={payment} onToggle={() => toggle("payment")} onSelect={setPayment} onSave={() => setDone((d) => ({ ...d, payment: true }))} />
            <Button variant="gold" fullWidth className={`py-4 text-[15px] mt-2 ${!(done.address && done.shipping) ? "opacity-50 cursor-not-allowed" : ""}`} onClick={done.address && done.shipping ? handlePlace : undefined} disabled={!(done.address && done.shipping)}>
              {placing ? "⏳ Memproses..." : `🔒 Bayar Sekarang — ${formatPrice(total)}`}
            </Button>
          </div>
          <div className="order-first lg:order-none">
            <OrderSummary items={items} subtotal={sub} ongkir={ongkir} isFreeShipping={isFreeShipping} total={total} />
          </div>
        </div>
      </div>
      <Toast />
    </div>
  );
}
