"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Slide = {
  image: string;
  eyebrow: string;
  titleTop: string;
  titleMid: string;
  titleBot: string;
  caption: string;
};

const slides: Slide[] = [
  {
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=80",
    eyebrow: "New Season 2026",
    titleTop: "Tampil",
    titleMid: "Percaya",
    titleBot: "Diri",
    caption:
      "Koleksi terbaru kami menggabungkan kenyamanan modern dengan estetika yang timeless. Untuk setiap versi terbaik dirimu.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=80",
    eyebrow: "Editorial / 01",
    titleTop: "Siluet",
    titleMid: "Tanpa",
    titleBot: "Batas",
    caption:
      "Garis bersih, potongan presisi. Setiap helai dirancang untuk berpindah dari pagi ke malam tanpa kompromi.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1800&q=80",
    eyebrow: "Signature Capsule",
    titleTop: "Mewah",
    titleMid: "Dalam",
    titleBot: "Detail",
    caption:
      "Material premium dipilih langsung dari atelier terpercaya. Sentuhan emas yang memuliakan setiap penampilan.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1800&q=80",
    eyebrow: "Lookbook Unisex",
    titleTop: "Untuk",
    titleMid: "Setiap",
    titleBot: "Karakter",
    caption:
      "Dirancang untuk dipakai semua. Koleksi yang merayakan individualitas tanpa label gender.",
  },
];

export function HeroSection() {
  const [index, setIndex] = useState(0);
  const total = slides.length;

  const goPrev = () => setIndex((i) => (i - 1 + total) % total);
  const goNext = () => setIndex((i) => (i + 1) % total);

  const active = slides[index];

  return (
    <section className="relative h-[88vh] min-h-[640px] w-full overflow-hidden bg-navy-dark">
      {slides.map((slide, i) => (
        <div
          key={slide.image}
          className={`absolute inset-0 transition-opacity duration-[1100ms] ease-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <Image
            src={slide.image}
            alt={`${slide.titleTop} ${slide.titleMid} ${slide.titleBot}`}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/90 via-navy-dark/55 to-navy-dark/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/70 via-transparent to-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-center px-6 py-14 sm:px-12 md:px-[clamp(40px,6vw,100px)] text-white">
        <div className="max-w-[560px]">
          <div
            key={`eyebrow-${index}`}
            className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gold mb-5 animate-[fadeUp_0.6s_ease]"
          >
            {active.eyebrow}
          </div>
          <h1
            key={`title-${index}`}
            className="font-serif font-light leading-[1.1] mb-4 text-[clamp(2.4rem,5vw,5rem)] animate-[fadeUp_0.7s_ease]"
          >
            {active.titleTop}
            <br />
            <em className="italic text-gold">{active.titleMid}</em>
            <br />
            {active.titleBot}
          </h1>
          <p
            key={`caption-${index}`}
            className="text-[15px] text-white/70 max-w-[380px] leading-[1.8] mb-9 animate-[fadeUp_0.8s_ease]"
          >
            {active.caption}
          </p>
          <div className="flex gap-3.5 flex-wrap">
            <Link href="/catalog">
              <Button variant="gold">Belanja Sekarang</Button>
            </Link>
            <Link href="/catalog?cat=Women">
              <Button variant="outline-white">Lihat Lookbook</Button>
            </Link>
          </div>
          <div className="hidden sm:flex gap-10 mt-12 pt-8 border-t border-white/[0.15] max-w-[460px]">
            {[
              ["500+", "Produk"],
              ["50K+", "Pelanggan"],
              ["4.9★", "Rating"],
            ].map(([val, label]) => (
              <div key={label}>
                <div className="font-serif text-2xl md:text-[28px] font-semibold text-gold">
                  {val}
                </div>
                <div className="text-[11px] tracking-[0.1em] uppercase text-white/55 mt-0.5">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={goPrev}
        aria-label="Slide sebelumnya"
        className="group absolute left-4 sm:left-8 top-1/2 z-20 -translate-y-1/2 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-white/25 bg-white/5 backdrop-blur-sm text-white transition hover:border-gold hover:bg-gold hover:text-navy-dark"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:-translate-x-0.5" />
      </button>
      <button
        type="button"
        onClick={goNext}
        aria-label="Slide berikutnya"
        className="group absolute right-4 sm:right-8 top-1/2 z-20 -translate-y-1/2 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-white/25 bg-white/5 backdrop-blur-sm text-white transition hover:border-gold hover:bg-gold hover:text-navy-dark"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:translate-x-0.5" />
      </button>

      <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 flex items-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Pindah ke slide ${i + 1}`}
            className={`h-[2px] transition-all duration-500 ${
              i === index ? "w-10 bg-gold" : "w-5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-8 right-6 sm:right-10 z-20 hidden md:block font-mono text-[11px] tracking-[0.2em] text-white/60">
        <span className="text-gold">{String(index + 1).padStart(2, "0")}</span>
        <span className="mx-2 text-white/30">/</span>
        <span>{String(total).padStart(2, "0")}</span>
      </div>
    </section>
  );
}
