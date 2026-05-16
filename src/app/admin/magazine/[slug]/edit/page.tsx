"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useMagazineStore } from "@/stores/magazine-store";
import { ArticleForm } from "@/components/admin/article-form";

export default function EditArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const article = useMagazineStore((s) => s.getBySlug(slug));

  if (!article) {
    return (
      <div className="bg-white border border-site-border p-7">
        <p className="text-site-gray-dark mb-4">Artikel tidak ditemukan.</p>
        <button
          onClick={() => router.push("/admin/magazine")}
          className="text-navy underline text-sm"
        >
          Kembali ke daftar artikel
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Link
        href="/admin/magazine"
        className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.12em] uppercase text-site-gray hover:text-navy"
      >
        <ChevronLeft size={14} strokeWidth={2} />
        Kembali ke Magazine
      </Link>
      <div>
        <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray mb-1">
          Edit · /{article.slug}
        </div>
        <h2 className="font-serif text-[34px] leading-tight text-navy">
          {article.title}
        </h2>
      </div>
      <ArticleForm mode="edit" article={article} />
    </div>
  );
}
