"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PRODUCTS } from "@/lib/constants";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SidebarFilter } from "@/components/catalog/sidebar-filter";
import { ProductGrid } from "@/components/catalog/product-grid";
import { ActiveFilters } from "@/components/catalog/active-filters";
import { Toast } from "@/components/ui/toast";

const CATEGORIES = ["Semua", "Men", "Women", "Unisex", "Aksesoris"];
const SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat") || "Semua";
  const [activeCat, setActiveCat] = useState(initialCat);
  const [activeSizes, setActiveSizes] = useState<string[]>([]);
  const [activeColors, setActiveColors] = useState<string[]>([]);
  const [sort, setSort] = useState("Terbaru");
  const [maxPrice, setMaxPrice] = useState(650);

  const toggleArr = (arr: string[], val: string) => arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

  const filtered = PRODUCTS.filter((p) => {
    if (activeCat !== "Semua" && p.category !== activeCat) return false;
    if (activeSizes.length && !activeSizes.some((s) => p.sizes.includes(s))) return false;
    if (activeColors.length && !activeColors.some((c) => p.colors.includes(c))) return false;
    if (p.price > maxPrice * 1000) return false;
    return true;
  }).sort((a, b) => {
    if (sort === "Harga ↑") return a.price - b.price;
    if (sort === "Harga ↓") return b.price - a.price;
    return b.id - a.id;
  });

  const activeFilters = [...(activeCat !== "Semua" ? [activeCat] : []), ...activeSizes, ...activeColors];

  const handleRemoveFilter = (filter: string) => {
    if (CATEGORIES.includes(filter)) setActiveCat("Semua");
    else if (SIZES.includes(filter)) setActiveSizes(toggleArr(activeSizes, filter));
    else setActiveColors(toggleArr(activeColors, filter));
  };

  const handleReset = () => { setActiveCat("Semua"); setActiveSizes([]); setActiveColors([]); setMaxPrice(650); };

  return (
    <div className="min-h-screen pt-[72px] animate-fade-up">
      <Navbar />
      <div className="bg-cream py-8 pb-6 border-b border-site-border">
        <div className="container-site">
          <div className="text-[11px] text-site-gray mb-1.5">
            <a href="/" className="cursor-pointer hover:text-navy">Home</a>
            {" › Katalog"}{activeCat !== "Semua" && ` › ${activeCat}`}
          </div>
          <div className="flex justify-between items-center">
            <h1 className="font-serif font-normal text-[32px]">{activeCat === "Semua" ? "Semua Produk" : `Koleksi ${activeCat}`}</h1>
            <div className="text-[13px] text-site-gray">{filtered.length} produk</div>
          </div>
        </div>
      </div>
      <div className="container-site py-10">
        <div className="grid grid-cols-[240px_1fr] gap-10">
          <SidebarFilter activeCat={activeCat} activeSizes={activeSizes} activeColors={activeColors} maxPrice={maxPrice} onCatChange={setActiveCat} onSizeToggle={(s) => setActiveSizes(toggleArr(activeSizes, s))} onColorToggle={(c) => setActiveColors(toggleArr(activeColors, c))} onPriceChange={setMaxPrice} onReset={handleReset} hasActiveFilters={activeFilters.length > 0} />
          <div>
            <ActiveFilters filters={activeFilters} sort={sort} onRemoveFilter={handleRemoveFilter} onSortChange={setSort} />
            <ProductGrid products={filtered} />
          </div>
        </div>
      </div>
      <Footer />
      <Toast />
    </div>
  );
}

export default function CatalogPage() {
  return <Suspense><CatalogContent /></Suspense>;
}
