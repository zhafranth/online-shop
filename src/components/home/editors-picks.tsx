import Link from "next/link";
import { PRODUCTS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { Badge } from "@/components/ui/badge";

export function EditorsPicks() {
  const featured = [PRODUCTS[1], PRODUCTS[2], PRODUCTS[3]];
  return (
    <section className="py-20 bg-site-white">
      <div className="container-site">
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="text-[11px] tracking-[0.16em] uppercase text-gold mb-2">Pilihan Editor</div>
            <h2 className="font-serif font-normal">Koleksi Terkurasi</h2>
          </div>
          <Link href="/catalog" className="text-[13px] tracking-[0.08em] uppercase text-navy underline underline-offset-4">Lihat Semua →</Link>
        </div>
        <div className="grid grid-cols-[1.5fr_1fr] gap-4 h-[560px]">
          <Link href={`/product/${featured[0].id}`} className="relative group cursor-pointer block">
            <PlaceholderImage label={`${featured[0].label}\nfeatured large`} className="w-full h-full transition-transform duration-400 group-hover:scale-[1.04]" />
            <div className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity">♡</div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgba(13,21,38,0.85)] to-transparent px-6 pb-5 pt-10">
              {featured[0].badge && <Badge className="mb-2 border-gold text-gold">{featured[0].badge}</Badge>}
              <div className="font-serif text-[22px] text-white mb-1">{featured[0].name}</div>
              <div className="text-[13px] text-gold-light">{formatPrice(featured[0].price)}</div>
            </div>
          </Link>
          <div className="grid grid-rows-2 gap-4">
            {[featured[1], featured[2]].map((p) => (
              <Link key={p.id} href={`/product/${p.id}`} className="relative group cursor-pointer block">
                <PlaceholderImage label={p.label} className="w-full h-full transition-transform duration-400 group-hover:scale-[1.04]" />
                <div className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity">♡</div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgba(13,21,38,0.8)] to-transparent px-4 pb-3.5 pt-6">
                  <div className="font-serif text-base text-white">{p.name}</div>
                  <div className="text-xs text-gold-light">{formatPrice(p.price)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
