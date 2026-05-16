"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useHomeContentStore } from "@/stores/home-content-store";
import type { HomeVisibility } from "@/types/home-content";
import { SectionShell } from "./section-shell";

const ROWS: Array<{
  key: keyof HomeVisibility;
  label: string;
  description: string;
  hasEditor: boolean;
}> = [
  {
    key: "showHero",
    label: "Hero Slider",
    description: "Carousel banner di atas halaman.",
    hasEditor: true,
  },
  {
    key: "showTicker",
    label: "Ticker Bar",
    description: "Marquee promo di atas hero.",
    hasEditor: true,
  },
  {
    key: "showNewArrivals",
    label: "New Arrivals",
    description: "Auto-pull produk berbadge NEW.",
    hasEditor: false,
  },
  {
    key: "showBestSeller",
    label: "Best Seller",
    description: "Empat slot produk best seller.",
    hasEditor: true,
  },
  {
    key: "showLatestMagazine",
    label: "Latest Magazine",
    description: "Tiga artikel terbaru dari magazine store.",
    hasEditor: false,
  },
  {
    key: "showUsp",
    label: "USP Strip",
    description: "Empat janji singkat di bawah hero.",
    hasEditor: true,
  },
  {
    key: "showGenderBanner",
    label: "Gender Banner",
    description: "Banner kategori For Him / For Her.",
    hasEditor: false,
  },
];

export function VisibilityEditor({
  index,
  total,
}: {
  index: number;
  total: number;
}) {
  const visibility = useHomeContentStore((s) => s.content.visibility);
  const setVisibility = useHomeContentStore((s) => s.setVisibility);

  const [draft, setDraft] = useState<HomeVisibility>(visibility);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    setDraft(visibility);
  }, [visibility]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(visibility);
  const visibleCount = Object.values(draft).filter(Boolean).length;

  const toggle = (key: keyof HomeVisibility) =>
    setDraft((d) => ({ ...d, [key]: !d[key] }));

  return (
    <SectionShell
      index={index}
      total={total}
      eyebrow="Layout · Composer"
      title="Section Visibility"
      description="Show / hide setiap section storefront. Data tetap tersimpan saat disembunyikan — toggle on lagi untuk memunculkan."
      counterLabel={`${visibleCount}/${ROWS.length} aktif`}
      dirty={dirty}
      savedAt={savedAt}
      onSave={() => {
        setVisibility(draft);
        setSavedAt(Date.now());
      }}
      onDiscard={() => setDraft(visibility)}
    >
      <div className="bg-white border border-site-border">
        <div className="grid grid-cols-[60px_1fr_120px_88px] items-center gap-4 px-5 py-2.5 bg-cream border-b border-site-border text-[10px] font-semibold tracking-[0.16em] uppercase text-site-gray">
          <span>No.</span>
          <span>Section</span>
          <span>Editor</span>
          <span className="text-right">Visibility</span>
        </div>
        {ROWS.map((row, i) => {
          const on = draft[row.key];
          return (
            <div
              key={row.key}
              className={`grid grid-cols-[60px_1fr_120px_88px] items-center gap-4 px-5 py-3.5 border-b border-site-border last:border-b-0 transition-colors ${on ? "bg-white" : "bg-cream/40"}`}
            >
              <div className="flex items-center gap-1.5">
                <span className="font-serif italic text-[20px] tabular-nums text-site-gray-light">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="min-w-0">
                <div
                  className={`font-serif text-[16px] leading-tight ${on ? "text-navy" : "text-site-gray"}`}
                >
                  {row.label}
                </div>
                <div className="text-[11.5px] text-site-gray mt-0.5 truncate">
                  {row.description}
                </div>
              </div>
              <div>
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-1 border-[1.5px] text-[9.5px] tracking-[0.14em] uppercase ${row.hasEditor ? "border-navy text-navy" : "border-site-gray-light text-site-gray"}`}
                >
                  {row.hasEditor ? "Editable" : "Auto-pull"}
                </span>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => toggle(row.key)}
                  aria-pressed={on}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 border-[1.5px] transition-colors ${on ? "border-navy bg-navy text-white" : "border-site-border bg-white text-site-gray hover:border-navy hover:text-navy"}`}
                >
                  {on ? (
                    <Eye size={12} strokeWidth={2} />
                  ) : (
                    <EyeOff size={12} strokeWidth={2} />
                  )}
                  <span className="text-[10px] tracking-[0.16em] uppercase font-medium">
                    {on ? "Show" : "Hide"}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Wireframe preview */}
      <div className="border-t border-dashed border-site-border pt-5">
        <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray mb-3">
          Stack Wireframe
        </div>
        <div className="bg-cream border border-site-border p-4 space-y-2">
          {[
            { k: "showTicker", label: "Ticker", h: "h-3" },
            { k: "showHero", label: "Hero", h: "h-20" },
            { k: "showNewArrivals", label: "New Arrivals", h: "h-12" },
            { k: "showBestSeller", label: "Best Seller", h: "h-14" },
            { k: "showLatestMagazine", label: "Latest Magazine", h: "h-10" },
            { k: "showUsp", label: "USP", h: "h-6" },
            { k: "showGenderBanner", label: "Gender Banner", h: "h-10" },
          ].map((row) => {
            const on = draft[row.k as keyof HomeVisibility];
            return (
              <div
                key={row.k}
                className={`relative ${row.h} ${on ? "bg-navy/10 border border-navy/30" : "bg-white border border-dashed border-site-border"} flex items-center justify-between px-3`}
              >
                <span
                  className={`text-[10px] tracking-[0.18em] uppercase ${on ? "text-navy" : "text-site-gray-light"}`}
                >
                  {row.label}
                </span>
                <span
                  className={`text-[9.5px] font-mono ${on ? "text-navy" : "text-site-gray-light"}`}
                >
                  {on ? "visible" : "hidden"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}
