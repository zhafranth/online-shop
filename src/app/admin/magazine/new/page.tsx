"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ArticleForm } from "@/components/admin/article-form";

export default function NewArticlePage() {
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
          New Entry
        </div>
        <h2 className="font-serif text-[34px] leading-tight text-navy">
          Tambah Artikel
        </h2>
      </div>
      <ArticleForm mode="create" />
    </div>
  );
}
