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
      <div className="bg-cream py-6 border-b border-site-border">
        <div className="container-site">
          <div className="flex items-center justify-between">
            <h1 className="font-serif font-normal text-[28px]">Checkout</h1>
            <div className="text-xs text-site-gray flex items-center gap-1.5"><span>🔒</span> Pembayaran Aman & Terenkripsi</div>
          </div>
        </div>
      </div>
      <div className="container-site py-10 pb-[60px]">
        <div className="grid grid-cols-[1fr_360px] gap-12">
          <div>
            <AddressSection isOpen={open === "address"} isDone={done.address} form={form} onToggle={() => toggle("address")} onUpdate={(k, v) => setForm((f) => ({ ...f, [k]: v }))} onSave={() => { setDone((d) => ({ ...d, address: true })); setOpen("shipping"); }} />
            <ShippingSection isOpen={open === "shipping"} isDone={done.shipping} selected={shipping} isFreeShipping={isFreeShipping} onToggle={() => toggle("shipping")} onSelect={setShipping} onSave={() => { setDone((d) => ({ ...d, shipping: true })); setOpen("payment"); }} />
            <PaymentSection isOpen={open === "payment"} isDone={done.payment} selected={payment} onToggle={() => toggle("payment")} onSelect={setPayment} onSave={() => setDone((d) => ({ ...d, payment: true }))} />
            <Button variant="gold" fullWidth className={`py-4 text-[15px] mt-2 ${!(done.address && done.shipping) ? "opacity-50 cursor-not-allowed" : ""}`} onClick={done.address && done.shipping ? handlePlace : undefined} disabled={!(done.address && done.shipping)}>
              {placing ? "⏳ Memproses..." : `🔒 Bayar Sekarang — ${formatPrice(total)}`}
            </Button>
          </div>
          <OrderSummary items={items} subtotal={sub} ongkir={ongkir} isFreeShipping={isFreeShipping} total={total} />
        </div>
      </div>
      <Toast />
    </div>
  );
}
