"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { paymentService } from "@/services/raja-ongkir";
import { useCartStore } from "@/stores/cart-store";
import { useShippingStore } from "@/stores/shipping-store";
import { useOrderStore } from "@/stores/order-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Order } from "@/types/admin";

interface PaymentReviewProps {
  onBack: () => void;
}

export function PaymentReview({ onBack }: PaymentReviewProps) {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const address = useShippingStore((s) => s.address);
  const option = useShippingStore((s) => s.selectedOption);
  const createOrder = useOrderStore((s) => s.create);

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!address || !option) {
    return (
      <div className="p-5 bg-cream border-[1.5px] border-site-border text-sm text-site-gray">
        Lengkapi alamat & pilih kurir terlebih dahulu.
      </div>
    );
  }

  const total = subtotal + option.cost;

  const handlePay = async () => {
    setProcessing(true);
    setError(null);
    try {
      const orderItems: Order["items"] = items.map((it) => ({
        productId: it.id,
        productName: it.name,
        price: it.price,
        qty: it.qty,
        size: it.selectedSize,
        color: it.selectedColor,
      }));

      const shippingAddressString = [
        address.fullAddress,
        `${address.districtName}, ${address.cityName}`,
        `${address.provinceName} ${address.zipCode}`,
      ].join(", ");

      const order = createOrder({
        userId: 0,
        userName: address.recipientName,
        userEmail: "guest@thickapparel.com",
        items: orderItems,
        subtotal,
        shipping: option.cost,
        total,
        paymentMethod: "qris",
        shippingAddress: shippingAddressString,
        shippingDetails: {
          courierCode: option.code,
          courierName: option.name,
          service: option.service,
          etd: option.etd,
          cost: option.cost,
          address,
        },
      });

      const res = await paymentService.createQris({
        amount: total,
        referenceId: order.id,
        customerName: address.recipientName,
        customerPhone: address.phone,
      });

      useOrderStore.setState((state) => ({
        orders: state.orders.map((o) =>
          o.id === order.id ? { ...o, paymentId: res.data.payment_id } : o,
        ),
      }));

      router.push(`/checkout/pay/${res.data.payment_id}`);
    } catch {
      setError("Gagal memproses pembayaran. Coba lagi.");
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white border-[1.5px] border-site-border">
      <div className="px-5 py-4 bg-navy text-white">
        <h3 className="font-semibold text-sm tracking-[0.06em]">
          3 · Review & Bayar
        </h3>
      </div>
      <div className="p-4 sm:p-5 space-y-5">
        <section>
          <h4 className="text-[11px] font-semibold tracking-[0.12em] uppercase text-site-gray mb-2.5">
            Ringkasan Pesanan
          </h4>
          <div className="space-y-2 text-sm">
            {items.map((it) => (
              <div
                key={`${it.id}-${it.selectedSize}-${it.selectedColor}`}
                className="flex justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-site-text truncate">
                    {it.name} × {it.qty}
                  </div>
                  <div className="text-xs text-site-gray">
                    {it.selectedSize} · {it.selectedColor}
                  </div>
                </div>
                <div className="text-site-text font-medium">
                  {formatPrice(it.price * it.qty)}
                </div>
              </div>
            ))}
          </div>
          <hr className="border-t border-site-border my-3" />
          <div className="flex justify-between text-sm text-site-gray-dark">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-site-gray-dark mt-1">
            <span>
              Ongkir ({option.name} {option.service})
            </span>
            <span>{formatPrice(option.cost)}</span>
          </div>
          <hr className="border-t border-site-border my-3" />
          <div className="flex justify-between font-serif text-xl font-semibold">
            <span>Total</span>
            <span className="text-navy">{formatPrice(total)}</span>
          </div>
        </section>

        <section>
          <h4 className="text-[11px] font-semibold tracking-[0.12em] uppercase text-site-gray mb-2.5">
            Kirim Ke
          </h4>
          <div className="text-sm text-site-gray-dark leading-relaxed bg-cream p-3 border border-site-border">
            <div className="font-semibold text-site-text">
              {address.recipientName}{" "}
              <span className="text-site-gray font-normal">
                ({address.phone})
              </span>
            </div>
            <div>{address.fullAddress}</div>
            <div>
              {address.districtName}, {address.cityName}, {address.provinceName}{" "}
              {address.zipCode}
            </div>
          </div>
        </section>

        <section>
          <h4 className="text-[11px] font-semibold tracking-[0.12em] uppercase text-site-gray mb-2.5">
            Metode Pembayaran
          </h4>
          <label className="flex items-center gap-3 p-3 border-[1.5px] border-navy bg-cream cursor-pointer">
            <input type="radio" checked readOnly className="accent-[#0a0a0a]" />
            <div className="flex-1">
              <div className="font-semibold text-sm">QRIS</div>
              <div className="text-xs text-site-gray">
                Scan via DANA · OVO · GoPay · ShopeePay · BCA Mobile
              </div>
            </div>
          </label>
          <p className="text-[11px] text-site-gray mt-2">
            Metode lain (Virtual Account, COD) segera hadir.
          </p>
        </section>

        {error && (
          <div className="px-3.5 py-2.5 text-[13px] bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]">
            {error}
          </div>
        )}

        <div className="flex justify-between pt-2">
          <Button variant="outline" onClick={onBack} disabled={processing}>
            ← Ganti Kurir
          </Button>
          <Button onClick={handlePay} disabled={processing}>
            {processing ? "Memproses…" : `Bayar Sekarang — ${formatPrice(total)}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
