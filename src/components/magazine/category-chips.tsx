"use client";
import { MagazineCategorySlug } from "@/types/magazine";

interface CategoryChipsProps {
  active: MagazineCategorySlug | "all";
  onChange: (value: MagazineCategorySlug | "all") => void;
}

const CHIPS: { value: MagazineCategorySlug | "all"; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "tips-mix-match", label: "Tips Mix & Match" },
  { value: "fashion-news", label: "Fashion News" },
  { value: "education", label: "Education" },
];

export function CategoryChips({ active, onChange }: CategoryChipsProps) {
  return (
    <div className="flex flex-wrap gap-2.5 md:gap-3">
      {CHIPS.map((chip) => {
        const isActive = chip.value === active;
        return (
          <button
            key={chip.value}
            type="button"
            onClick={() => onChange(chip.value)}
            className={`px-5 py-2.5 text-[11px] tracking-[0.16em] uppercase font-medium border transition-all duration-200 cursor-pointer ${
              isActive
                ? "bg-site-text text-white border-site-text"
                : "bg-transparent text-site-text/75 border-site-border hover:border-site-text hover:text-site-text"
            }`}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
