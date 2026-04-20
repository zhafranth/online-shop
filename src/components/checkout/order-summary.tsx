import { CartItem } from "@/types";
import { formatPrice } from "@/lib/utils";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

interface OrderSummaryProps { items: CartItem[]; subtotal: number; ongkir: number; isFreeShipping: boolean; total: number; }

export function OrderSummary({ items, subtotal, ongkir, isFreeShipping, total }: OrderSummaryProps) {
  return (
    <div className="lg:sticky lg:top-[90px] self-start">
      <div className="border-[1.5px] border-site-border bg-white">
        <div className="px-4 sm:px-5 py-4 border-b border-site-border bg-navy text-white">
          <div className="font-semibold tracking-[0.06em] text-[13px]">RINGKASAN PESANAN</div>
        </div>
        <div className="p-4 sm:p-5">
          {items.slice(0, 3).map((item, i) => (
            <div key={i} className="flex gap-3 mb-3.5 items-center">
              <PlaceholderImage label={item.label} className="w-[50px] h-[60px] shrink-0" />
              <div className="flex-1">
                <div className="font-serif text-[13px] mb-0.5">{item.name}</div>
                <div className="text-[11px] text-site-gray">{item.selectedSize} · {item.selectedColor} · ×{item.qty}</div>
              </div>
              <div className="text-[13px] font-semibold text-navy">{formatPrice(item.price * item.qty)}</div>
            </div>
          ))}
          {items.length > 3 && <div className="text-xs text-site-gray mb-3.5">+{items.length - 3} produk lainnya</div>}
          <hr className="border-none border-t border-site-border my-5" />
          {[["Subtotal", formatPrice(subtotal)], ["Ongkos Kirim", isFreeShipping ? "FREE ✓" : formatPrice(ongkir)]].map(([label, value]) => (
            <div key={label} className={`flex justify-between text-[13px] mb-2 ${String(value).includes("FREE") ? "text-gold" : "text-site-gray-dark"}`}>
              <span>{label}</span><span>{value}</span>
            </div>
          ))}
          <hr className="border-none border-t border-site-border my-5" />
          <div className="flex justify-between font-serif text-xl font-semibold">
            <span>Total</span><span className="text-navy">{formatPrice(total)}</span>
          </div>
        </div>
      </div>
      <div className="p-4 bg-cream mt-3 text-xs text-site-gray leading-[2]">
        <div>🔒 Transaksi dienkripsi SSL</div>
        <div>↩ Retur gratis dalam 14 hari</div>
        <div>🚚 Gratis ongkir min. Rp 200.000</div>
      </div>
    </div>
  );
}
