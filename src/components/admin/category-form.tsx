"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowUpRight, Image as ImageIcon, ToggleLeft, ToggleRight } from "lucide-react";
import type { ProductCategory } from "@/types/category";
import { Button } from "@/components/ui/button";
import { useCategoryStore } from "@/stores/category-store";
import { useProductStore } from "@/stores/product-store";

interface CategoryFormProps {
  mode: "create" | "edit";
  category?: ProductCategory;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const ID_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

export function CategoryForm({ mode, category }: CategoryFormProps) {
  const router = useRouter();
  const categories = useCategoryStore((s) => s.categories);
  const addCategory = useCategoryStore((s) => s.addCategory);
  const updateCategory = useCategoryStore((s) => s.updateCategory);
  const products = useProductStore((s) => s.products);

  const isEdit = mode === "edit" && category;

  const [id, setId] = useState(category?.id ?? "");
  const [label, setLabel] = useState(category?.label ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState(category?.description ?? "");
  const [coverImage, setCoverImage] = useState(category?.coverImage ?? "");
  const [enabled, setEnabled] = useState(category?.enabled ?? true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode === "create" && !slugTouched) setSlug(slugify(id));
  }, [id, mode, slugTouched]);

  const productCount = useMemo(
    () => products.filter((p) => p.category === (category?.id ?? id)).length,
    [products, category, id],
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedId = id.trim();
    const trimmedLabel = label.trim();
    const trimmedSlug = (slug || trimmedId).trim();

    if (!trimmedId) return setError("ID kategori wajib diisi.");
    if (!ID_PATTERN.test(trimmedId)) {
      return setError("ID hanya boleh huruf kecil, angka, dan tanda hubung (kebab-case).");
    }
    if (trimmedLabel.length < 2 || trimmedLabel.length > 30) {
      return setError("Label harus 2–30 karakter.");
    }
    if (!ID_PATTERN.test(trimmedSlug)) {
      return setError("Slug harus kebab-case (huruf kecil, angka, tanda hubung).");
    }
    if (description.length > 200) return setError("Deskripsi maksimum 200 karakter.");

    if (mode === "create" && categories.some((c) => c.id === trimmedId)) {
      return setError(`ID "${trimmedId}" sudah dipakai. Gunakan ID unik.`);
    }
    if (categories.some((c) => c.slug === trimmedSlug && c.id !== (category?.id ?? trimmedId))) {
      return setError(`Slug "${trimmedSlug}" sudah dipakai.`);
    }

    const payload: ProductCategory = {
      id: trimmedId,
      label: trimmedLabel,
      slug: trimmedSlug,
      description: description.trim() || undefined,
      coverImage: coverImage.trim() || undefined,
      enabled,
      order:
        category?.order ??
        (categories.length > 0 ? Math.max(...categories.map((c) => c.order)) + 1 : 1),
    };

    if (mode === "create") addCategory(payload);
    else if (category) updateCategory(category.id, payload);

    router.push("/admin/categories");
  };

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
      {/* ─── FORM COLUMN ─── */}
      <div className="bg-white border border-site-border">
        <div className="px-7 pt-7 pb-5 border-b border-site-border">
          <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray mb-1">
            {mode === "create" ? "Kategori Baru" : "Edit Kategori"}
          </div>
          <h3 className="font-serif text-[26px] leading-tight">
            {label || (isEdit ? category.label : "Tanpa nama")}
          </h3>
        </div>

