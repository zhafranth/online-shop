"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1800&q=80",
];

export function HeroSection() {
  const [index, setIndex] = useState(0);
  const total = SLIDES.length;

  const goPrev = () => setIndex((i) => (i - 1 + total) % total);
  const goNext = () => setIndex((i) => (i + 1) % total);

  return (
    <section className="relative h-[88vh] min-h-[560px] w-full overflow-hidden bg-cream">
      {SLIDES.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-[900ms] ease-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <Image
            src={src}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={goPrev}
        aria-label="Slide sebelumnya"
        className="group absolute left-4 sm:left-8 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center bg-white/85 text-site-text backdrop-blur-sm transition hover:bg-white"
      >
        <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" strokeWidth={1.6} />
      </button>
      <button
        type="button"
        onClick={goNext}
        aria-label="Slide berikutnya"
        className="group absolute right-4 sm:right-8 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center bg-white/85 text-site-text backdrop-blur-sm transition hover:bg-white"
      >
        <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" strokeWidth={1.6} />
      </button>

      <div className="absolute bottom-7 left-1/2 z-20 -translate-x-1/2 flex items-center gap-2.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Pindah ke slide ${i + 1}`}
            className={`h-[2px] transition-all duration-500 ${
              i === index ? "w-9 bg-white" : "w-5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
