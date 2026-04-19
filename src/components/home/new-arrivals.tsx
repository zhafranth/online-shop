import Link from "next/link";
import { PRODUCTS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function NewArrivals() {
  const newItems = PRODUCTS.filter((p) => p.badge === "NEW").slice(0, 4);
  return (
    <section className="py-20 bg-cream">
      <div className="container-site">
        <div className="text-center mb-12">
          <div className="text-[11px] tracking-[0.16em] uppercase text-gold mb-2">Terbaru</div>
          <h2 className="font-serif font-normal">New Arrivals</h2>
        </div>
        <div className="grid grid-cols-4 gap-6">
          {newItems.map((p) => (
            <Link key={p.id} href={`/product/${p.id}`} className="group cursor-pointer block no-underline text-site-text">
              <div className="overflow-hidden relative">
                <PlaceholderImage label={p.label} className="w-full h-[280px] transition-transform duration-400 group-hover:scale-[1.04]" />
                <div className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">♡</div>
                {p.badge && <Badge variant="navy" className="absolute top-2.5 left-2.5">{p.badge}</Badge>}
              </div>
              <div className="pt-3">
                <div className="font-serif text-base font-medium mb-1">{p.name}</div>
                <div className="text-[13px] text-site-gray">
                  <span className="text-navy font-semibold text-sm">{formatPrice(p.price)}</span>
                  {p.originalPrice && <span className="line-through ml-1.5 text-xs">{formatPrice(p.originalPrice)}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/catalog"><Button variant="primary">Lihat Semua Produk</Button></Link>
        </div>
      </div>
    </section>
  );
}
