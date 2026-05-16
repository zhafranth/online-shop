"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { useMagazineStore } from "@/stores/magazine-store";
import type { Article, MagazineCategory } from "@/types/magazine";

const CATEGORY_FILTERS: ({ label: string; value: "all" | MagazineCategory })[] = [
  { label: "Semua", value: "all" },
  { label: "Tips Mix & Match", value: "Tips Mix & Match" },
  { label: "Fashion News", value: "Fashion News" },
  { label: "Education", value: "Education" },
];

const CATEGORY_TONE: Record<MagazineCategory, string> = {
  "Tips Mix & Match": "border-navy text-navy",
  "Fashion News": "border-[#1a1a1a] text-[#1a1a1a]",
  Education: "border-site-gray-dark text-site-gray-dark",
};

export default function AdminMagazinePage() {
  const articles = useMagazineStore((s) => s.articles);
  const deleteArticle = useMagazineStore((s) => s.deleteArticle);
  const setFeatured = useMagazineStore((s) => s.setFeatured);

  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [filter, setFilter] = useState<"all" | MagazineCategory>("all");
  const [toDelete, setToDelete] = useState<Article | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim().toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      if (filter !== "all" && a.category !== filter) return false;
      if (debounced && !a.title.toLowerCase().includes(debounced)) return false;
      return true;
    });
  }, [articles, filter, debounced]);

  const stats = useMemo(() => {
    const byCategory = articles.reduce<Record<string, number>>((acc, a) => {
      acc[a.category] = (acc[a.category] ?? 0) + 1;
      return acc;
    }, {});
    const featured = articles.find((a) => a.featured);
    return { total: articles.length, byCategory, featured };
  }, [articles]);

  const confirmDelete = () => {
    if (toDelete) deleteArticle(toDelete.slug);
    setToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* ─── HEADER ─── */}
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3 text-[10px] tracking-[0.22em] uppercase text-site-gray">
            <span>Content</span>
            <span className="h-px w-6 bg-site-border" />
            <span className="font-mono normal-case tracking-tight">
              Issue 01–{String(stats.total).padStart(2, "0")}
            </span>
          </div>
          <h2 className="font-serif text-[34px] leading-tight mt-2 text-navy">
            Magazine
          </h2>
          <p className="text-[13px] text-site-gray mt-1.5 max-w-xl leading-relaxed">
            Editorial untuk storefront. Tulis, sunting, dan atur artikel yang
            tampil di halaman magazine + home. Satu artikel dapat diangkat
            sebagai featured story.
          </p>
        </div>

        <Link href="/admin/magazine/new">
          <Button variant="primary" className="flex items-center gap-2">
            <Plus size={15} strokeWidth={2} />
            Tambah Artikel
          </Button>
        </Link>
      </header>

      {/* ─── INSIGHT STRIP ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 bg-white border border-site-border">
        {[
          { k: "Total Artikel", v: String(stats.total).padStart(2, "0") },
          {
            k: "Tips Mix & Match",
            v: String(stats.byCategory["Tips Mix & Match"] ?? 0).padStart(2, "0"),
          },
          {
            k: "Fashion News",
            v: String(stats.byCategory["Fashion News"] ?? 0).padStart(2, "0"),
          },
          {
            k: "Education",
            v: String(stats.byCategory["Education"] ?? 0).padStart(2, "0"),
          },
        ].map((s, i) => (
          <div
            key={s.k}
            className={`px-6 py-5 ${i > 0 ? "md:border-l border-site-border" : ""}`}
          >
            <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray">
              {s.k}
            </div>
            <div className="font-serif text-[30px] leading-none mt-2 text-navy tabular-nums">
              {s.v}
            </div>
          </div>
        ))}
      </div>

      {/* ─── FILTERS ─── */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {CATEGORY_FILTERS.map((f) => {
            const active = filter === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={`px-3 py-1.5 text-[11px] tracking-[0.12em] uppercase border-[1.5px] transition-colors ${
                  active
                    ? "border-navy bg-navy text-white"
                    : "border-site-border bg-white text-site-gray-dark hover:border-navy"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
        <div className="relative w-full md:w-[280px]">
          <Search
            size={13}
            strokeWidth={1.8}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-site-gray-light"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul artikel..."
            className="w-full pl-9 pr-3 py-2.5 border-[1.5px] border-site-border bg-white font-sans text-[13px] text-site-text outline-none focus:border-navy"
          />
        </div>
      </div>

      {/* ─── LEDGER ─── */}
      <div className="bg-white border border-site-border">
        <div className="grid grid-cols-[80px_1fr_140px_160px_120px_60px_88px] items-center gap-5 px-6 py-3 bg-cream border-b border-site-border text-[10px] font-semibold tracking-[0.16em] uppercase text-site-gray">
          <span>Cover</span>
          <span>Judul</span>
          <span>Kategori</span>
          <span>Author</span>
          <span>Tanggal</span>
          <span className="text-center">Featured</span>
          <span className="text-right">Aksi</span>
        </div>

        {filtered.length === 0 && (
          <div className="px-6 py-16 text-center">
            <div className="font-serif italic text-[22px] text-site-gray-light mb-1">
              {articles.length === 0
                ? "No articles in the archive."
                : "Tidak ada artikel yang cocok."}
            </div>
            <p className="text-[13px] text-site-gray mb-5">
              {articles.length === 0
                ? "Mulai dengan menambah artikel pertama."
                : "Ubah filter atau kata kunci pencarian."}
            </p>
            {articles.length === 0 && (
              <Link href="/admin/magazine/new">
                <Button variant="primary" size="sm">
                  + Tambah Artikel
                </Button>
              </Link>
            )}
          </div>
        )}

        {filtered.map((a) => (
          <div
            key={a.slug}
            className="grid grid-cols-[80px_1fr_140px_160px_120px_60px_88px] items-center gap-5 px-6 py-4 border-b border-site-border last:border-b-0 hover:bg-cream/40 transition-colors"
          >
            {/* Cover */}
            <div className="w-[64px] h-[80px] bg-cream border border-site-border overflow-hidden">
              {a.cover ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={a.cover}
                  alt={a.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full" />
              )}
            </div>

            {/* Title */}
            <div className="min-w-0">
              <Link
                href={`/admin/magazine/${a.slug}/edit`}
                className="font-serif text-[16px] leading-tight text-navy hover:underline line-clamp-2"
              >
                {a.title}
              </Link>
              <p className="text-[11px] text-site-gray mt-1 font-mono tracking-tight truncate">
                /magazine/{a.slug}
              </p>
            </div>

            {/* Category badge */}
            <div>
              <span
                className={`inline-flex items-center px-2 py-1 border-[1.5px] text-[10px] tracking-[0.14em] uppercase font-medium ${CATEGORY_TONE[a.category]}`}
              >
                {a.category}
              </span>
            </div>

            {/* Author */}
            <div className="min-w-0">
              <p className="text-[13px] text-site-text truncate">{a.author}</p>
              <p className="text-[11px] text-site-gray truncate">
                {a.readTime} menit baca
              </p>
            </div>

            {/* Date */}
            <div className="text-[12.5px] text-site-text font-mono tabular-nums tracking-tight">
              {a.date}
            </div>

            {/* Featured */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setFeatured(a.slug)}
                aria-label={
                  a.featured
                    ? "Featured article"
                    : `Set ${a.title} as featured`
                }
                className={`p-1.5 rounded-sm transition-colors ${
                  a.featured
                    ? "text-navy"
                    : "text-site-gray-light hover:text-navy"
                }`}
              >
                <Star
                  size={16}
                  strokeWidth={1.6}
                  className={a.featured ? "fill-navy" : ""}
                />
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-1">
              <Link
                href={`/admin/magazine/${a.slug}/edit`}
                aria-label={`Edit ${a.title}`}
                className="p-2 text-navy hover:bg-cream rounded-sm"
              >
                <Pencil size={15} strokeWidth={1.8} />
              </Link>
              <button
                type="button"
                onClick={() => setToDelete(a)}
                aria-label={`Hapus ${a.title}`}
                className="p-2 text-[#b91c1c] hover:bg-[#fee2e2] rounded-sm"
              >
                <Trash2 size={15} strokeWidth={1.8} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length > 0 && (
        <div className="flex items-center justify-between gap-5 px-1 pt-2 text-[11px] text-site-gray">
          <div className="flex items-center gap-2 font-mono">
            {stats.featured ? (
              <>
                <Star size={11} strokeWidth={1.8} className="text-navy fill-navy" />
                Featured: {stats.featured.title}
              </>
            ) : (
              <>
                <Star size={11} strokeWidth={1.8} className="text-site-gray-light" />
                Belum ada featured article.
              </>
            )}
          </div>
          <div className="font-mono tracking-tight">
            {filtered.length} / {articles.length} entri
          </div>
        </div>
      )}

      <ConfirmModal
        open={toDelete !== null}
        title="Hapus Artikel"
        message={`Yakin ingin menghapus "${toDelete?.title}"? Artikel akan hilang dari /magazine dan home.`}
        confirmLabel="Hapus"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
