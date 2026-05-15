"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Pencil,
  Plus,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { useCategoryStore } from "@/stores/category-store";
import { useProductStore } from "@/stores/product-store";
import type { ProductCategory } from "@/types/category";

export default function AdminCategoriesPage() {
  const categories = useCategoryStore((s) => s.categories);
  const updateCategory = useCategoryStore((s) => s.updateCategory);
  const deleteCategory = useCategoryStore((s) => s.deleteCategory);
  const moveUp = useCategoryStore((s) => s.moveUp);
  const moveDown = useCategoryStore((s) => s.moveDown);
  const products = useProductStore((s) => s.products);

  const [toDelete, setToDelete] = useState<ProductCategory | null>(null);
  const [blockedDelete, setBlockedDelete] = useState<{ category: ProductCategory; count: number } | null>(null);

  const sorted = useMemo(
    () => [...categories].sort((a, b) => a.order - b.order),
    [categories],
  );

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    products.forEach((p) => m.set(p.category, (m.get(p.category) ?? 0) + 1));
    return m;
  }, [products]);

  const activeCount = sorted.filter((c) => c.enabled).length;
  const taggedProducts = products.filter((p) => counts.get(p.category)).length;

  const requestDelete = (cat: ProductCategory) => {
    const count = counts.get(cat.id) ?? 0;
    if (count > 0) setBlockedDelete({ category: cat, count });
    else setToDelete(cat);
  };

  const confirmDelete = () => {
    if (toDelete) deleteCategory(toDelete.id);
    setToDelete(null);
  };

  const blockedProducts = blockedDelete
    ? products.filter((p) => p.category === blockedDelete.category.id).slice(0, 5)
    : [];

  return (
    <div className="space-y-6">
      {/* ─── HEADER ─── */}
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3 text-[10px] tracking-[0.22em] uppercase text-site-gray">
            <span>Catalog</span>
            <span className="h-px w-6 bg-site-border" />
            <span className="font-mono normal-case tracking-tight">
              Index 01–{String(sorted.length).padStart(2, "0")}
            </span>
          </div>
          <h2 className="font-serif text-[34px] leading-tight mt-2 text-navy">
            Kategori Produk
          </h2>
          <p className="text-[13px] text-site-gray mt-1.5 max-w-xl leading-relaxed">
            Daftar utama kategori yang dipakai katalog, navigasi, dan form produk.
            Atur ulang urutan untuk memprioritaskan koleksi musim ini.
          </p>
        </div>

        <Link href="/admin/categories/new">
          <Button variant="primary" className="flex items-center gap-2">
            <Plus size={15} strokeWidth={2} />
            Tambah Kategori
          </Button>
        </Link>
      </header>

      {/* ─── INSIGHT STRIP ─── */}
      <div className="grid grid-cols-3 bg-white border border-site-border">
        {[
          { k: "Total Kategori", v: sorted.length },
          { k: "Aktif", v: activeCount },
          { k: "Produk Terkurasi", v: taggedProducts },
        ].map((s, i) => (
          <div
            key={s.k}
            className={`px-6 py-5 ${i > 0 ? "border-l border-site-border" : ""}`}
          >
            <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray">
              {s.k}
            </div>
            <div className="font-serif text-[34px] leading-none mt-2 text-navy tabular-nums">
              {String(s.v).padStart(2, "0")}
            </div>
          </div>
        ))}
      </div>

      {/* ─── EDITORIAL LEDGER ─── */}
      <div className="bg-white border border-site-border">
        <div className="grid grid-cols-[60px_80px_1fr_120px_140px_88px] items-center gap-5 px-6 py-3 bg-cream border-b border-site-border text-[10px] font-semibold tracking-[0.16em] uppercase text-site-gray">
          <span>No.</span>
          <span>Cover</span>
          <span>Kategori</span>
          <span>Produk</span>
          <span>Status</span>
          <span className="text-right">Aksi</span>
        </div>

        {sorted.length === 0 && (
          <div className="px-6 py-12 text-center text-sm text-site-gray">
            Belum ada kategori. Klik "Tambah Kategori" untuk memulai.
          </div>
        )}

        {sorted.map((c, i) => {
          const count = counts.get(c.id) ?? 0;
          const isFirst = i === 0;
          const isLast = i === sorted.length - 1;
          return (
            <div
              key={c.id}
              className="group grid grid-cols-[60px_80px_1fr_120px_140px_88px] items-center gap-5 px-6 py-5 border-b border-site-border last:border-b-0 hover:bg-cream/40 transition-colors"
            >
              {/* No. + arrows */}
              <div className="flex items-center gap-1.5">
                <div className="flex flex-col text-site-gray-light">
                  <button
                    type="button"
                    onClick={() => moveUp(c.id)}
                    disabled={isFirst}
                    aria-label="Naikkan urutan"
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-navy disabled:hover:text-site-gray-light disabled:cursor-not-allowed leading-none"
                  >
                    <ChevronUp size={13} strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(c.id)}
                    disabled={isLast}
                    aria-label="Turunkan urutan"
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-navy disabled:hover:text-site-gray-light disabled:cursor-not-allowed leading-none"
                  >
                    <ChevronDown size={13} strokeWidth={2} />
                  </button>
                </div>
                <span className="font-serif italic text-[28px] leading-none tabular-nums text-site-gray-light">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Cover */}
              <div className="relative w-[64px] aspect-[3/4] bg-cream border border-site-border overflow-hidden">
                {c.coverImage ? (
                  <Image
                    src={c.coverImage}
                    alt={c.label}
                    fill
                    sizes="64px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-site-gray-light">
                    <ImageIcon size={18} strokeWidth={1.3} />
                  </div>
                )}
              </div>

              {/* Label / slug / description */}
              <div className="min-w-0">
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <h3 className="font-serif text-[19px] leading-tight text-navy">
                    {c.label}
                  </h3>
                  <span className="font-mono text-[11px] text-site-gray tracking-tight">
                    /{c.slug}
                  </span>
                </div>
                {c.description ? (
                  <p className="text-[12.5px] text-site-gray mt-1 leading-snug line-clamp-1">
                    {c.description}
                  </p>
                ) : (
                  <p className="text-[12px] text-site-gray-light italic mt-1">
                    Belum ada deskripsi
                  </p>
                )}
              </div>

              {/* Count */}
              <div>
                <div className="font-serif text-[20px] leading-none text-site-text tabular-nums">
                  {count}
                </div>
                <div className="text-[10.5px] tracking-[0.14em] uppercase text-site-gray mt-1">
                  produk
                </div>
              </div>

              {/* Status toggle */}
              <button
                type="button"
                onClick={() => updateCategory(c.id, { enabled: !c.enabled })}
                aria-pressed={c.enabled}
                className="flex items-center gap-2 group/toggle"
              >
                {c.enabled ? (
                  <ToggleRight size={28} strokeWidth={1.5} className="text-navy" />
                ) : (
                  <ToggleLeft size={28} strokeWidth={1.5} className="text-site-gray-light" />
                )}
                <span
                  className={`text-[10.5px] tracking-[0.14em] uppercase ${
                    c.enabled ? "text-site-text font-medium" : "text-site-gray"
                  }`}
                >
                  {c.enabled ? "Active" : "Hidden"}
                </span>
              </button>

              {/* Actions */}
              <div className="flex items-center justify-end gap-1">
                <Link
                  href={`/admin/categories/${c.id}/edit`}
                  aria-label={`Edit ${c.label}`}
                  className="p-2 text-navy hover:bg-cream rounded-sm"
                >
                  <Pencil size={15} strokeWidth={1.8} />
                </Link>
                <button
                  type="button"
                  onClick={() => requestDelete(c)}
                  aria-label={`Hapus ${c.label}`}
                  className="p-2 text-[#b91c1c] hover:bg-[#fee2e2] rounded-sm"
                >
                  <Trash2 size={15} strokeWidth={1.8} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmModal
        open={toDelete !== null}
        title="Hapus Kategori"
        message={`Yakin ingin menghapus kategori "${toDelete?.label}"? Aksi ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />

      {/* Blocked-delete modal */}
      {blockedDelete && (
        <div
          className="fixed inset-0 z-50 bg-navy-dark/60 flex items-center justify-center p-4"
          onClick={() => setBlockedDelete(null)}
        >
          <div
            className="bg-white w-full max-w-md p-7 border border-site-border shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-[10px] tracking-[0.22em] uppercase text-[#b91c1c] mb-1">
              Tidak bisa dihapus
            </div>
            <h3 className="font-serif text-[22px] text-navy mb-3 leading-tight">
              {blockedDelete.category.label} masih dipakai
            </h3>
            <p className="text-[13px] text-site-gray-dark mb-4 leading-relaxed">
              Ada{" "}
              <strong className="text-navy tabular-nums">
                {blockedDelete.count} produk
              </strong>{" "}
              yang masih ber-kategori ini. Pindahkan produk ke kategori lain
              terlebih dahulu sebelum menghapus.
            </p>
            <ul className="bg-cream border border-site-border divide-y divide-site-border mb-5">
              {blockedProducts.map((p) => (
                <li key={p.id} className="px-4 py-2.5 flex items-center justify-between text-[12.5px]">
                  <span className="font-medium text-site-text truncate pr-3">{p.name}</span>
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="shrink-0 text-[11px] tracking-[0.12em] uppercase text-navy hover:underline"
                  >
                    Ubah
                  </Link>
                </li>
              ))}
              {blockedDelete.count > blockedProducts.length && (
                <li className="px-4 py-2 text-[11.5px] text-site-gray italic">
                  + {blockedDelete.count - blockedProducts.length} produk lainnya
                </li>
              )}
            </ul>
            <div className="flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setBlockedDelete(null)}>
                Mengerti
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
