"use client";

import { useEffect, useState } from "react";
import { useSettingsStore } from "@/stores/settings-store";
import {
  Field,
  SectionShell,
  inputClass,
  textareaClass,
} from "./section-shell";

export function FooterSection({
  index,
  total,
}: {
  index: number;
  total: number;
}) {
  const footer = useSettingsStore((s) => s.settings.footer);
  const updateFooter = useSettingsStore((s) => s.updateFooter);
  const resetSection = useSettingsStore((s) => s.resetSection);

  const [draft, setDraft] = useState(footer);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    setDraft(footer);
  }, [footer]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(footer);

  return (
    <SectionShell
      index={index}
      total={total}
      eyebrow="Layout · Footer"
      title="Footer Storefront"
      description="Naskah footer: about copy, judul newsletter, dan baris hak cipta."
      dirty={dirty}
      savedAt={savedAt}
      onSave={() => {
        updateFooter(draft);
        setSavedAt(Date.now());
      }}
      onReset={() => resetSection("footer")}
      onDiscard={() => setDraft(footer)}
    >
      <Field
        label="About Text"
        hint="Paragraf ringkas yang muncul di kolom kiri footer."
        count={{ current: draft.aboutText.length, max: 500 }}
        required
      >
        <textarea
          value={draft.aboutText}
          onChange={(e) =>
            setDraft((d) => ({ ...d, aboutText: e.target.value }))
          }
          rows={4}
          minLength={30}
          maxLength={500}
          className={textareaClass}
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field
          label="Newsletter Heading"
          count={{ current: draft.newsletterHeading.length, max: 60 }}
        >
          <input
            value={draft.newsletterHeading}
            onChange={(e) =>
              setDraft((d) => ({ ...d, newsletterHeading: e.target.value }))
            }
            maxLength={60}
            className={inputClass}
          />
        </Field>
        <Field
          label="Copyright Line"
          count={{ current: draft.copyright.length, max: 100 }}
        >
          <input
            value={draft.copyright}
            onChange={(e) =>
              setDraft((d) => ({ ...d, copyright: e.target.value }))
            }
            maxLength={100}
            className={inputClass}
          />
        </Field>
      </div>

      {/* Mini footer preview */}
      <div className="border-t border-dashed border-site-border pt-6">
        <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray mb-3">
          Mini Footer Preview
        </div>
        <div className="bg-cream border border-site-border p-6">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
            <div>
              <div className="font-serif text-[18px] tracking-[0.18em] uppercase text-site-text mb-3">
                ThickApparel
              </div>
              <p className="text-[12px] leading-[1.85] text-site-gray max-w-xs">
                {draft.aboutText || (
                  <span className="italic text-site-gray-light">
                    Naskah About kosong.
                  </span>
                )}
              </p>
            </div>
            <div>
              <div className="text-[10px] font-semibold tracking-[0.16em] uppercase text-site-text mb-3">
                {draft.newsletterHeading || "Newsletter"}
              </div>
              <div className="flex">
                <div className="flex-1 px-3 py-2 bg-white border border-site-border text-[11px] text-site-gray-light italic">
                  email kamu
                </div>
                <div className="px-3 py-2 bg-site-text text-white text-[11px] tracking-[0.12em] uppercase">
                  →
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-site-border text-[11px] text-site-gray font-mono normal-case tracking-tight">
            {draft.copyright || (
              <span className="italic text-site-gray-light">
                Copyright kosong.
              </span>
            )}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
