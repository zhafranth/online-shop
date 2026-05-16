"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MembershipHero } from "@/components/membership/membership-hero";
import { useMembershipStore } from "@/stores/membership-store";
import {
  MEMBERSHIP_STATUS_LABEL,
  type MembershipProgram,
  type MembershipStatus,
} from "@/types/membership";

interface MembershipFormProps {
  program: MembershipProgram;
}

const STATUS_OPTIONS: { value: MembershipStatus; hint: string }[] = [
  {
    value: "active",
    hint: "Tampil di navbar dengan CTA pendaftaran (Fase 2).",
  },
  {
    value: "coming-soon",
    hint: "Tampil di navbar, banner 'Coming Soon'.",
  },
  {
    value: "inactive",
    hint: "Sembunyikan dari navbar & halaman publik (404).",
  },
];

export function MembershipForm({ program }: MembershipFormProps) {
  const router = useRouter();
  const updateProgram = useMembershipStore((s) => s.updateProgram);

  const [eyebrow, setEyebrow] = useState(program.eyebrow);
  const [title, setTitle] = useState(program.title);
  const [titleAccent, setTitleAccent] = useState(program.titleAccent);
  const [description, setDescription] = useState(program.description);
  const [image, setImage] = useState(program.image);
  const [imageCaption, setImageCaption] = useState(program.imageCaption ?? "");
  const [bannerText, setBannerText] = useState(program.bannerText);
  const [status, setStatus] = useState<MembershipStatus>(program.status);
  const [error, setError] = useState("");
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedEyebrow = eyebrow.trim();
    const trimmedTitle = title.trim();
    const trimmedAccent = titleAccent.trim();
    const trimmedDescription = description.trim();
    const trimmedImage = image.trim();
    const trimmedCaption = imageCaption.trim();
    const trimmedBanner = bannerText.trim();

    if (trimmedEyebrow.length === 0 || trimmedEyebrow.length > 30)
      return setError("Eyebrow wajib, maks 30 karakter.");
    if (trimmedTitle.length < 2 || trimmedTitle.length > 40)
      return setError("Title harus 2–40 karakter.");
    if (trimmedAccent.length < 2 || trimmedAccent.length > 40)
      return setError("Title Accent harus 2–40 karakter.");
    if (trimmedDescription.length < 30 || trimmedDescription.length > 500)
      return setError("Description harus 30–500 karakter.");
    if (!trimmedImage) return setError("URL image wajib diisi.");
    try {
      const u = new URL(trimmedImage);
      if (!/^https?:$/.test(u.protocol)) throw new Error();
    } catch {
      return setError("URL image tidak valid (harus http/https).");
    }
    if (trimmedCaption.length > 60)
      return setError("Image caption maksimal 60 karakter.");
    if (trimmedBanner.length < 5 || trimmedBanner.length > 80)
      return setError("Banner text harus 5–80 karakter.");

    updateProgram(program.id, {
      eyebrow: trimmedEyebrow,
      title: trimmedTitle,
      titleAccent: trimmedAccent,
      description: trimmedDescription,
      image: trimmedImage,
      imageCaption: trimmedCaption || undefined,
      bannerText: trimmedBanner,
      status,
    });
    setSavedAt(Date.now());
  };

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6"
    >
      {/* ─── FORM COLUMN ─── */}
      <div className="bg-white border border-site-border">
        <div className="px-7 pt-7 pb-5 border-b border-site-border">
          <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray mb-1">
            Program · /{program.id}
          </div>
          <h3 className="font-serif text-[26px] leading-tight">
            {title || "Untitled"}{" "}
            <span className="italic text-site-gray-dark/80">
              {titleAccent}
            </span>
          </h3>
        </div>

        <div className="px-7 py-7 space-y-7">
          {/* EYEBROW */}
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
              Eyebrow
            </label>
            <input
              value={eyebrow}
              onChange={(e) => setEyebrow(e.target.value)}
              maxLength={30}
              placeholder="Membership"
              className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-sans text-sm text-site-text outline-none focus:border-navy"
            />
            <div className="mt-1.5 flex justify-between text-[11px] text-site-gray">
              <span>Label kecil di atas judul.</span>
              <span className="tabular-nums">{eyebrow.length}/30</span>
            </div>
          </div>

          {/* TITLE + ACCENT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={40}
                placeholder="Program"
                className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-serif text-[16px] text-site-text outline-none focus:border-navy"
              />
              <div className="mt-1.5 flex justify-between text-[11px] text-site-gray">
                <span>Baris atas judul hero.</span>
                <span className="tabular-nums">{title.length}/40</span>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                Title Accent <span className="font-normal normal-case tracking-normal text-site-gray-light">(italic)</span>
              </label>
              <input
                value={titleAccent}
                onChange={(e) => setTitleAccent(e.target.value)}
                maxLength={40}
                placeholder="Agent"
                className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-serif italic text-[16px] text-site-text outline-none focus:border-navy"
              />
              <div className="mt-1.5 flex justify-between text-[11px] text-site-gray">
                <span>Baris kedua, italic.</span>
                <span className="tabular-nums">{titleAccent.length}/40</span>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              maxLength={500}
              placeholder="Deskripsi singkat program (30–500 karakter)."
              className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-sans text-sm text-site-text outline-none focus:border-navy leading-relaxed resize-y"
            />
            <div className="mt-1.5 flex justify-between text-[11px] text-site-gray">
              <span>30–500 karakter — paragraf utama di hero.</span>
              <span className="tabular-nums">{description.length}/500</span>
            </div>
          </div>

          {/* IMAGE + CAPTION */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-5">
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                Image URL
              </label>
              <input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-mono text-[12px] tracking-tight text-site-text outline-none focus:border-navy"
              />
              <p className="mt-1.5 text-[11px] text-site-gray">
                Hostname harus di-allowlist di <code className="font-mono">next.config.ts</code>.
              </p>
            </div>
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                Image Caption
              </label>
              <input
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                maxLength={60}
                placeholder="Atelier · Jakarta Selatan"
                className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-serif italic text-sm text-site-text outline-none focus:border-navy"
              />
              <div className="mt-1.5 flex justify-between text-[11px] text-site-gray">
                <span>Opsional</span>
                <span className="tabular-nums">{imageCaption.length}/60</span>
              </div>
            </div>
          </div>

          {/* BANNER TEXT */}
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
              Banner Text
            </label>
            <input
              value={bannerText}
              onChange={(e) => setBannerText(e.target.value)}
              maxLength={80}
              placeholder="Program Agent · Segera Hadir · 2026"
              className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-sans text-sm tracking-[0.12em] uppercase text-site-text outline-none focus:border-navy"
            />
            <div className="mt-1.5 flex justify-between text-[11px] text-site-gray">
              <span>Teks ticker hitam di bawah hero.</span>
              <span className="tabular-nums">{bannerText.length}/80</span>
            </div>
          </div>

          {/* STATUS */}
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-3">
              Status
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {STATUS_OPTIONS.map((opt) => {
                const active = status === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStatus(opt.value)}
                    className={`text-left px-4 py-3 border-[1.5px] transition-colors ${
                      active
                        ? "border-navy bg-navy text-white"
                        : "border-site-border bg-white text-site-text hover:border-navy"
                    }`}
                  >
                    <div className="text-[11px] tracking-[0.14em] uppercase font-medium mb-1">
                      {MEMBERSHIP_STATUS_LABEL[opt.value]}
                    </div>
                    <p
                      className={`text-[11.5px] leading-snug ${
                        active ? "text-white/75" : "text-site-gray"
                      }`}
                    >
                      {opt.hint}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="px-3.5 py-2.5 text-[13px] bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]">
              {error}
            </div>
          )}

          {savedAt && !error && (
            <div className="px-3.5 py-2.5 text-[13px] bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0]">
              Perubahan tersimpan.
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="submit">Simpan Perubahan</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/membership")}
            >
              Kembali
            </Button>
          </div>
        </div>
      </div>

      {/* ─── PREVIEW COLUMN ─── */}
      <aside className="xl:sticky xl:top-8 self-start space-y-4">
        <div className="bg-[#0e0e10] text-white p-5 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/[0.02]" />
          <div className="absolute bottom-3 right-4 text-white/10 select-none">
            <Crown size={96} strokeWidth={1} />
          </div>
          <div className="relative">
            <div className="text-[10px] tracking-[0.22em] uppercase text-white/45 mb-1">
              Live Preview
            </div>
            <div className="font-serif text-[22px] leading-tight">
              Hero Card
            </div>
            <p className="text-[11.5px] text-white/55 mt-1.5 leading-relaxed">
              Versi mini dari hero storefront. Perubahan tampil real-time.
            </p>
          </div>
        </div>

        <div className="border border-site-border bg-white overflow-hidden">
          <div className="aspect-[3/4] sm:aspect-[16/10] bg-cream relative">
            {image ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={image}
                alt={`${title} ${titleAccent}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[11px] text-site-gray-light font-mono">
                no image
              </div>
            )}
            {imageCaption && (
              <div className="absolute bottom-3 left-3 text-[10px] italic font-serif text-white mix-blend-difference">
                {imageCaption}
              </div>
            )}
          </div>
          <div className="p-5">
            <div className="text-[9px] tracking-[0.32em] uppercase text-site-gray font-medium mb-2 flex items-center gap-2">
              <span className="inline-block w-6 h-px bg-site-text" />
              {eyebrow || "—"}
            </div>
            <h4 className="font-serif text-[22px] leading-tight">
              {title || "—"}
            </h4>
            {titleAccent && (
              <h4 className="font-serif italic text-[22px] leading-tight text-site-gray-dark/80">
                {titleAccent}
              </h4>
            )}
            <p className="text-[12px] text-site-gray-dark/75 mt-3 leading-relaxed line-clamp-4">
              {description || "—"}
            </p>
          </div>
          <div className="bg-site-text text-white px-5 py-2.5 text-[10px] tracking-[0.22em] uppercase font-medium overflow-hidden whitespace-nowrap">
            {bannerText || "—"}
          </div>
        </div>
      </aside>
    </form>
  );
}
