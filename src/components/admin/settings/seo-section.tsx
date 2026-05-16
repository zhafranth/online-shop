"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSettingsStore } from "@/stores/settings-store";
import {
  Field,
  SectionShell,
  inputClass,
  textareaClass,
} from "./section-shell";

const isUrl = (s: string) => /^https?:\/\//i.test(s);

export function SeoSection({
  index,
  total,
}: {
  index: number;
  total: number;
}) {
  const seo = useSettingsStore((s) => s.settings.seo);
  const updateSeo = useSettingsStore((s) => s.updateSeo);
  const resetSection = useSettingsStore((s) => s.resetSection);

  const [draft, setDraft] = useState(seo);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    setDraft(seo);
  }, [seo]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(seo);

  const titleScore =
    draft.metaTitle.length === 0
      ? "kosong"
      : draft.metaTitle.length < 10
        ? "terlalu pendek"
        : draft.metaTitle.length > 60
          ? "terlalu panjang"
          : "ideal";

  const descScore =
    draft.metaDescription.length === 0
      ? "kosong"
      : draft.metaDescription.length < 50
        ? "terlalu pendek"
        : draft.metaDescription.length > 160
          ? "terlalu panjang"
          : "ideal";

  return (
    <SectionShell
      index={index}
      total={total}
      eyebrow="Discoverability · SEO"
      title="Search & Open Graph"
      description="Default meta untuk halaman utama, social share, dan canonical URL. Halaman per-konten boleh override."
      dirty={dirty}
      savedAt={savedAt}
      onSave={() => {
        updateSeo(draft);
        setSavedAt(Date.now());
      }}
      onReset={() => resetSection("seo")}
      onDiscard={() => setDraft(seo)}
    >
      <Field
        label="Meta Title"
        hint="Tampil di tab browser & SERP. Sweet-spot 50–60 karakter."
        count={{ current: draft.metaTitle.length, max: 70 }}
        required
      >
        <input
          value={draft.metaTitle}
          onChange={(e) =>
            setDraft((d) => ({ ...d, metaTitle: e.target.value }))
          }
          maxLength={70}
          className={inputClass}
        />
      </Field>

      <Field
        label="Meta Description"
        hint="Snippet di hasil pencarian. Sweet-spot 120–160 karakter."
        count={{ current: draft.metaDescription.length, max: 200 }}
        required
      >
        <textarea
          value={draft.metaDescription}
          onChange={(e) =>
            setDraft((d) => ({ ...d, metaDescription: e.target.value }))
          }
          rows={3}
          maxLength={200}
          className={textareaClass}
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="OG Image URL" hint="1200×630 disarankan (Facebook/X cards).">
          <input
            value={draft.ogImage}
            onChange={(e) =>
              setDraft((d) => ({ ...d, ogImage: e.target.value }))
            }
            className={inputClass}
            placeholder="https://..."
          />
        </Field>
        <Field label="Site URL (canonical)" hint="Alamat produksi tanpa trailing slash.">
          <input
            value={draft.siteUrl}
            onChange={(e) =>
              setDraft((d) => ({ ...d, siteUrl: e.target.value }))
            }
            className={inputClass}
            placeholder="https://thickapparel.id"
          />
        </Field>
      </div>

      {/* SERP Preview — Google-style */}
      <div className="border-t border-dashed border-site-border pt-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div>
          <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray mb-3">
            SERP Preview
          </div>
          <div className="bg-white border border-site-border p-5">
            <div className="text-[11px] text-site-gray font-mono mb-1.5 truncate">
              {draft.siteUrl || "https://thickapparel.id"}
            </div>
            <div className="font-serif text-[20px] leading-tight text-[#1a0dab] mb-1">
              {draft.metaTitle || "Meta title kosong"}
            </div>
            <p className="text-[13px] text-site-gray leading-relaxed line-clamp-2">
              {draft.metaDescription || (
                <span className="italic text-site-gray-light">
                  Meta description kosong.
                </span>
              )}
            </p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[10.5px] tracking-[0.16em] uppercase font-mono normal-case tracking-tight">
            <div className="bg-cream border border-site-border px-3 py-2 flex items-center justify-between">
              <span className="text-site-gray">Title</span>
              <span
                className={`${titleScore === "ideal" ? "text-navy" : "text-[#b45309]"}`}
              >
                {titleScore}
              </span>
            </div>
            <div className="bg-cream border border-site-border px-3 py-2 flex items-center justify-between">
              <span className="text-site-gray">Description</span>
              <span
                className={`${descScore === "ideal" ? "text-navy" : "text-[#b45309]"}`}
              >
                {descScore}
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray mb-3">
            OG Card
          </div>
          <div className="bg-white border border-site-border overflow-hidden">
            <div className="relative w-full aspect-[1200/630] bg-cream">
              {isUrl(draft.ogImage) ? (
                <Image
                  src={draft.ogImage}
                  alt="OG"
                  fill
                  sizes="320px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-site-gray-light text-[11px] font-mono">
                  No image
                </div>
              )}
            </div>
            <div className="px-3.5 py-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-site-gray mb-1 font-mono normal-case tracking-tight truncate">
                {draft.siteUrl || "thickapparel.id"}
              </div>
              <div className="font-serif text-[15px] leading-tight line-clamp-2">
                {draft.metaTitle || "Meta title"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
