"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toast } from "@/components/ui/toast";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { ArticleCard } from "@/components/magazine/article-card";
import { useMagazineStore } from "@/stores/magazine-store";
import { MagazineBlock, CATEGORY_TO_SLUG } from "@/types/magazine";

function BodyBlock({
  block,
  isFirstParagraph,
}: {
  block: MagazineBlock;
  isFirstParagraph: boolean;
}) {
  if (block.type === "paragraph") {
    if (isFirstParagraph && block.text) {
      const first = block.text.charAt(0);
      const rest = block.text.slice(1);
      return (
        <p className="font-serif text-[18px] md:text-[19px] leading-[1.8] text-site-text/90 mb-6">
          <span className="float-left font-serif text-[64px] md:text-[72px] leading-[0.85] mr-2.5 mt-1.5 text-site-text">
            {first}
          </span>
          {rest}
        </p>
      );
    }
    return (
      <p className="font-serif text-[18px] md:text-[19px] leading-[1.8] text-site-text/90 mb-6">
        {block.text}
      </p>
    );
  }

  if (block.type === "heading") {
    return (
      <h2 className="font-serif text-[26px] md:text-[30px] leading-[1.2] mt-12 mb-5">
        {block.text}
      </h2>
    );
  }

  if (block.type === "image" && block.src) {
    return (
      <figure className="my-12 -mx-4 md:-mx-12 lg:-mx-20">
        <div className="aspect-[16/9] overflow-hidden bg-cream">
          <PlaceholderImage
            src={block.src}
            alt={block.caption ?? ""}
            className="w-full h-full"
            sizes="(max-width: 1024px) 100vw, 900px"
          />
        </div>
        {block.caption && (
          <figcaption className="mt-3 text-[12px] italic font-serif text-site-gray text-center">
            {block.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  if (block.type === "quote") {
    return (
      <blockquote className="my-12 -mx-2 md:-mx-6 pl-6 md:pl-8 border-l-2 border-site-text">
        <p className="font-serif italic text-[26px] md:text-[30px] leading-[1.35] text-site-text">
          “{block.text}”
        </p>
        {block.attribution && (
          <cite className="block not-italic text-[11px] tracking-[0.18em] uppercase text-site-gray mt-4">
            — {block.attribution}
          </cite>
        )}
      </blockquote>
    );
  }

  return null;
}

export default function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const article = useMagazineStore((s) => s.getBySlug(slug));
  const related = useMagazineStore((s) => s.getRelated(slug, 3));

  if (!article) {
    return (
      <div className="min-h-screen pt-[72px]">
        <Navbar />
        <div className="container-site py-24 text-center">
          <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray mb-3">
            404 · Magazine
          </div>
          <h1 className="font-serif text-[40px] md:text-[56px] leading-tight mb-4">
            Artikel tidak ditemukan
          </h1>
          <p className="text-[14px] text-site-gray mb-8">
            Artikel ini mungkin sudah dipindahkan atau dihapus.
          </p>
          <button
            onClick={() => router.push("/magazine")}
            className="text-[12px] tracking-[0.16em] uppercase border-b border-site-text pb-1 text-site-text hover:text-site-gray-dark"
          >
            Kembali ke Magazine
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  let firstParagraphSeen = false;

  return (
    <div className="min-h-screen pt-[72px] animate-fade-up">
      <Navbar />

      <article>
        {/* Header */}
        <header className="container-site pt-12 md:pt-20 pb-10 md:pb-14">
          <nav className="text-[11px] tracking-wide text-site-gray mb-10">
            <Link href="/magazine" className="hover:text-site-text no-underline text-site-gray">
              Magazine
            </Link>
            <span className="mx-2">›</span>
            <Link
              href={`/magazine?category=${CATEGORY_TO_SLUG[article.category]}`}
              className="hover:text-site-text no-underline text-site-gray"
            >
              {article.category}
            </Link>
          </nav>

          <div className="max-w-[760px]">
            <div className="text-[11px] tracking-[0.22em] uppercase text-site-text font-medium mb-6">
              {article.category}
            </div>
            <h1 className="font-serif text-[clamp(2.2rem,5.5vw,4.5rem)] leading-[1.05] tracking-tight mb-8">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] tracking-wide text-site-gray">
              <span>Oleh {article.author}</span>
              <span className="text-site-gray-light">·</span>
              <span>{article.date}</span>
              <span className="text-site-gray-light">·</span>
              <span>{article.readTime} menit baca</span>
            </div>
          </div>
        </header>

        {/* Hero image */}
        <figure className="container-site mb-14 md:mb-20">
          <div className="aspect-[21/9] overflow-hidden bg-cream">
            <PlaceholderImage
              src={article.cover}
              alt={article.title}
              className="w-full h-full"
              sizes="100vw"
              priority
            />
          </div>
          {article.coverCaption && (
            <figcaption className="mt-3 text-[12px] italic font-serif text-site-gray">
              {article.coverCaption}
            </figcaption>
          )}
        </figure>

        {/* Body */}
        <div className="container-site pb-16 md:pb-24">
          <div className="max-w-[720px] mx-auto">
            {article.body.map((block, i) => {
              const isFirst =
                block.type === "paragraph" && !firstParagraphSeen;
              if (isFirst) firstParagraphSeen = true;
              return (
                <BodyBlock
                  key={i}
                  block={block}
                  isFirstParagraph={isFirst}
                />
              );
            })}

            {/* Author bio */}
            <div className="mt-16 pt-10 pb-10 border-t border-b border-site-border flex gap-5 items-start">
              <div className="w-14 h-14 rounded-full bg-cream border border-site-border flex items-center justify-center shrink-0 font-serif text-[20px] text-site-text">
                {article.author.charAt(0)}
              </div>
              <div>
                <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray mb-2 font-medium">
                  Penulis
                </div>
                <div className="font-serif text-[20px] leading-tight mb-2">
                  {article.author}
                </div>
                <p className="text-[13px] leading-[1.7] text-site-gray max-w-[440px]">
                  {article.authorBio}
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-cream border-t border-site-border py-16 md:py-24">
          <div className="container-site">
            <div className="flex items-end justify-between mb-10 md:mb-14">
              <div>
                <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray font-medium mb-3">
                  Lanjutkan Membaca
                </div>
                <h2 className="font-serif text-[28px] md:text-[34px] leading-tight">
                  Cerita Lainnya
                </h2>
              </div>
              <Link
                href="/magazine"
                className="hidden sm:inline-block text-[11px] tracking-[0.16em] uppercase font-medium border-b border-site-text pb-1 no-underline text-site-text hover:text-site-gray-dark"
              >
                Semua Artikel
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-14">
              {related.map((item) => (
                <ArticleCard key={item.slug} article={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <Toast />
    </div>
  );
}
