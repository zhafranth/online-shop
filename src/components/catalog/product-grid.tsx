import Link from "next/link";
import { Product } from "@/types";
import { categoryLabelFallback, colorHex, discountPercent, formatPrice } from "@/lib/utils";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { Badge } from "@/components/ui/badge";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-site-gray">
        <div className="font-serif text-2xl mb-2">Produk tidak ditemukan</div>
        <div className="text-[13px]">Coba ubah filter kamu</div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-7">
      {products.map((p) => {
        const disc = discountPercent(p.price, p.originalPrice);
        return (
          <Link key={p.id} href={`/product/${p.id}`} className="group cursor-pointer block no-underline text-site-text">
            <div className="overflow-hidden relative">
              <PlaceholderImage src={p.image} alt={p.name} label={p.label} sizes="(max-width: 768px) 50vw, 33vw" className="w-full aspect-[2/3] transition-transform duration-400 group-hover:scale-[1.04]" />
              <div className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">♡</div>
              <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                {p.badge && (
                  <Badge variant={p.badge === "SALE" ? "default" : "navy"} className={p.badge === "SALE" ? "border-gold text-gold bg-white" : ""}>{p.badge}</Badge>
                )}
                {disc > 0 && <Badge>-{disc}%</Badge>}
              </div>
            </div>
            <div className="pt-3">
              <div className="text-[11px] text-site-gray mb-0.5">{categoryLabelFallback(p.category)}</div>
              <div className="font-serif text-base font-medium mb-1">{p.name}</div>
              <div className="text-[13px] text-site-gray">
                <span className="text-navy font-semibold text-sm">{formatPrice(p.price)}</span>
                {p.originalPrice && <span className="line-through ml-1.5 text-xs">{formatPrice(p.originalPrice)}</span>}
              </div>
              {p.colors.length > 0 && (
                <div className="flex gap-1.5 mt-2 items-center">
                  {p.colors.slice(0, 5).map((c) => (
                    <span
                      key={c}
                      title={c}
                      className="w-3 h-3 rounded-full border border-site-border shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.06)]"
                      style={{ background: colorHex(c) }}
                    />
                  ))}
                  {p.colors.length > 5 && (
                    <span className="text-[10px] text-site-gray ml-0.5">+{p.colors.length - 5}</span>
                  )}
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
