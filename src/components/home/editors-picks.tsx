import Link from "next/link";
import { PRODUCTS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { Badge } from "@/components/ui/badge";

export function EditorsPicks() {
  const featured = [PRODUCTS[1], PRODUCTS[2], PRODUCTS[3]];
  return (
    <section className="py-14 md:py-20 bg-site-white">
      <div className="container-site">
        <div className="flex justify-between items-end mb-8 md:mb-10 gap-4">
          <div>
            <div className="text-[11px] tracking-[0.18em] uppercase text-site-gray mb-2">Pilihan Editor</div>
            <h2 className="font-serif font-normal">Koleksi Terkurasi</h2>
          </div>
          <Link href="/catalog" className="text-[12px] tracking-[0.14em] uppercase text-site-text underline underline-offset-4 shrink-0">Lihat Semua →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-4 md:h-[560px]">
          <Link href={`/product/${featured[0].id}`} className="relative group cursor-pointer block">
            <PlaceholderImage src={featured[0].image} alt={featured[0].name} label={featured[0].label} sizes="(max-width: 768px) 100vw, 60vw" className="w-full h-[380px] md:h-full transition-transform duration-400 group-hover:scale-[1.04]" />
            <div className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity">♡</div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent px-5 md:px-6 pb-4 md:pb-5 pt-10">
              {featured[0].badge && <Badge className="mb-2 border-white text-white bg-transparent">{featured[0].badge}</Badge>}
              <div className="font-serif text-xl md:text-[22px] text-white mb-1">{featured[0].name}</div>
              <div className="text-[13px] text-white/80">{formatPrice(featured[0].price)}</div>
            </div>
          </Link>
          <div className="grid grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-4">
            {[featured[1], featured[2]].map((p) => (
              <Link key={p.id} href={`/product/${p.id}`} className="relative group cursor-pointer block">
                <PlaceholderImage src={p.image} alt={p.name} label={p.label} sizes="(max-width: 768px) 50vw, 35vw" className="w-full h-[240px] md:h-full transition-transform duration-400 group-hover:scale-[1.04]" />
                <div className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity">♡</div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent px-4 pb-3.5 pt-6">
                  <div className="font-serif text-base text-white">{p.name}</div>
                  <div className="text-xs text-white/80">{formatPrice(p.price)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
