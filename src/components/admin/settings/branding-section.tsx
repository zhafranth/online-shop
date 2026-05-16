"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSettingsStore } from "@/stores/settings-store";
import {
  Field,
  SectionShell,
  inputClass,
} from "./section-shell";

const isUrl = (s: string) => /^https?:\/\//i.test(s);

export function BrandingSection({
  index,
  total,
}: {
  index: number;
  total: number;
}) {
  const branding = useSettingsStore((s) => s.settings.branding);
  const updateBranding = useSettingsStore((s) => s.updateBranding);
  const resetSection = useSettingsStore((s) => s.resetSection);

  const [draft, setDraft] = useState(branding);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    setDraft(branding);
  }, [branding]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(branding);

  return (
    <SectionShell
      index={index}
      total={total}
      eyebrow="Brand · Identity"
      title="Identitas Brand"
      description="Nama, tagline, dan aset visual yang muncul di navbar, footer, dan tab browser. Logo & favicon menerima URL gambar."
      dirty={dirty}
      savedAt={savedAt}
      onSave={() => {
        updateBranding(draft);
        setSavedAt(Date.now());
      }}
      onReset={() => resetSection("branding")}
      onDiscard={() => setDraft(branding)}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field
          label="Brand Name"
          hint="Tampil di navbar dan footer dalam huruf serif kapital."
          count={{ current: draft.brandName.length, max: 30 }}
          required
        >
          <input
            value={draft.brandName}
            onChange={(e) =>
              setDraft((d) => ({ ...d, brandName: e.target.value }))
            }
            maxLength={30}
            className={inputClass}
            placeholder="ThickApparel"
          />
        </Field>

        <Field
          label="Tagline"
          hint="Subtitle pendek di bawah identitas brand."
          count={{ current: draft.tagline.length, max: 60 }}
        >
          <input
            value={draft.tagline}
            onChange={(e) =>
              setDraft((d) => ({ ...d, tagline: e.target.value }))
            }
            maxLength={60}
            className={inputClass}
            placeholder="Mode terpilih untuk semua"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Logo URL" hint="Opsional. Kosongkan untuk pakai wordmark teks.">
          <input
            value={draft.logoUrl}
            onChange={(e) =>
              setDraft((d) => ({ ...d, logoUrl: e.target.value }))
            }
            className={inputClass}
            placeholder="https://..."
          />
        </Field>
        <Field label="Favicon URL" hint="Disarankan PNG 32×32 atau .ico.">
          <input
            value={draft.faviconUrl}
            onChange={(e) =>
              setDraft((d) => ({ ...d, faviconUrl: e.target.value }))
            }
            className={inputClass}
            placeholder="https://..."
          />
        </Field>
      </div>

      {/* Live Preview Strip */}
      <div className="border-t border-dashed border-site-border pt-6">
        <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray mb-3">
          Live Preview
        </div>
        <div className="bg-cream border border-site-border">
          <div className="flex items-center gap-4 px-5 py-4 border-b border-site-border">
            <div className="relative w-10 h-10 bg-white border border-site-border flex items-center justify-center overflow-hidden shrink-0">
              {isUrl(draft.logoUrl) ? (
                <Image
                  src={draft.logoUrl}
                  alt={draft.brandName}
                  fill
                  sizes="40px"
                  className="object-contain p-1.5"
                  unoptimized
                />
              ) : (
                <span className="font-serif text-[18px] font-semibold text-navy leading-none">
                  {draft.brandName.charAt(0) || "T"}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <div className="font-serif text-[18px] tracking-[0.18em] uppercase text-site-text leading-tight truncate">
                {draft.brandName || "Brand"}
              </div>
              <div className="text-[11.5px] text-site-gray leading-tight mt-0.5 truncate">
                {draft.tagline || "Tagline brand"}
              </div>
            </div>
          </div>
          <div className="px-5 py-3 flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase text-site-gray">
            <div className="relative w-4 h-4 border border-site-border bg-white flex items-center justify-center overflow-hidden">
              {isUrl(draft.faviconUrl) ? (
                <Image
                  src={draft.faviconUrl}
                  alt="favicon"
                  fill
                  sizes="16px"
                  className="object-contain"
                  unoptimized
                />
              ) : (
                <span className="text-[8px] text-site-gray-light font-mono">
                  ico
                </span>
              )}
            </div>
            <span className="font-mono normal-case tracking-tight text-site-gray-dark truncate">
              {draft.brandName || "ThickApparel"} — tab title
            </span>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
