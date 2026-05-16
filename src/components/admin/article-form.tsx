"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  Heading2,
  ImageIcon,
  Pilcrow,
  Plus,
  Quote,
  Star,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMagazineStore } from "@/stores/magazine-store";
import {
  CATEGORY_TO_SLUG,
  type Article,
  type MagazineBlock,
  type MagazineCategory,
} from "@/types/magazine";

interface ArticleFormProps {
  mode: "create" | "edit";
  article?: Article;
}

const CATEGORIES: MagazineCategory[] = [
  "Tips Mix & Match",
  "Fashion News",
  "Education",
];

const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

const BLOCK_META: Record<
  MagazineBlock["type"],
  { label: string; icon: typeof Pilcrow; hint: string }
> = {
  paragraph: {
    label: "Paragraf",
    icon: Pilcrow,
    hint: "Teks tubuh utama. Drop cap otomatis di paragraf pertama.",
  },
  heading: {
    label: "Heading",
    icon: Heading2,
    hint: "Subjudul section, untuk memecah artikel jadi babak.",
  },
  image: {
    label: "Gambar",
    icon: ImageIcon,
    hint: "URL gambar (Unsplash atau hostname yang sudah di-allowlist).",
  },
  quote: {
    label: "Kutipan",
    icon: Quote,
    hint: "Kutipan tebal dengan atribusi opsional.",
  },
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function toDisplayDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function todayIso(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

const INDONESIAN_MONTHS = [
  "januari",
  "februari",
  "maret",
  "april",
  "mei",
  "juni",
  "juli",
  "agustus",
  "september",
  "oktober",
  "november",
  "desember",
];

function displayDateToIso(display: string): string {
  // Best-effort parse of "12 Mei 2026" → "2026-05-12". Falls back to today.
  const m = display.trim().match(/^(\d{1,2})\s+(\S+)\s+(\d{4})$/);
  if (!m) return todayIso();
  const day = Number(m[1]);
  const monthIdx = INDONESIAN_MONTHS.indexOf(m[2].toLowerCase());
  const year = Number(m[3]);
  if (monthIdx < 0) return todayIso();
  const iso = `${year}-${String(monthIdx + 1).padStart(2, "0")}-${String(
    day,
  ).padStart(2, "0")}`;
  return iso;
}

function emptyBlock(type: MagazineBlock["type"]): MagazineBlock {
  switch (type) {
    case "paragraph":
    case "heading":
      return { type, text: "" };
    case "image":
      return { type, src: "", caption: "" };
    case "quote":
      return { type, text: "", attribution: "" };
  }
}

export function ArticleForm({ mode, article }: ArticleFormProps) {
  const router = useRouter();
  const articles = useMagazineStore((s) => s.articles);
  const addArticle = useMagazineStore((s) => s.addArticle);
  const updateArticle = useMagazineStore((s) => s.updateArticle);

  const isEdit = mode === "edit" && article;

  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!article);
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [category, setCategory] = useState<MagazineCategory>(
    article?.category ?? "Fashion News",
  );
  const [cover, setCover] = useState(article?.cover ?? "");
  const [coverCaption, setCoverCaption] = useState(article?.coverCaption ?? "");
  const [author, setAuthor] = useState(article?.author ?? "");
  const [authorBio, setAuthorBio] = useState(article?.authorBio ?? "");
  const [dateIso, setDateIso] = useState(
    article ? displayDateToIso(article.date) : todayIso(),
  );
  const [readTime, setReadTime] = useState<number>(article?.readTime ?? 5);
  const [featured, setFeatured] = useState(article?.featured ?? false);
  const [blocks, setBlocks] = useState<MagazineBlock[]>(
    article?.body ?? [{ type: "paragraph", text: "" }],
  );
  const [error, setError] = useState("");

  const onTitleChange = (v: string) => {
    setTitle(v);
    if (!slugTouched && mode === "create") {
      setSlug(slugify(v));
    }
  };

  const onSlugChange = (v: string) => {
    setSlug(slugify(v));
    setSlugTouched(true);
  };

  const addBlock = (type: MagazineBlock["type"]) =>
    setBlocks((prev) => [...prev, emptyBlock(type)]);

  const removeBlock = (idx: number) =>
    setBlocks((prev) => prev.filter((_, i) => i !== idx));

  const moveBlock = (idx: number, dir: -1 | 1) =>
    setBlocks((prev) => {
      const target = idx + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });

  const updateBlock = (idx: number, patch: Partial<MagazineBlock>) =>
    setBlocks((prev) =>
      prev.map((b, i) => (i === idx ? { ...b, ...patch } : b)),
    );

  const cleanedBlocks = useMemo(
    () =>
      blocks
        .map((b) => {
          if (b.type === "paragraph" || b.type === "heading") {
            return { type: b.type, text: (b.text ?? "").trim() };
          }
          if (b.type === "image") {
            return {
              type: b.type,
              src: (b.src ?? "").trim(),
              caption: (b.caption ?? "").trim() || undefined,
            };
          }
          return {
            type: b.type,
            text: (b.text ?? "").trim(),
            attribution: (b.attribution ?? "").trim() || undefined,
          };
        })
        .filter((b) => {
          if (b.type === "image") return !!b.src;
          return !!b.text;
        }),
    [blocks],
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedTitle = title.trim();
    const trimmedSlug = slug.trim();
    const trimmedExcerpt = excerpt.trim();
    const trimmedCover = cover.trim();
    const trimmedAuthor = author.trim();
    const trimmedBio = authorBio.trim();

    if (trimmedTitle.length < 5 || trimmedTitle.length > 120)
      return setError("Judul harus 5–120 karakter.");
    if (!SLUG_PATTERN.test(trimmedSlug))
      return setError(
        "Slug hanya boleh huruf kecil, angka, dan tanda hubung (kebab-case).",
      );
    if (
      mode === "create" &&
      articles.some((a) => a.slug === trimmedSlug)
    )
      return setError(`Slug "${trimmedSlug}" sudah dipakai.`);
    if (trimmedExcerpt.length < 30 || trimmedExcerpt.length > 280)
      return setError("Excerpt harus 30–280 karakter.");
    if (!trimmedCover) return setError("URL cover wajib diisi.");
    if (trimmedAuthor.length < 2 || trimmedAuthor.length > 60)
      return setError("Nama author harus 2–60 karakter.");
    if (trimmedBio.length > 200)
      return setError("Bio author maksimal 200 karakter.");
    if (!dateIso) return setError("Tanggal wajib diisi.");
    if (!Number.isInteger(readTime) || readTime < 1 || readTime > 60)
      return setError("Read time harus 1–60 menit.");
    if (cleanedBlocks.length === 0)
      return setError("Minimal satu block isi.");

    const payload: Article = {
      slug: trimmedSlug,
      title: trimmedTitle,
      excerpt: trimmedExcerpt,
      category,
      categorySlug: CATEGORY_TO_SLUG[category],
      cover: trimmedCover,
      coverCaption: coverCaption.trim() || undefined,
      author: trimmedAuthor,
      authorBio: trimmedBio,
      date: toDisplayDate(dateIso),
      readTime,
      featured,
      body: cleanedBlocks,
    };

    if (mode === "create") addArticle(payload);
    else if (article) updateArticle(article.slug, payload);

    router.push("/admin/magazine");
  };

  const blockMetaSummary = blocks.reduce<Record<string, number>>((acc, b) => {
    acc[b.type] = (acc[b.type] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6"
    >
      {/* ─── FORM COLUMN ─── */}
      <div className="space-y-6">
        {/* META PANEL */}
        <div className="bg-white border border-site-border">
          <div className="px-7 pt-7 pb-5 border-b border-site-border">
            <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray mb-1">
              {mode === "create" ? "Artikel Baru" : "Edit Artikel"}
            </div>
            <h3 className="font-serif text-[26px] leading-tight">
              {title || (isEdit ? article.title : "Artikel tanpa judul")}
            </h3>
          </div>

          <div className="px-7 py-7 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                Judul
              </label>
              <input
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Capsule Wardrobe untuk Musim Hujan"
                maxLength={120}
                className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-serif text-[18px] text-site-text outline-none focus:border-navy"
              />
              <div className="mt-1.5 flex justify-between text-[11px] text-site-gray">
                <span>5–120 karakter</span>
                <span className="tabular-nums">{title.length}/120</span>
              </div>
            </div>

            {/* Slug */}
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                Slug
                {isEdit && (
                  <span className="ml-1.5 normal-case tracking-normal font-normal text-site-gray-light">
                    (read-only)
                  </span>
                )}
              </label>
              <div className="flex items-stretch border-[1.5px] border-site-border bg-white focus-within:border-navy">
                <span className="px-3 py-3 text-[11px] font-mono text-site-gray-light bg-cream border-r border-site-border tracking-tight">
                  /magazine/
                </span>
                <input
                  value={slug}
                  disabled={!!isEdit}
                  onChange={(e) => onSlugChange(e.target.value)}
                  placeholder="capsule-wardrobe-musim-hujan"
                  className="flex-1 px-3.5 py-3 bg-transparent font-mono text-[13px] text-site-text outline-none disabled:text-site-gray"
                />
              </div>
              <p className="mt-1.5 text-[11px] text-site-gray leading-relaxed">
                {isEdit
                  ? "Slug tidak bisa diubah karena dipakai URL aktif."
                  : "Otomatis dari judul. Edit untuk override sebelum simpan."}
              </p>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                Excerpt
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                maxLength={280}
                placeholder="Ringkasan singkat artikel untuk kartu di halaman magazine."
                className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-sans text-sm text-site-text outline-none focus:border-navy resize-y"
              />
              <div className="mt-1.5 flex justify-between text-[11px] text-site-gray">
                <span>30–280 karakter</span>
                <span className="tabular-nums">{excerpt.length}/280</span>
              </div>
            </div>

            {/* Cover */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_120px] gap-4">
              <div>
                <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                  URL Cover
                </label>
                <input
                  value={cover}
                  onChange={(e) => setCover(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-mono text-[12.5px] text-site-text outline-none focus:border-navy"
                />
                <p className="mt-1.5 text-[11px] text-site-gray">
                  Hostname harus diallowlist di next.config.ts.
                </p>
              </div>
              <div>
                <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                  Preview
                </label>
                <div className="aspect-[4/5] bg-cream border border-site-border overflow-hidden">
                  {cover ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={cover}
                      alt="cover"
                      className="w-full h-full object-cover"
                      onError={(e) =>
                        ((e.currentTarget as HTMLImageElement).style.opacity =
                          "0.2")
                      }
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] tracking-[0.18em] uppercase text-site-gray-light">
                      No cover
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cover caption */}
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                Cover Caption{" "}
                <span className="normal-case tracking-normal font-normal text-site-gray-light">
                  (opsional)
                </span>
              </label>
              <input
                value={coverCaption}
                onChange={(e) => setCoverCaption(e.target.value)}
                placeholder="Foto: Tania Wijaya · Lokasi: Senopati"
                className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-sans text-sm text-site-text outline-none focus:border-navy"
              />
            </div>

            {/* Category + date + readtime row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as MagazineCategory)
                  }
                  className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-sans text-sm text-site-text outline-none focus:border-navy"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                  Tanggal
                </label>
                <input
                  type="date"
                  value={dateIso}
                  onChange={(e) => setDateIso(e.target.value)}
                  className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-mono text-[13px] text-site-text outline-none focus:border-navy"
                />
                {dateIso && (
                  <p className="mt-1.5 text-[11px] text-site-gray">
                    Tampil: {toDisplayDate(dateIso)}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                  Read Time (menit)
                </label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={readTime}
                  onChange={(e) => setReadTime(Number(e.target.value))}
                  className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-mono text-[13px] text-site-text outline-none focus:border-navy"
                />
              </div>
            </div>

            {/* Author */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-5">
              <div>
                <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                  Author
                </label>
                <input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Andini Prameswari"
                  maxLength={60}
                  className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-sans text-sm text-site-text outline-none focus:border-navy"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                  Author Bio
                </label>
                <input
                  value={authorBio}
                  onChange={(e) => setAuthorBio(e.target.value)}
                  placeholder="Editor mode, minat khusus slow fashion."
                  maxLength={200}
                  className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-sans text-sm text-site-text outline-none focus:border-navy"
                />
                <p className="mt-1.5 text-[11px] text-site-gray tabular-nums text-right">
                  {authorBio.length}/200
                </p>
              </div>
            </div>

            {/* Featured */}
            <div className="flex items-center justify-between pt-2 border-t border-dashed border-site-border">
              <div>
                <div className="text-[13px] font-medium text-site-text flex items-center gap-2">
                  <Star
                    size={14}
                    strokeWidth={1.8}
                    className={featured ? "text-navy fill-navy" : "text-site-gray-light"}
                  />
                  Featured Article
                </div>
                <div className="text-[11px] text-site-gray mt-0.5">
                  Tampil di hero `/magazine` & home. Hanya satu artikel boleh
                  featured pada satu waktu.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFeatured((v) => !v)}
                aria-pressed={featured}
                className={`shrink-0 px-3 py-1.5 border-[1.5px] text-[11px] tracking-[0.12em] uppercase transition-colors ${
                  featured
                    ? "border-navy bg-navy text-white"
                    : "border-site-border text-site-gray-dark hover:border-navy"
                }`}
              >
                {featured ? "Featured" : "Set Featured"}
              </button>
            </div>
          </div>
        </div>

        {/* BLOCKS PANEL */}
        <div className="bg-white border border-site-border">
          <div className="px-7 pt-7 pb-5 border-b border-site-border flex items-end justify-between gap-4">
            <div>
              <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray mb-1">
                Tubuh Artikel
              </div>
              <h3 className="font-serif text-[22px] leading-tight">
                Body Blocks
              </h3>
              <p className="text-[12px] text-site-gray mt-1.5">
                {blocks.length} block
                {blocks.length !== 1 ? "s" : ""} ·{" "}
                {Object.entries(blockMetaSummary)
                  .map(([k, v]) => `${v} ${k}`)
                  .join(" · ") || "kosong"}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(BLOCK_META) as MagazineBlock["type"][]).map((t) => {
                const Icon = BLOCK_META[t].icon;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => addBlock(t)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border-[1.5px] border-site-border text-[11px] tracking-[0.1em] uppercase text-site-gray-dark hover:border-navy hover:text-navy transition-colors"
                  >
                    <Icon size={12} strokeWidth={1.8} />
                    {BLOCK_META[t].label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="px-7 py-7 space-y-4">
            {blocks.length === 0 && (
              <div className="bg-cream border border-dashed border-site-border px-5 py-10 text-center">
                <div className="font-serif italic text-[18px] text-site-gray-light mb-1">
                  No blocks yet.
                </div>
                <p className="text-[12px] text-site-gray">
                  Tambah block untuk mulai menulis.
                </p>
              </div>
            )}

            {blocks.map((b, idx) => {
              const Meta = BLOCK_META[b.type];
              const Icon = Meta.icon;
              const isFirst = idx === 0;
              const isLast = idx === blocks.length - 1;

              return (
                <div
                  key={idx}
                  className="bg-cream border border-site-border"
                >
                  <div className="flex items-center justify-between px-4 py-2 border-b border-site-border">
                    <div className="flex items-center gap-2 text-[10px] tracking-[0.16em] uppercase text-site-gray">
                      <span className="font-serif not-italic text-[16px] text-navy normal-case tracking-tight tabular-nums">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="h-px w-3 bg-site-border" />
                      <Icon size={12} strokeWidth={1.8} />
                      <span>{Meta.label}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveBlock(idx, -1)}
                        disabled={isFirst}
                        aria-label="Naikkan"
                        className="p-1 text-site-gray hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronUp size={13} strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlock(idx, 1)}
                        disabled={isLast}
                        aria-label="Turunkan"
                        className="p-1 text-site-gray hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronDown size={13} strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeBlock(idx)}
                        aria-label="Hapus block"
                        className="p-1 text-[#b91c1c] hover:bg-[#fee2e2] rounded-sm"
                      >
                        <Trash2 size={13} strokeWidth={1.8} />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    {(b.type === "paragraph" || b.type === "heading") && (
                      <textarea
                        value={b.text ?? ""}
                        onChange={(e) =>
                          updateBlock(idx, { text: e.target.value })
                        }
                        rows={b.type === "heading" ? 1 : 4}
                        placeholder={
                          b.type === "heading"
                            ? "Subjudul section"
                            : "Tulis paragraf di sini..."
                        }
                        className={`w-full px-3 py-2 border border-site-border bg-white outline-none focus:border-navy resize-y ${
                          b.type === "heading"
                            ? "font-serif text-[18px] text-site-text"
                            : "font-sans text-[13.5px] leading-[1.7] text-site-text"
                        }`}
                      />
                    )}

                    {b.type === "image" && (
                      <>
                        <input
                          value={b.src ?? ""}
                          onChange={(e) =>
                            updateBlock(idx, { src: e.target.value })
                          }
                          placeholder="https://images.unsplash.com/photo-..."
                          className="w-full px-3 py-2 border border-site-border bg-white font-mono text-[12px] outline-none focus:border-navy"
                        />
                        <input
                          value={b.caption ?? ""}
                          onChange={(e) =>
                            updateBlock(idx, { caption: e.target.value })
                          }
                          placeholder="Caption (opsional)"
                          className="w-full px-3 py-2 border border-site-border bg-white font-sans text-[13px] italic outline-none focus:border-navy"
                        />
                        {b.src && (
                          <div className="bg-white border border-site-border p-1.5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={b.src}
                              alt=""
                              className="w-full h-40 object-cover"
                              onError={(e) =>
                                ((e.currentTarget as HTMLImageElement).style.opacity =
                                  "0.2")
                              }
                            />
                          </div>
                        )}
                      </>
                    )}

                    {b.type === "quote" && (
                      <>
                        <textarea
                          value={b.text ?? ""}
                          onChange={(e) =>
                            updateBlock(idx, { text: e.target.value })
                          }
                          rows={2}
                          placeholder="Kalimat kutipan"
                          className="w-full px-3 py-2 border border-site-border bg-white font-serif italic text-[15px] outline-none focus:border-navy resize-y"
                        />
                        <input
                          value={b.attribution ?? ""}
                          onChange={(e) =>
                            updateBlock(idx, { attribution: e.target.value })
                          }
                          placeholder="Atribusi (opsional, mis. nama tokoh)"
                          className="w-full px-3 py-2 border border-site-border bg-white font-sans text-[12.5px] outline-none focus:border-navy"
                        />
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="px-3.5 py-2.5 text-[13px] bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button type="submit">
            {mode === "create" ? "Tambah Artikel" : "Simpan Perubahan"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/magazine")}
          >
            Batal
          </Button>
        </div>
      </div>

      {/* ─── PREVIEW COLUMN ─── */}
      <aside className="space-y-4 lg:sticky lg:top-8 self-start">
        <div className="bg-[#0e0e10] text-white p-5 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/[0.02]" />
          <div className="relative">
            <div className="text-[10px] tracking-[0.22em] uppercase text-white/45 mb-1">
              Story Card Preview
            </div>
            <div className="font-serif text-[22px] leading-tight">
              {title || "Judul artikel"}
            </div>
            <p className="text-[11.5px] text-white/55 mt-1.5 leading-relaxed line-clamp-3">
              {excerpt || "Excerpt akan muncul di kartu storefront."}
            </p>
          </div>
        </div>

        <div className="bg-white border border-site-border overflow-hidden">
          <div className="aspect-[4/5] bg-cream relative">
            {cover ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={cover} alt="cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[11px] tracking-[0.18em] uppercase text-site-gray-light">
                No cover
              </div>
            )}
            {featured && (
              <div className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 bg-navy text-white text-[9px] tracking-[0.16em] uppercase">
                <Star size={9} strokeWidth={2} className="fill-white" />
                Featured
              </div>
            )}
          </div>
          <div className="p-4 space-y-2">
            <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray font-medium">
              {category}
            </div>
            <h4 className="font-serif text-[17px] leading-tight">
              {title || "Judul artikel"}
            </h4>
            <p className="text-[12px] text-site-gray line-clamp-2 leading-snug">
              {excerpt || "Excerpt..."}
            </p>
            <div className="text-[11px] text-site-gray pt-1 border-t border-site-border/60">
              {author || "Author"} · {dateIso ? toDisplayDate(dateIso) : "—"} ·{" "}
              {readTime} menit
            </div>
          </div>
        </div>

        <div className="bg-cream border border-site-border p-4 text-[11px] text-site-gray leading-relaxed">
          <p className="font-medium text-site-text mb-1">Tips</p>
          Block pertama bertipe paragraf akan otomatis mendapat drop cap besar di
          halaman detail. Tambah image block setelah 2–3 paragraf untuk ritme
          visual.
        </div>
      </aside>
    </form>
  );
}
