"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { Badge } from "@/components/ui/badge";
import { useHomeContentStore } from "@/stores/home-content-store";
import { useProductStore } from "@/stores/product-store";

export function EditorsPicks() {
  const config = useHomeContentStore((s) => s.content.editorsPicks);
  const enabled = useHomeContentStore(
    (s) => s.content.visibility.showEditorsPicks,
  );
  const products = useProductStore((s) => s.products);

  if (!enabled) return null;

  const hero =
    config.heroProductId !== null
      ? products.find((p) => p.id === config.heroProductId)
      : undefined;
  const small1 =
    config.smallProductIds[0] !== null
      ? products.find((p) => p.id === config.smallProductIds[0])
      : undefined;
  const small2 =
    config.smallProductIds[1] !== null
      ? products.find((p) => p.id === config.smallProductIds[1])
      : undefined;

  // Hide section entirely if no slots filled
  if (!hero && !small1 && !small2) return null;

  return (
    <section className="py-14 md:py-20 bg-site-white">
      <div className="container-site">
        <div className="flex justify-between items-end mb-8 md:mb-10 gap-4">
          <div>
            <div className="text-[11px] tracking-[0.18em] uppercase text-site-gray mb-2">
              Pilihan Editor
            </div>
            <h2 className="font-serif font-normal">Koleksi Terkurasi</h2>
          </div>
          <Link
            href="/catalog"
            className="text-[12px] tracking-[0.14em] uppercase text-site-text underline underline-offset-4 shrink-0"
          >
            Lihat Semua →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-4 md:h-[560px]">
          {hero ? (
            <Link
              href={`/product/${hero.id}`}
              className="relative group cursor-pointer block"
            >
              <PlaceholderImage
                src={hero.image}
                alt={hero.name}
                label={hero.label}
                sizes="(max-width: 768px) 100vw, 60vw"
                className="w-full h-[380px] md:h-full transition-transform duration-400 group-hover:scale-[1.04]"
              />
              <div className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                ♡
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent px-5 md:px-6 pb-4 md:pb-5 pt-10">
                {hero.badge && (
                  <Badge className="mb-2 border-white text-white bg-transparent">
                    {hero.badge}
                  </Badge>
                )}
                <div className="font-serif text-xl md:text-[22px] text-white mb-1">
                  {hero.name}
                </div>
                <div className="text-[13px] text-white/80">
                  {formatPrice(hero.price)}
                </div>
              </div>
            </Link>
          ) : (
            <div className="bg-cream border border-dashed border-site-border h-[380px] md:h-full" />
          )}

          <div className="grid grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-4">
            {[small1, small2].map((p, i) =>
              p ? (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="relative group cursor-pointer block"
                >
                  <PlaceholderImage
                    src={p.image}
                    alt={p.name}
                    label={p.label}
                    sizes="(max-width: 768px) 50vw, 35vw"
                    className="w-full h-[240px] md:h-full transition-transform duration-400 group-hover:scale-[1.04]"
                  />
                  <div className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    ♡
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent px-4 pb-3.5 pt-6">
                    <div className="font-serif text-base text-white">
                      {p.name}
                    </div>
                    <div className="text-xs text-white/80">
                      {formatPrice(p.price)}
                    </div>
                  </div>
                </Link>
              ) : (
                <div
                  key={`empty-${i}`}
                  className="bg-cream border border-dashed border-site-border h-[240px] md:h-full"
                />
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
