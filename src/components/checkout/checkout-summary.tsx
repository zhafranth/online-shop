"use client";

import { CartItem } from "@/types";
import type { ShippingAddress, ShippingOption } from "@/types/raja-ongkir";
import { formatPrice } from "@/lib/utils";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

interface CheckoutSummaryProps {
  items: CartItem[];
  subtotal: number;
  totalWeight: number;
  address: ShippingAddress | null;
  shippingOption: ShippingOption | null;
}

export function CheckoutSummary({
  items,
  subtotal,
  totalWeight,
  address,
  shippingOption,
}: CheckoutSummaryProps) {
  const ongkir = shippingOption?.cost ?? 0;
  const total = subtotal + ongkir;

  return (
    <div className="lg:sticky lg:top-[90px] self-start">
      <div className="border-[1.5px] border-site-border bg-white">
        <div className="px-4 sm:px-5 py-4 border-b border-site-border bg-navy text-white">
          <div className="font-semibold tracking-[0.06em] text-[13px]">
            RINGKASAN PESANAN
          </div>
        </div>
        <div className="p-4 sm:p-5">
          {items.slice(0, 3).map((item, i) => (
            <div key={i} className="flex gap-3 mb-3.5 items-center">
              <PlaceholderImage
                src={item.image}
                alt={item.name}
                label={item.label}
                sizes="50px"
                className="w-[50px] h-[60px] shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="font-serif text-[13px] mb-0.5 truncate">
                  {item.name}
                </div>
                <div className="text-[11px] text-site-gray">
                  {item.selectedSize} · {item.selectedColor} · ×{item.qty}
                </div>
              </div>
              <div className="text-[13px] font-semibold text-navy shrink-0">
                {formatPrice(item.price * item.qty)}
              </div>
            </div>
          ))}
          {items.length > 3 && (
            <div className="text-xs text-site-gray mb-3.5">
              +{items.length - 3} produk lainnya
            </div>
          )}
          <hr className="border-none border-t border-site-border my-5" />
          <div className="flex justify-between text-[13px] mb-2 text-site-gray-dark">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-[13px] mb-2 text-site-gray-dark">
            <span>Berat Total</span>
            <span>{(totalWeight / 1000).toFixed(2)} kg</span>
          </div>
          <div className="flex justify-between text-[13px] mb-2 text-site-gray-dark">
            <span>Ongkos Kirim</span>
            <span>
              {shippingOption
                ? `${shippingOption.code.toUpperCase()} · ${formatPrice(ongkir)}`
                : "—"}
            </span>
          </div>
          <hr className="border-none border-t border-site-border my-5" />
          <div className="flex justify-between font-serif text-xl font-semibold">
            <span>Total</span>
            <span className="text-navy">{formatPrice(total)}</span>
          </div>

          {address && (
            <div className="mt-5 pt-4 border-t border-site-border text-[12px] text-site-gray leading-relaxed">
              <div className="font-semibold text-site-text mb-1">
                Kirim ke {address.recipientName}
              </div>
              <div>{address.fullAddress}</div>
              <div>
                {address.districtName}, {address.cityName} {address.zipCode}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 bg-cream mt-3 text-xs text-site-gray leading-[2]">
        <div>🔒 Transaksi dienkripsi SSL</div>
        <div>↩ Retur gratis dalam 14 hari</div>
        <div>📦 Dikirim dari gudang Bandung</div>
      </div>
    </div>
  );
}
