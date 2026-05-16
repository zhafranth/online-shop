"use client";

import Link from "next/link";
import { useShallow } from "zustand/react/shallow";
import { useMagazineStore } from "@/stores/magazine-store";
import { useHomeContentStore } from "@/stores/home-content-store";
import { ArticleCard } from "@/components/magazine/article-card";

export function LatestMagazine() {
  const enabled = useHomeContentStore(
    (s) => s.content.visibility.showLatestMagazine,
  );
  const latest = useMagazineStore(useShallow((s) => s.articles.slice(0, 5)));
  if (!enabled || latest.length === 0) return null;
  return (
    <section className="py-14 md:py-20 bg-cream border-t border-site-border">
      <div className="container-site">
        <div className="flex justify-between items-end mb-10 md:mb-14 gap-4">
          <div>
            <div className="text-[11px] tracking-[0.18em] uppercase text-site-gray mb-2">
              Fashiontaiment
            </div>
            <h2 className="font-serif font-normal">Latest Update</h2>
          </div>
          <Link
            href="/magazine"
            className="text-[12px] tracking-[0.14em] uppercase text-site-text underline underline-offset-4 shrink-0"
          >
            Semua Artikel →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-10">
          {latest.map((article) => (
            <ArticleCard key={article.slug} article={article} compact />
          ))}
        </div>
      </div>
    </section>
  );
}
