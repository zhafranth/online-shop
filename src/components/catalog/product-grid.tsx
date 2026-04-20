import Link from "next/link";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
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
      {products.map((p) => (
        <Link key={p.id} href={`/product/${p.id}`} className="group cursor-pointer block no-underline text-site-text">
          <div className="overflow-hidden relative">
            <PlaceholderImage label={p.label} className="w-full h-[220px] sm:h-[240px] md:h-[260px] transition-transform duration-400 group-hover:scale-[1.04]" />
            <div className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">♡</div>
            {p.badge && (
              <Badge variant={p.badge === "SALE" ? "default" : "navy"} className={`absolute top-2.5 left-2.5 ${p.badge === "SALE" ? "border-gold text-gold bg-white" : ""}`}>{p.badge}</Badge>
            )}
          </div>
          <div className="pt-3">
            <div className="text-[11px] text-site-gray mb-0.5">{p.category}</div>
            <div className="font-serif text-base font-medium mb-1">{p.name}</div>
            <div className="text-[13px] text-site-gray">
              <span className="text-navy font-semibold text-sm">{formatPrice(p.price)}</span>
              {p.originalPrice && <span className="line-through ml-1.5 text-xs">{formatPrice(p.originalPrice)}</span>}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
