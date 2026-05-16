"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { useHomeContentStore } from "@/stores/home-content-store";

const isUnsplash = (s: string) => /^https?:\/\/images\.unsplash\.com\//i.test(s);

export function HeroSection() {
  const slides = useHomeContentStore(
    useShallow((s) => [...s.content.heroSlides].sort((a, b) => a.order - b.order)),
  );
  const enabled = useHomeContentStore((s) => s.content.visibility.showHero);

  const [index, setIndex] = useState(0);
  const total = slides.length;

  if (!enabled || total === 0) return null;

  const safeIndex = Math.min(index, total - 1);
  const goPrev = () => setIndex((i) => (i - 1 + total) % total);
  const goNext = () => setIndex((i) => (i + 1) % total);

  return (
    <section className="relative h-[88vh] min-h-[560px] w-full overflow-hidden bg-cream">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-[900ms] ease-out ${
            i === safeIndex ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== safeIndex}
        >
          {isUnsplash(slide.src) ? (
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={slide.src}
              alt={slide.alt}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </div>
      ))}

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Slide sebelumnya"
            className="group absolute left-4 sm:left-8 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center bg-white/85 text-site-text backdrop-blur-sm transition hover:bg-white"
          >
            <ChevronLeft
              className="h-5 w-5 transition-transform group-hover:-translate-x-0.5"
              strokeWidth={1.6}
            />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Slide berikutnya"
            className="group absolute right-4 sm:right-8 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center bg-white/85 text-site-text backdrop-blur-sm transition hover:bg-white"
          >
            <ChevronRight
              className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
              strokeWidth={1.6}
            />
          </button>

          <div className="absolute bottom-7 left-1/2 z-20 -translate-x-1/2 flex items-center gap-2.5">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Pindah ke slide ${i + 1}`}
                className={`h-[2px] transition-all duration-500 ${
                  i === safeIndex
                    ? "w-9 bg-white"
                    : "w-5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
