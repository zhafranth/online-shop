"use client";
import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toast } from "@/components/ui/toast";
import { ArticleCard } from "@/components/magazine/article-card";
import { ArticleFeatured } from "@/components/magazine/article-featured";
import { CategoryChips } from "@/components/magazine/category-chips";
import { Button } from "@/components/ui/button";
import { useMagazineStore } from "@/stores/magazine-store";
import {
  MagazineCategorySlug,
  SLUG_TO_CATEGORY,
} from "@/types/magazine";

const PAGE_SIZE = 6;

function MagazineContent() {
  const articles = useMagazineStore((s) => s.articles);
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const initialCategory: MagazineCategorySlug | "all" =
    categoryParam && categoryParam in SLUG_TO_CATEGORY
      ? (categoryParam as MagazineCategorySlug)
      : "all";

  const [active, setActive] = useState<MagazineCategorySlug | "all">(initialCategory);
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    setActive(initialCategory);
    setVisible(PAGE_SIZE);
  }, [initialCategory]);

  const filtered = useMemo(() => {
    if (active === "all") return articles;
    const category = SLUG_TO_CATEGORY[active];
    return articles.filter((article) => article.category === category);
  }, [articles, active]);

  const featured = filtered.find((article) => article.featured) ?? filtered[0];
  const rest = filtered.filter((article) => article.slug !== featured?.slug);
  const shown = rest.slice(0, visible);
  const hasMore = visible < rest.length;

  const handleChange = (value: MagazineCategorySlug | "all") => {
    setActive(value);
    setVisible(PAGE_SIZE);
  };

  return (
    <div className="min-h-screen pt-[72px] animate-fade-up">
      <Navbar />

      {/* Hero / intro */}
      <header className="bg-cream border-b border-site-border">
        <div className="container-site py-16 md:py-24">
          <div className="flex flex-col items-center text-center">
            <div className="text-[10px] tracking-[0.32em] uppercase text-site-gray font-medium mb-6">
              <span className="inline-block w-8 h-px bg-site-text align-middle mr-3" />
              Fashiontaiment
              <span className="inline-block w-8 h-px bg-site-text align-middle ml-3" />
            </div>
            <h1 className="font-serif text-[clamp(2.5rem,7vw,5rem)] leading-[1.02] tracking-tight mb-5">
              Magazine
            </h1>
            <p className="max-w-[520px] text-[15px] md:text-[16px] leading-[1.75] text-site-gray-dark/70">
              Cerita, gaya, dan wawasan dari dunia fesyen Indonesia.
              Kami merangkum yang patut Anda perhatikan minggu ini.
            </p>
          </div>
        </div>
      </header>

      {/* Filter chips */}
      <div className="border-b border-site-border bg-white sticky top-[72px] z-30">
        <div className="container-site py-5 overflow-x-auto">
          <CategoryChips active={active} onChange={handleChange} />
        </div>
      </div>

      {/* Featured */}
      {featured && (
        <section className="container-site py-14 md:py-20">
          <ArticleFeatured article={featured} />
        </section>
      )}

      {/* Grid */}
      <section className="container-site pb-20 md:pb-28">
        <div className="flex items-end justify-between mb-10 md:mb-14 border-b border-site-border pb-5">
          <h2 className="font-serif text-[28px] md:text-[34px] leading-tight">
            Cerita Lainnya
          </h2>
          <div className="text-[11px] tracking-[0.16em] uppercase text-site-gray">
            {rest.length} artikel
          </div>
        </div>

        {shown.length === 0 ? (
          <div className="py-20 text-center text-site-gray">
            Belum ada artikel di kategori ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14 md:gap-y-16">
            {shown.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center mt-14">
            <Button
              variant="outline"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
            >
              Muat Lebih Banyak
            </Button>
          </div>
        )}
      </section>

      <Footer />
      <Toast />
    </div>
  );
}

export default function MagazinePage() {
  return (
    <Suspense>
      <MagazineContent />
    </Suspense>
  );
}
