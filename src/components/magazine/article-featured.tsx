import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Article } from "@/types/magazine";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

interface ArticleFeaturedProps {
  article: Article;
}

export function ArticleFeatured({ article }: ArticleFeaturedProps) {
  return (
    <Link
      href={`/magazine/${article.slug}`}
      className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 no-underline text-site-text"
    >
      <div className="lg:col-span-7 order-1">
        <div className="aspect-[4/5] lg:aspect-[5/6] overflow-hidden bg-cream">
          <PlaceholderImage
            src={article.cover}
            alt={article.title}
            className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />
        </div>
      </div>
      <div className="lg:col-span-5 order-2 flex flex-col justify-center">
        <div className="text-[10px] tracking-[0.24em] uppercase text-site-gray font-medium mb-5">
          <span className="inline-block w-6 h-px bg-site-text align-middle mr-3" />
          Editor&apos;s Pick
        </div>
        <div className="text-[11px] tracking-[0.22em] uppercase text-site-text font-medium mb-4">
          {article.category}
        </div>
        <h2 className="font-serif text-[clamp(2rem,4vw,3.4rem)] leading-[1.05] mb-6">
          {article.title}
        </h2>
        <p className="text-[15px] leading-[1.75] text-site-gray-dark/80 mb-8 max-w-[42ch]">
          {article.excerpt}
        </p>
        <div className="text-[12px] tracking-wide text-site-gray mb-8">
          Oleh {article.author} <span className="mx-1.5">·</span> {article.date}{" "}
          <span className="mx-1.5">·</span> {article.readTime} menit baca
        </div>
        <div className="inline-flex items-center gap-2 text-[12px] tracking-[0.16em] uppercase font-medium border-b border-site-text pb-1.5 self-start transition-all duration-300 group-hover:gap-3">
          Baca Cerita
          <ArrowUpRight size={14} strokeWidth={1.8} />
        </div>
      </div>
    </Link>
  );
}
