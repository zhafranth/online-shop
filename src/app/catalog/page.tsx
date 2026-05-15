"use client";
import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SidebarFilter } from "@/components/catalog/sidebar-filter";
import { ProductGrid } from "@/components/catalog/product-grid";
import { ActiveFilters } from "@/components/catalog/active-filters";
import { Toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { useProductStore } from "@/stores/product-store";
import { useCategoryStore } from "@/stores/category-store";
import { categoryLabelFallback } from "@/lib/utils";

function CatalogContent() {
  const searchParams = useSearchParams();
  const products = useProductStore((s) => s.products);
  const categories = useCategoryStore((s) => s.categories);

  const initialCat = (searchParams.get("cat") || "semua").toLowerCase();
  const [activeCat, setActiveCat] = useState(initialCat);
  const [activeSizes, setActiveSizes] = useState<string[]>([]);
  const [activeColors, setActiveColors] = useState<string[]>([]);
  const [sort, setSort] = useState("Terbaru");
  const [maxPrice, setMaxPrice] = useState(650);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = filterOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [filterOpen]);

  const enabledCategoryIds = useMemo(
    () => new Set(categories.filter((c) => c.enabled).map((c) => c.id)),
    [categories],
  );

  const activeCatLabel = useMemo(() => {
    if (activeCat === "semua") return "Semua";
    const found = categories.find((c) => c.id === activeCat);
    return found?.label ?? categoryLabelFallback(activeCat);
  }, [activeCat, categories]);

  const toggleArr = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

  const filtered = products
    .filter((p) => {
      if (activeCat !== "semua" && p.category !== activeCat) return false;
      // Hide products from disabled categories when browsing "all".
      if (activeCat === "semua" && !enabledCategoryIds.has(p.category)) return false;
      if (activeSizes.length && !activeSizes.some((s) => p.sizes.includes(s))) return false;
      if (activeColors.length && !activeColors.some((c) => p.colors.includes(c))) return false;
      if (p.price > maxPrice * 1000) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "Harga ↑") return a.price - b.price;
      if (sort === "Harga ↓") return b.price - a.price;
      return b.id - a.id;
    });

  const activeFilters = [
    ...(activeCat !== "semua" ? [{ kind: "cat" as const, id: activeCat, label: activeCatLabel }] : []),
    ...activeSizes.map((s) => ({ kind: "size" as const, id: s, label: s })),
    ...activeColors.map((c) => ({ kind: "color" as const, id: c, label: c })),
  ];

  const handleRemoveFilter = (filterLabel: string) => {
    const f = activeFilters.find((x) => x.label === filterLabel);
    if (!f) return;
    if (f.kind === "cat") setActiveCat("semua");
    else if (f.kind === "size") setActiveSizes(toggleArr(activeSizes, f.id));
    else setActiveColors(toggleArr(activeColors, f.id));
  };

  const handleReset = () => {
    setActiveCat("semua");
    setActiveSizes([]);
    setActiveColors([]);
    setMaxPrice(650);
  };

  const sidebarProps = {
    activeCat,
    activeSizes,
    activeColors,
    maxPrice,
    onCatChange: setActiveCat,
    onSizeToggle: (s: string) => setActiveSizes(toggleArr(activeSizes, s)),
    onColorToggle: (c: string) => setActiveColors(toggleArr(activeColors, c)),
    onPriceChange: setMaxPrice,
    onReset: handleReset,
    hasActiveFilters: activeFilters.length > 0,
  };

  return (
    <div className="min-h-screen pt-[72px] animate-fade-up">
      <Navbar />
      <div className="bg-cream py-6 md:py-8 pb-5 md:pb-6 border-b border-site-border">
        <div className="container-site">
          <div className="text-[11px] text-site-gray mb-1.5">
            <a href="/" className="cursor-pointer hover:text-navy">Home</a>
            {" › Katalog"}{activeCat !== "semua" && ` › ${activeCatLabel}`}
          </div>
          <div className="flex justify-between items-center gap-3">
            <h1 className="font-serif font-normal text-2xl md:text-[32px]">
              {activeCat === "semua" ? "Semua Produk" : `Koleksi ${activeCatLabel}`}
            </h1>
            <div className="text-[13px] text-site-gray shrink-0">{filtered.length} produk</div>
          </div>
        </div>
      </div>
      <div className="container-site py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 lg:gap-10">
          <div className="hidden lg:block">
            <SidebarFilter {...sidebarProps} />
          </div>
          <div>
            <div className="flex lg:hidden gap-2 mb-4">
              <Button variant="outline" size="sm" onClick={() => setFilterOpen(true)} className="!px-4 gap-1.5">
                <SlidersHorizontal size={14} strokeWidth={2} />
                Filter{activeFilters.length > 0 && ` (${activeFilters.length})`}
              </Button>
            </div>
            <ActiveFilters
              filters={activeFilters.map((f) => f.label)}
              sort={sort}
              onRemoveFilter={handleRemoveFilter}
              onSortChange={setSort}
            />
            <ProductGrid products={filtered} />
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <div className={`lg:hidden fixed inset-0 z-[1002] transition-opacity duration-200 ${filterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/50" onClick={() => setFilterOpen(false)} />
        <aside className={`absolute top-0 right-0 bottom-0 w-[88%] max-w-[360px] bg-site-white flex flex-col transition-transform duration-300 ${filterOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between px-5 h-14 border-b border-site-border shrink-0">
            <span className="font-serif text-lg">Filter</span>
            <button type="button" onClick={() => setFilterOpen(false)} aria-label="Close filter" className="p-1">
              <X size={20} strokeWidth={1.8} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <SidebarFilter {...sidebarProps} />
          </div>
          <div className="p-4 border-t border-site-border bg-white shrink-0">
            <Button variant="primary" fullWidth onClick={() => setFilterOpen(false)}>
              Tampilkan {filtered.length} Produk
            </Button>
          </div>
        </aside>
      </div>

      <Footer />
      <Toast />
    </div>
  );
}

export default function CatalogPage() {
  return <Suspense><CatalogContent /></Suspense>;
}
