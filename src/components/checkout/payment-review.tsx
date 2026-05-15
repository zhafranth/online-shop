"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check } from "lucide-react";
import { paymentService } from "@/services/raja-ongkir";
import { useCartStore } from "@/stores/cart-store";
import { useShippingStore } from "@/stores/shipping-store";
import { useOrderStore } from "@/stores/order-store";
import { useAdminPaymentStore } from "@/stores/admin-payment-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Order } from "@/types/admin";
import type { PaymentMethod } from "@/types/payment-admin";

interface PaymentReviewProps {
  onBack: () => void;
}

function isUrl(s: string) {
  return /^https?:\/\//i.test(s);
}

export function PaymentReview({ onBack }: PaymentReviewProps) {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const address = useShippingStore((s) => s.address);
  const option = useShippingStore((s) => s.selectedOption);
  const createOrder = useOrderStore((s) => s.create);
  const methods = useAdminPaymentStore((s) => s.methods);

  const enabledMethods = useMemo(
    () => [...methods].filter((m) => m.enabled).sort((a, b) => a.order - b.order),
    [methods],
  );

  const [selectedId, setSelectedId] = useState<string>(
    () => enabledMethods[0]?.id ?? "",
  );
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const selected: PaymentMethod | undefined = enabledMethods.find(
    (m) => m.id === selectedId,
  );

  if (!address || !option) {
    return (
      <div className="p-5 bg-cream border-[1.5px] border-site-border text-sm text-site-gray">
        Lengkapi alamat & pilih kurir terlebih dahulu.
      </div>
    );
  }

  if (enabledMethods.length === 0) {
    return (
      <div className="p-5 bg-[#fef2f2] border-[1.5px] border-[#fecaca] text-sm text-[#991b1b]">
        Belum ada metode pembayaran aktif. Hubungi admin untuk mengaktifkan
        setidaknya satu metode pembayaran.
      </div>
    );
  }

  const total = subtotal + option.cost;

  const buildOrderItems = (): Order["items"] =>
    items.map((it) => ({
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

  const createBaseOrder = (paymentMethodId: string) =>
    createOrder({
      userId: 0,
      userName: address.recipientName,
      userEmail: "guest@thickapparel.com",
      items: buildOrderItems(),
      subtotal,
      shipping: option.cost,
      total,
      paymentMethod: paymentMethodId,
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

  const handleQrisFlow = async () => {
    if (!selected) return;
    setProcessing(true);
    setError(null);
    try {
      const order = createBaseOrder(selected.id);
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

  const handleSimpleFlow = () => {
    if (!selected) return;
    setProcessing(true);
    const order = createBaseOrder(selected.id);
    useCartStore.getState().clearCart();
    router.push(`/orders/${order.id}/success`);
  };

  const handlePay = async () => {
    if (!selected) {
      setError("Pilih metode pembayaran terlebih dahulu.");
      return;
    }
    if (selected.type === "ewallet") return handleQrisFlow();
    return handleSimpleFlow();
  };

  const handleCopy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedAccount(key);
      setTimeout(() => setCopiedAccount(null), 1600);
    } catch {
      // ignore
    }
  };

  const ctaLabel = () => {
    if (processing) return "Memproses…";
    if (!selected) return "Pilih Metode";
    if (selected.type === "ewallet") return `Bayar via QRIS — ${formatPrice(total)}`;
    if (selected.type === "transfer") return `Saya Akan Transfer — ${formatPrice(total)}`;
    if (selected.type === "cod") return `Pesan dengan COD — ${formatPrice(total)}`;
    return `Bayar Sekarang — ${formatPrice(total)}`;
  };

  return (
    <div className="bg-white border-[1.5px] border-site-border">
      <div className="px-5 py-4 bg-navy text-white">
        <h3 className="font-semibold text-sm tracking-[0.06em]">
          3 · Review & Bayar
        </h3>
      </div>
      <div className="p-4 sm:p-5 space-y-5">
        {/* SUMMARY */}
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

        {/* SHIPPING TO */}
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

        {/* METHOD SELECTOR */}
        <section>
          <h4 className="text-[11px] font-semibold tracking-[0.12em] uppercase text-site-gray mb-2.5">
            Metode Pembayaran
          </h4>
          <div className="space-y-2">
            {enabledMethods.map((m) => {
              const isSelected = m.id === selectedId;
              return (
                <label
                  key={m.id}
                  className={`flex items-center gap-3 p-3 border-[1.5px] cursor-pointer transition-colors ${
                    isSelected
                      ? "border-navy bg-cream"
                      : "border-site-border hover:border-site-gray"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment-method"
                    checked={isSelected}
                    onChange={() => setSelectedId(m.id)}
                    className="accent-[#0a0a0a]"
                  />
                  <div className="shrink-0 w-10 h-10 bg-white border border-site-border flex items-center justify-center overflow-hidden relative">
                    {isUrl(m.icon) ? (
                      <Image
                        src={m.icon}
                        alt={m.label}
                        fill
                        sizes="40px"
                        className="object-contain p-1"
                        unoptimized
                      />
                    ) : (
                      <span className="text-[20px] leading-none">{m.icon}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-site-text truncate">
                      {m.label}
                    </div>
                    <div className="text-xs text-site-gray truncate">
                      {m.description}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>

          {/* TRANSFER ACCOUNTS */}
          {selected?.type === "transfer" && selected.bankAccounts && selected.bankAccounts.length > 0 && (
            <div className="mt-3 bg-white border border-site-border">
              <div className="px-4 py-2.5 bg-cream border-b border-site-border flex items-center justify-between text-[10px] tracking-[0.18em] uppercase text-site-gray">
                <span>Transfer ke salah satu rekening</span>
                <span className="font-mono normal-case tracking-tight tabular-nums">
                  {String(selected.bankAccounts.length).padStart(2, "0")}
                </span>
              </div>
              <ul className="divide-y divide-site-border">
                {selected.bankAccounts.map((a, i) => {
                  const key = `${selected.id}-${i}`;
                  return (
                    <li key={key} className="px-4 py-3">
                      <div className="flex items-center justify-between gap-3 mb-0.5">
                        <span className="font-serif text-[16px] text-navy">
                          {a.bankName}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(key, a.accountNo)}
                          className="inline-flex items-center gap-1 text-[10.5px] tracking-[0.14em] uppercase text-site-gray hover:text-navy"
                        >
                          {copiedAccount === key ? (
                            <>
                              <Check size={11} strokeWidth={2.2} />
                              Disalin
                            </>
                          ) : (
                            <>
                              <Copy size={11} strokeWidth={2} />
                              Salin
                            </>
                          )}
                        </button>
                      </div>
                      <div className="font-mono text-[14px] tracking-tight text-site-text tabular-nums">
                        {a.accountNo}
                      </div>
                      <div className="text-[11.5px] text-site-gray mt-0.5">
                        a/n {a.accountHolder}
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="px-4 py-2.5 bg-cream border-t border-site-border text-[11px] text-site-gray-dark leading-relaxed">
                Transfer{" "}
                <strong className="text-navy">{formatPrice(total)}</strong>{" "}
                ke salah satu rekening di atas, lalu klik tombol konfirmasi di
                bawah.
              </div>
            </div>
          )}

          {selected?.type === "cod" && (
            <div className="mt-3 px-3.5 py-2.5 text-[12.5px] text-site-gray-dark bg-cream border border-site-border">
              Anda akan membayar tunai langsung ke kurir saat barang tiba.
              Pastikan nominal pas <strong className="text-navy">{formatPrice(total)}</strong>.
            </div>
          )}

          {selected?.type === "paylater" && (
            <div className="mt-3 px-3.5 py-2.5 text-[12.5px] text-site-gray-dark bg-cream border border-site-border">
              Anda akan diarahkan ke partner paylater untuk menyelesaikan
              cicilan setelah konfirmasi.
            </div>
          )}

          {selected?.type === "cc" && (
            <div className="mt-3 px-3.5 py-2.5 text-[12.5px] text-site-gray-dark bg-cream border border-site-border">
              Anda akan diarahkan ke halaman bank untuk menyelesaikan
              pembayaran kartu kredit/debit setelah konfirmasi.
            </div>
          )}
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
          <Button onClick={handlePay} disabled={processing || !selected}>
            {ctaLabel()}
          </Button>
        </div>
      </div>
    </div>
  );
}
