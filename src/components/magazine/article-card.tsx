import Link from "next/link";
import { Article } from "@/types/magazine";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/magazine/${article.slug}`}
      className="group block no-underline text-site-text"
    >
      <div className="aspect-[4/5] overflow-hidden bg-cream mb-5">
        <PlaceholderImage
          src={article.cover}
          alt={article.title}
          className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray font-medium mb-3">
        {article.category}
      </div>
      <h3 className="font-serif text-[22px] md:text-[24px] leading-[1.2] mb-3 transition-colors group-hover:text-site-gray-dark">
        <span className="bg-gradient-to-r from-site-text to-site-text bg-no-repeat bg-bottom bg-[length:0%_1px] group-hover:bg-[length:100%_1px] transition-[background-size] duration-500">
          {article.title}
        </span>
      </h3>
      <p className="text-[13px] leading-[1.7] text-site-gray line-clamp-2 mb-4">
        {article.excerpt}
      </p>
      <div className="text-[11px] tracking-wide text-site-gray">
        {article.author} <span className="mx-1.5">·</span> {article.date}
      </div>
    </Link>
  );
}
