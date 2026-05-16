"use client";

import { useEffect, useState } from "react";
import { useSettingsStore } from "@/stores/settings-store";
import {
  SOCIAL_PLATFORM_META,
  type SocialLink,
  type SocialPlatform,
} from "@/types/settings";
import { SectionShell } from "./section-shell";

const PLATFORMS: SocialPlatform[] = [
  "instagram",
  "tiktok",
  "youtube",
  "twitter",
  "facebook",
];

function ensureAllPlatforms(links: SocialLink[]): SocialLink[] {
  return PLATFORMS.map(
    (p) => links.find((l) => l.platform === p) ?? { platform: p, url: "" },
  );
}

export function SocialSection({
  index,
  total,
}: {
  index: number;
  total: number;
}) {
  const social = useSettingsStore((s) => s.settings.social);
  const updateSocial = useSettingsStore((s) => s.updateSocial);
  const resetSection = useSettingsStore((s) => s.resetSection);

  const [draft, setDraft] = useState<SocialLink[]>(ensureAllPlatforms(social));
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    setDraft(ensureAllPlatforms(social));
  }, [social]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(ensureAllPlatforms(social));
  const activeCount = draft.filter((l) => l.url.trim().length > 0).length;

  const setUrl = (platform: SocialPlatform, url: string) => {
    setDraft((d) =>
      d.map((l) => (l.platform === platform ? { ...l, url } : l)),
    );
  };

  return (
    <SectionShell
      index={index}
      total={total}
      eyebrow="Brand · Social"
      title="Sosial Media"
      description="Hanya kanal dengan URL yang akan ditampilkan sebagai chip di footer storefront. Kosongkan URL untuk menyembunyikan."
      dirty={dirty}
      savedAt={savedAt}
      onSave={() => {
        updateSocial(
          draft.map((l) => ({ ...l, url: l.url.trim() })),
        );
        setSavedAt(Date.now());
      }}
      onReset={() => resetSection("social")}
      onDiscard={() => setDraft(ensureAllPlatforms(social))}
    >
      <div className="bg-white border border-site-border">
        <div className="grid grid-cols-[64px_140px_1fr_72px] items-center gap-5 px-5 py-2.5 bg-cream border-b border-site-border text-[10px] font-semibold tracking-[0.16em] uppercase text-site-gray">
          <span>Mark</span>
          <span>Platform</span>
          <span>URL</span>
          <span className="text-right">Status</span>
        </div>
        {draft.map((link) => {
          const meta = SOCIAL_PLATFORM_META[link.platform];
          const active = link.url.trim().length > 0;
          return (
            <div
              key={link.platform}
              className="grid grid-cols-[64px_140px_1fr_72px] items-center gap-5 px-5 py-3.5 border-b border-site-border last:border-b-0"
            >
              <div className="w-11 h-11 border-[1.5px] border-site-border bg-white text-navy flex items-center justify-center font-mono text-[12px] tracking-[0.18em] uppercase">
                {meta.abbr}
              </div>
              <div>
                <div className="font-serif text-[16px] text-navy leading-tight">
                  {meta.label}
                </div>
                <div className="text-[10.5px] text-site-gray mt-0.5 font-mono">
                  {meta.host}
                </div>
              </div>
              <input
                value={link.url}
                onChange={(e) => setUrl(link.platform, e.target.value)}
                placeholder={meta.placeholder}
                className="w-full px-3 py-2 border-[1.5px] border-site-border bg-white font-mono text-[12.5px] tracking-tight text-site-text outline-none focus:border-navy"
              />
              <div className="flex justify-end">
                <span
                  className={`inline-flex items-center gap-1.5 text-[10px] tracking-[0.16em] uppercase font-mono normal-case ${active ? "text-navy" : "text-site-gray-light"}`}
                >
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full ${active ? "bg-navy" : "bg-site-gray-light"}`}
                  />
                  {active ? "live" : "off"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-dashed border-site-border pt-6">
        <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray mb-3">
          Footer Strip · Preview
        </div>
        <div className="bg-[#0e0e10] text-white p-5 flex items-center justify-between gap-5">
          <div className="text-[10px] tracking-[0.18em] uppercase text-white/55 font-mono normal-case tracking-tight">
            {activeCount.toString().padStart(2, "0")} kanal aktif
          </div>
          <div className="flex gap-2">
            {draft
              .filter((l) => l.url.trim())
              .map((l) => (
                <div
                  key={l.platform}
                  className="w-9 h-9 border border-white/30 text-white/80 text-[11px] tracking-[0.16em] uppercase flex items-center justify-center"
                >
                  {SOCIAL_PLATFORM_META[l.platform].abbr}
                </div>
              ))}
            {activeCount === 0 && (
              <div className="text-[12px] italic text-white/40">
                Belum ada kanal terisi.
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
