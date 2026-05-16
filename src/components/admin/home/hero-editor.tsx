"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronUp, ChevronDown, ImagePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHomeContentStore } from "@/stores/home-content-store";
import type { HeroSlide } from "@/types/home-content";
import { SectionShell, sortByOrder } from "./section-shell";

const isUrl = (s: string) => /^https?:\/\//i.test(s);
const isUnsplash = (s: string) => /^https?:\/\/images\.unsplash\.com\//i.test(s);

let counter = 0;
const newSlideId = () => `h_${Date.now()}_${++counter}`;

export function HeroEditor({
  index,
  total,
}: {
  index: number;
  total: number;
}) {
  const slides = useHomeContentStore((s) => s.content.heroSlides);
  const setHeroSlides = useHomeContentStore((s) => s.setHeroSlides);

  const [draft, setDraft] = useState<HeroSlide[]>(sortByOrder(slides));
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setDraft(sortByOrder(slides));
  }, [slides]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(sortByOrder(slides));

  const moveUp = (i: number) => {
    if (i === 0) return;
    setDraft((d) => {
      const next = [...d];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return next;
    });
  };
  const moveDown = (i: number) => {
    if (i >= draft.length - 1) return;
    setDraft((d) => {
      const next = [...d];
      [next[i + 1], next[i]] = [next[i], next[i + 1]];
      return next;
    });
  };
  const addSlide = () => {
    if (draft.length >= 6) {
      setError("Maksimum 6 slide.");
      return;
    }
    setError("");
    setDraft((d) => [
      ...d,
      { id: newSlideId(), src: "", alt: "", order: d.length + 1 },
    ]);
  };
  const remove = (id: string) => {
    if (draft.length <= 1) {
      setError("Minimal 1 slide.");
      return;
    }
    setError("");
    setDraft((d) => d.filter((s) => s.id !== id));
  };
  const update = (id: string, patch: Partial<HeroSlide>) =>
    setDraft((d) => d.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const handleSave = () => {
    for (const s of draft) {
      if (!s.src.trim()) {
        setError("Setiap slide wajib punya URL gambar.");
        return;
      }
      if (!isUrl(s.src)) {
        setError(`Slide "${s.alt || s.id}": URL harus diawali http(s)://.`);
        return;
      }
    }
    setError("");
    setHeroSlides(draft);
    setSavedAt(Date.now());
  };

  return (
    <SectionShell
      index={index}
      total={total}
      eyebrow="Banner · Hero Slider"
      title="Hero Slider"
      description="Carousel utama di atas halaman beranda. Min 1, maks 6 slide. URL harus dari hostname yang ter-allowlist (default: images.unsplash.com)."
      counterLabel={`${draft.length}/06`}
      dirty={dirty}
      savedAt={savedAt}
      onSave={handleSave}
      onDiscard={() => setDraft(sortByOrder(slides))}
    >
      <div className="space-y-3">
        {draft.map((slide, i) => {
          const isFirst = i === 0;
          const isLast = i === draft.length - 1;
          return (
            <div
              key={slide.id}
              className="bg-white border border-site-border grid grid-cols-[40px_120px_1fr_72px] items-stretch"
            >
              <div className="border-r border-site-border bg-cream/60 flex flex-col items-center justify-center gap-1 py-2 text-site-gray-light">
                <button
                  type="button"
                  onClick={() => moveUp(i)}
                  disabled={isFirst}
                  aria-label="Naikkan"
                  className="hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronUp size={14} strokeWidth={2} />
                </button>
                <span className="font-serif italic text-[18px] tabular-nums text-site-gray">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() => moveDown(i)}
                  disabled={isLast}
                  aria-label="Turunkan"
                  className="hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronDown size={14} strokeWidth={2} />
                </button>
              </div>

              <div className="relative w-full h-[100px] bg-cream border-r border-site-border overflow-hidden">
                {isUnsplash(slide.src) ? (
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                ) : isUrl(slide.src) ? (
                  // Non-allowlisted host fallback — show as raw img tag
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] text-site-gray-light tracking-[0.18em] uppercase">
                    No image
                  </div>
                )}
              </div>

              <div className="px-4 py-3 grid grid-cols-1 gap-2 min-w-0">
                <input
                  value={slide.src}
                  onChange={(e) => update(slide.id, { src: e.target.value })}
                  placeholder="https://images.unsplash.com/…"
                  className="px-3 py-2 border-[1.5px] border-site-border bg-white font-mono text-[12.5px] tracking-tight text-site-text outline-none focus:border-navy"
                />
                <input
                  value={slide.alt}
                  onChange={(e) => update(slide.id, { alt: e.target.value })}
                  placeholder="Alt text (opsional)"
                  maxLength={120}
                  className="px-3 py-2 border border-site-border bg-white font-sans text-[12.5px] text-site-text outline-none focus:border-navy"
                />
              </div>

              <div className="border-l border-site-border flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => remove(slide.id)}
                  aria-label="Hapus"
                  className="p-2 text-[#b91c1c] hover:bg-[#fee2e2] rounded-sm"
                >
                  <Trash2 size={15} strokeWidth={1.8} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-4 pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addSlide}
          className="flex items-center gap-2"
        >
          <ImagePlus size={14} strokeWidth={1.8} />
          Tambah Slide
        </Button>
        <span className="text-[11px] text-site-gray font-mono">
          {draft.length}/06 slide
        </span>
      </div>

      {error && (
        <div className="px-3.5 py-2.5 text-[12.5px] bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]">
          {error}
        </div>
      )}
    </SectionShell>
  );
}