        <div className="px-7 py-7 space-y-6">
          {/* ID + Slug pair */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                Identifier
                <span className="ml-1.5 normal-case tracking-normal font-normal text-site-gray-light">
                  (immutable)
                </span>
              </label>
              <input
                value={id}
                disabled={isEdit ? true : false}
                onChange={(e) => setId(slugify(e.target.value))}
                placeholder="e.g. anak, sport"
                className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-mono text-[13px] tracking-tight text-site-text outline-none focus:border-navy disabled:bg-cream disabled:text-site-gray"
              />
              <p className="mt-1.5 text-[11px] text-site-gray leading-relaxed">
                Auto-generated dari label. Hanya huruf kecil, angka, dan tanda hubung.
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                Slug URL
              </label>
              <div className="flex items-center border-[1.5px] border-site-border bg-white focus-within:border-navy">
                <span className="pl-3.5 pr-2 text-[12px] text-site-gray font-mono select-none">
                  /catalog?cat=
                </span>
                <input
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(slugify(e.target.value));
                  }}
                  placeholder="men"
                  className="flex-1 py-3 pr-3.5 font-mono text-[13px] tracking-tight text-site-text outline-none bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Label */}
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
              Label Tampilan
            </label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Men"
              required
              maxLength={30}
              className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-sans text-sm text-site-text outline-none focus:border-navy"
            />
            <div className="mt-1.5 flex justify-between text-[11px] text-site-gray">
              <span>2–30 karakter. Ini yang muncul di filter & navigasi storefront.</span>
              <span className="tabular-nums">{label.length}/30</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
              Deskripsi <span className="ml-1.5 normal-case tracking-normal text-site-gray-light">(opsional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={200}
              placeholder="Singkat saja — ini muncul sebagai subtitle di banner kategori."
              className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-sans text-sm text-site-text outline-none focus:border-navy resize-y"
            />
            <div className="mt-1.5 flex justify-end text-[11px] text-site-gray tabular-nums">
              {description.length}/200
            </div>
          </div>

          {/* Cover image */}
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
              Cover Image URL <span className="ml-1.5 normal-case tracking-normal text-site-gray-light">(opsional)</span>
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-mono text-[12px] text-site-text outline-none focus:border-navy"
            />
            <p className="mt-1.5 text-[11px] text-site-gray">
              Hostname harus di-allowlist di <code className="font-mono">next.config.ts</code>.
            </p>
          </div>

          {/* Enabled */}
          <div className="flex items-center justify-between pt-2 border-t border-dashed border-site-border">
            <div>
              <div className="text-[13px] font-medium text-site-text">Status Aktif</div>
              <div className="text-[11px] text-site-gray mt-0.5">
                Saat dinonaktifkan, kategori tidak muncul di filter & navigasi tapi produknya tetap ada.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEnabled((v) => !v)}
              className="shrink-0 flex items-center gap-2 text-site-text"
              aria-pressed={enabled}
            >
              {enabled ? (
                <ToggleRight size={32} strokeWidth={1.5} className="text-navy" />
              ) : (
                <ToggleLeft size={32} strokeWidth={1.5} className="text-site-gray-light" />
              )}
              <span className="text-[11px] tracking-[0.12em] uppercase text-site-gray w-12">
                {enabled ? "Active" : "Hidden"}
              </span>
            </button>
          </div>

          {error && (
            <div className="px-3.5 py-2.5 text-[13px] bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="submit">{mode === "create" ? "Tambah Kategori" : "Simpan Perubahan"}</Button>
            <Button type="button" variant="outline" onClick={() => router.push("/admin/categories")}>
              Batal
            </Button>
          </div>
        </div>
      </div>

      {/* ─── PREVIEW COLUMN ─── */}
      <aside className="space-y-4 lg:sticky lg:top-8 self-start">
        <div className="bg-[#0e0e10] text-white p-5 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/[0.02]" />
          <div className="absolute bottom-4 right-4 text-white/10 font-serif text-[80px] leading-none select-none">
            01
          </div>
          <div className="relative">
            <div className="text-[10px] tracking-[0.22em] uppercase text-white/45 mb-1">
              Live Preview
            </div>
            <div className="font-serif text-[22px] leading-tight">Storefront Look</div>
            <p className="text-[11.5px] text-white/55 mt-1.5 leading-relaxed">
              Begini cara kategori ini muncul di sisi pelanggan.
            </p>
          </div>
        </div>

        {/* Banner card preview */}
        <div className="relative aspect-[4/5] overflow-hidden border border-site-border bg-cream">
          {coverImage ? (
            <Image
              src={coverImage}
              alt="Cover preview"
              fill
              sizes="360px"
              className="object-cover"
              onError={() => {}}
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-site-gray">
                <ImageIcon size={28} strokeWidth={1.2} className="mx-auto mb-2 opacity-50" />
                <div className="text-[10.5px] tracking-[0.2em] uppercase">no cover</div>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <div className="text-[10px] tracking-[0.24em] uppercase text-white/75 mb-1.5">
              Koleksi
            </div>
            <div className="font-serif text-[28px] leading-[1.05]">
              {label || "—"}
            </div>
            {description && (
              <p className="text-[12px] text-white/75 mt-2 leading-snug line-clamp-2">
                {description}
              </p>
            )}
          </div>
          {!enabled && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-white/95 text-[9px] font-semibold tracking-[0.18em] uppercase">
              Hidden
            </div>
          )}
        </div>

        {/* Filter chip preview */}
        <div className="bg-white border border-site-border p-4">
          <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray mb-3">
            Catalog Filter
          </div>
          <div className="flex items-center justify-between py-2 border-b border-site-border">
            <span className="font-sans text-[13.5px] font-semibold text-navy">
              {label || "Kategori"}
            </span>
            <span className="text-[11px] text-site-gray tabular-nums">
              {productCount}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-site-gray font-mono">
            <ArrowUpRight size={11} />
            <span className="truncate">/catalog?cat={slug || id || "—"}</span>
          </div>
        </div>
      </aside>
    </form>
  );
}
