"use client";
import { Tag } from "@/components/ui/tag";
import { Button } from "@/components/ui/button";
import { PRODUCTS } from "@/lib/constants";

const CATEGORIES = ["Semua", "Men", "Women", "Unisex", "Aksesoris"];
const SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];
const COLORS = [
  { name: "Hitam", hex: "#1a1a2a" }, { name: "Navy", hex: "#1a2744" },
  { name: "Krem", hex: "#e8d9c0" }, { name: "Putih", hex: "#f5f0e8" },
  { name: "Abu", hex: "#888" }, { name: "Camel", hex: "#c19a6b" },
  { name: "Olive", hex: "#7a8c5a" }, { name: "Mauve", hex: "#b08090" },
];

interface SidebarFilterProps {
  activeCat: string;
  activeSizes: string[];
  activeColors: string[];
  maxPrice: number;
  onCatChange: (cat: string) => void;
  onSizeToggle: (size: string) => void;
  onColorToggle: (color: string) => void;
  onPriceChange: (price: number) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export function SidebarFilter({ activeCat, activeSizes, activeColors, maxPrice, onCatChange, onSizeToggle, onColorToggle, onPriceChange, onReset, hasActiveFilters }: SidebarFilterProps) {
  return (
    <aside className="sticky top-[90px] self-start">
      {/* Category */}
      <div className="mb-8">
        <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-navy mb-3.5 pb-2.5 border-b border-site-border">Kategori</div>
        {CATEGORIES.map((c) => (
          <div key={c} onClick={() => onCatChange(c)} className={`py-2 text-sm cursor-pointer flex justify-between items-center border-b border-site-border ${activeCat === c ? "text-navy font-semibold" : "text-site-gray-dark font-normal"}`}>
            {c}
            <span className="text-[11px] text-site-gray">{PRODUCTS.filter((p) => c === "Semua" || p.category === c).length}</span>
          </div>
        ))}
      </div>
      {/* Size */}
      <div className="mb-8">
        <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-navy mb-3.5 pb-2.5 border-b border-site-border">Ukuran</div>
        <div className="flex flex-wrap gap-1.5">
          {SIZES.map((s) => (
            <Tag key={s} active={activeSizes.includes(s)} onClick={() => onSizeToggle(s)} className="min-w-[38px] justify-center text-xs">{s}</Tag>
          ))}
        </div>
      </div>
      {/* Price */}
      <div className="mb-8">
        <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-navy mb-3.5 pb-2.5 border-b border-site-border">Harga</div>
        <input type="range" min={50} max={650} value={maxPrice} onChange={(e) => onPriceChange(+e.target.value)} className="w-full h-[3px] appearance-none outline-none bg-site-border [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-navy [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer" />
        <div className="flex justify-between text-xs text-site-gray mt-1.5">
          <span>Rp 0</span>
          <span className="text-navy font-semibold">Rp {maxPrice}.000</span>
        </div>
      </div>
      {/* Color */}
      <div className="mb-8">
        <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-navy mb-3.5 pb-2.5 border-b border-site-border">Warna</div>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <div key={c.name} title={c.name} onClick={() => onColorToggle(c.name)} className="w-[22px] h-[22px] rounded-full cursor-pointer transition-all" style={{ background: c.hex, border: activeColors.includes(c.name) ? "3px solid #c9a84c" : "2px solid #e2ddd4", boxShadow: activeColors.includes(c.name) ? "0 0 0 1px #c9a84c" : "none" }} />
          ))}
        </div>
      </div>
      {hasActiveFilters && <Button variant="outline" size="sm" fullWidth onClick={onReset}>Reset Filter</Button>}
    </aside>
  );
}
