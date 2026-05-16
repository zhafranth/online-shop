"use client";

import { useEffect, useState } from "react";
import {
  Images,
  Megaphone,
  Sparkles,
  Star,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { useHomeContentStore } from "@/stores/home-content-store";
import type { HomeSectionKey } from "@/types/home-content";
import { HeroEditor } from "@/components/admin/home/hero-editor";
import { TickerEditor } from "@/components/admin/home/ticker-editor";
import { UspEditor } from "@/components/admin/home/usp-editor";
import { EditorsPicksEditor } from "@/components/admin/home/editors-picks-editor";
import { VisibilityEditor } from "@/components/admin/home/visibility-editor";

type Entry = {
  key: HomeSectionKey;
  label: string;
  caption: string;
  icon: typeof Images;
};

const TOC: Entry[] = [
  {
    key: "hero",
    label: "Hero Slider",
    caption: "Carousel utama banner.",
    icon: Images,
  },
  {
    key: "ticker",
    label: "Ticker Bar",
    caption: "Marquee promo atas hero.",
    icon: Megaphone,
  },
  {
    key: "usp",
    label: "USP Strip",
    caption: "Empat janji singkat.",
    icon: Sparkles,
  },
  {
    key: "editorsPicks",
    label: "Editor's Picks",
    caption: "Tiga produk kurasi.",
    icon: Star,
  },
  {
    key: "visibility",
    label: "Section Visibility",
    caption: "Show / hide tiap section.",
    icon: LayoutGrid,
  },
];

export default function AdminHomeContentPage() {
  const content = useHomeContentStore((s) => s.content);
  const reset = useHomeContentStore((s) => s.reset);

  const [active, setActive] = useState<HomeSectionKey>("hero");
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    const el = document.getElementById(`section-${active}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [active]);

  const total = TOC.length;
  const visibleCount = Object.values(content.visibility).filter(Boolean).length;

  const renderSection = (key: HomeSectionKey, idx: number) => {
    const props = { index: idx + 1, total };
    switch (key) {
      case "hero":
        return <HeroEditor {...props} />;
      case "ticker":
        return <TickerEditor {...props} />;
      case "usp":
        return <UspEditor {...props} />;
      case "editorsPicks":
        return <EditorsPicksEditor {...props} />;
      case "visibility":
        return <VisibilityEditor {...props} />;
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3 text-[10px] tracking-[0.22em] uppercase text-site-gray">
            <span>Content</span>
            <span className="h-px w-6 bg-site-border" />
            <span className="font-mono normal-case tracking-tight">
              Composer 01–{String(total).padStart(2, "0")}
            </span>
          </div>
          <h2 className="font-serif text-[34px] leading-tight mt-2 text-navy">
            Home & Banner
          </h2>
          <p className="text-[13px] text-site-gray mt-1.5 max-w-xl leading-relaxed">
            Rangkai isi halaman utama: hero slider, ticker, USP, dan kurasi
            editor. Section visibility membungkam tanpa menghapus data.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setConfirmReset(true)}
          className="flex items-center gap-2"
        >
          Reset Default
        </Button>
      </header>

      {/* Insight strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 bg-white border border-site-border">
        {[
          {
            k: "Hero Slides",
            v: String(content.heroSlides.length).padStart(2, "0"),
          },
          { k: "USP Items", v: String(content.uspItems.length).padStart(2, "0") },
          {
            k: "Editor's Picks",
            v: `${content.editorsPicks.heroProductId ? "01" : "—"}+${content.editorsPicks.smallProductIds.filter(Boolean).length}`,
          },
          {
            k: "Section Aktif",
            v: `${visibleCount}/${TOC.length + 2}`,
          },
        ].map((s, i) => (
          <div
            key={s.k}
            className={`px-6 py-5 ${i > 0 ? "md:border-l border-site-border" : ""}`}
          >
            <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray">
              {s.k}
            </div>
            <div className="font-serif text-[28px] leading-none mt-2 text-navy tabular-nums">
              {s.v}
            </div>
          </div>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 items-start">
        <aside className="lg:sticky lg:top-6 self-start">
          <div className="bg-white border border-site-border">
            <div className="px-4 pt-4 pb-3 border-b border-site-border">
              <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray">
                Composer
              </div>
              <div className="font-serif text-[18px] mt-0.5 text-navy">
                Sections
              </div>
            </div>
            <ul>
              {TOC.map((entry, i) => {
                const isActive = active === entry.key;
                const Icon = entry.icon;
                return (
                  <li key={entry.key}>
                    <button
                      type="button"
                      onClick={() => setActive(entry.key)}
                      className={`group w-full text-left flex gap-3 px-4 py-3 border-t border-site-border first:border-t-0 transition-colors ${isActive ? "bg-cream" : "bg-white hover:bg-cream/40"}`}
                    >
                      <span
                        className={`shrink-0 font-serif italic text-[20px] leading-none tabular-nums pt-0.5 ${isActive ? "text-navy" : "text-site-gray-light"}`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5">
                          <Icon
                            size={12}
                            strokeWidth={1.7}
                            className={isActive ? "text-navy" : "text-site-gray"}
                          />
                          <span
                            className={`text-[12.5px] font-medium truncate ${isActive ? "text-navy" : "text-site-text"}`}
                          >
                            {entry.label}
                          </span>
                        </span>
                        <span className="block text-[11px] text-site-gray mt-0.5 truncate">
                          {entry.caption}
                        </span>
                      </span>
                      {isActive && (
                        <span className="shrink-0 self-stretch w-[2px] bg-navy -my-3 -mr-4" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-3 px-4 py-3 bg-cream border border-site-border text-[11px] text-site-gray font-mono leading-relaxed">
            <span className="text-navy">▌</span> Section dapat di-save terpisah.
            Visibility tidak menghapus data.
          </div>
        </aside>

        <div className="space-y-6 min-w-0">
          {TOC.map((entry, i) => (
            <div
              key={entry.key}
              id={`section-${entry.key}`}
              className="scroll-mt-6"
            >
              {renderSection(entry.key, i)}
            </div>
          ))}
        </div>
      </div>

      <ConfirmModal
        open={confirmReset}
        title="Reset Home Content"
        message="Semua section akan dikembalikan ke seed default. Aksi ini tidak bisa dibatalkan."
        confirmLabel="Reset"
        variant="danger"
        onConfirm={() => {
          reset();
          setConfirmReset(false);
        }}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}
