import Link from "next/link";
import { Article } from "@/types/magazine";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

interface ArticleCardProps {
  article: Article;
  compact?: boolean;
}

export function ArticleCard({ article, compact = false }: ArticleCardProps) {
  return (
    <Link
      href={`/magazine/${article.slug}`}
      className="group block no-underline text-site-text"
    >
      <div
        className={`aspect-[4/5] overflow-hidden bg-cream ${compact ? "mb-3" : "mb-5"}`}
      >
        <PlaceholderImage
          src={article.cover}
          alt={article.title}
          className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          sizes={
            compact
              ? "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
              : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          }
        />
      </div>
      <div
        className={`tracking-[0.22em] uppercase text-site-gray font-medium ${compact ? "text-[9px] mb-2" : "text-[10px] mb-3"}`}
      >
        {article.category}
      </div>
      <h3
        className={`font-serif leading-[1.2] transition-colors group-hover:text-site-gray-dark ${
          compact
            ? "text-[15px] md:text-[16px] mb-2"
            : "text-[22px] md:text-[24px] mb-3"
        }`}
      >
        <span className="bg-gradient-to-r from-site-text to-site-text bg-no-repeat bg-bottom bg-[length:0%_1px] group-hover:bg-[length:100%_1px] transition-[background-size] duration-500">
          {article.title}
        </span>
      </h3>
      <p
        className={`leading-[1.7] text-site-gray line-clamp-2 ${compact ? "text-[11px] mb-2" : "text-[13px] mb-4"}`}
      >
        {article.excerpt}
      </p>
      <div
        className={`tracking-wide text-site-gray ${compact ? "text-[10px]" : "text-[11px]"}`}
      >
        {article.author} <span className="mx-1.5">·</span> {article.date}
      </div>
    </Link>
  );
}
