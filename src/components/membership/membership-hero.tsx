import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

interface MembershipHeroProps {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  description: string;
  image: string;
  imageCaption?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  bannerText: string;
}

export function MembershipHero({
  eyebrow,
  title,
  titleAccent,
  description,
  image,
  imageCaption,
  ctaPrimary = "Hubungi Kami",
  ctaSecondary = "Pelajari Detail",
  bannerText,
}: MembershipHeroProps) {
  return (
    <>
      <section className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-72px)]">
          {/* Left — text */}
          <div className="order-2 lg:order-1 flex items-center bg-white">
            <div className="w-full px-6 md:px-12 lg:px-16 xl:px-24 py-16 md:py-24">
              <div className="max-w-[520px]">
                <div className="text-[10px] tracking-[0.32em] uppercase text-site-gray font-medium mb-8 flex items-center gap-3">
                  <span className="inline-block w-8 h-px bg-site-text" />
                  {eyebrow}
                </div>

                <h1 className="font-serif text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.98] tracking-tight mb-2">
                  {title}
                </h1>
                {titleAccent && (
                  <h1 className="font-serif italic text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.98] tracking-tight mb-8 text-site-gray-dark/80">
                    {titleAccent}
                  </h1>
                )}

                <p className="text-[15px] md:text-[16px] leading-[1.8] text-site-gray-dark/75 mb-10 max-w-[460px]">
                  {description}
                </p>

                <div className="flex flex-wrap items-center gap-4 mb-12">
                  <Button variant="primary">{ctaPrimary}</Button>
                  <Link
                    href="#detail"
                    className="inline-flex items-center gap-2 text-[12px] tracking-[0.16em] uppercase font-medium text-site-text no-underline border-b border-site-text pb-1 hover:gap-3 transition-all duration-300"
                  >
                    {ctaSecondary}
                    <ArrowUpRight size={14} strokeWidth={1.8} />
                  </Link>
                </div>

                <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray font-medium pt-8 border-t border-site-border">
                  Tersedia 2026 · Soft launch terbatas
                </div>
              </div>
            </div>
          </div>

          {/* Right — image */}
          <div className="order-1 lg:order-2 relative bg-cream min-h-[420px] lg:min-h-0">
            <PlaceholderImage
              src={image}
              alt={title}
              className="absolute inset-0"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {/* serial number / micro detail */}
            <div className="hidden lg:flex absolute top-8 right-8 flex-col items-end gap-1 text-white mix-blend-difference">
              <span className="text-[10px] tracking-[0.32em] uppercase font-medium">
                Membership
              </span>
              <span className="text-[10px] tracking-[0.22em] font-mono opacity-80">
                NO. {eyebrow.slice(0, 2).toUpperCase()} / 2026
              </span>
            </div>
            {imageCaption && (
              <div className="absolute bottom-6 left-6 text-[11px] italic font-serif text-white mix-blend-difference">
                {imageCaption}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Banner */}
      <div className="bg-site-text text-white overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap py-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex shrink-0 items-center gap-12 px-6 text-[11px] tracking-[0.32em] uppercase font-medium"
            >
              {Array.from({ length: 6 }).map((_, j) => (
                <span key={j} className="flex items-center gap-12">
                  {bannerText}
                  <span className="text-white/40">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
