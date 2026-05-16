"use client";

import { useEffect, useState } from "react";
import { MapPin, Phone, MessageCircle, Mail, Clock } from "lucide-react";
import { useSettingsStore } from "@/stores/settings-store";
import {
  Field,
  SectionShell,
  inputClass,
  textareaClass,
} from "./section-shell";

export function ContactSection({
  index,
  total,
}: {
  index: number;
  total: number;
}) {
  const contact = useSettingsStore((s) => s.settings.contact);
  const updateContact = useSettingsStore((s) => s.updateContact);
  const resetSection = useSettingsStore((s) => s.resetSection);

  const [draft, setDraft] = useState(contact);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    setDraft(contact);
  }, [contact]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(contact);

  return (
    <SectionShell
      index={index}
      total={total}
      eyebrow="Brand · Contact"
      title="Kontak & Lokasi"
      description="Detail kontak resmi yang muncul di footer dan halaman bantuan."
      dirty={dirty}
      savedAt={savedAt}
      onSave={() => {
        updateContact(draft);
        setSavedAt(Date.now());
      }}
      onReset={() => resetSection("contact")}
      onDiscard={() => setDraft(contact)}
    >
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
        <Field
          label="Alamat"
          hint="Tampil di footer & halaman kontak."
          count={{ current: draft.address.length, max: 200 }}
        >
          <textarea
            value={draft.address}
            onChange={(e) =>
              setDraft((d) => ({ ...d, address: e.target.value }))
            }
            rows={3}
            maxLength={200}
            className={textareaClass}
          />
        </Field>
        <Field label="Kota" count={{ current: draft.city.length, max: 30 }}>
          <input
            value={draft.city}
            onChange={(e) => setDraft((d) => ({ ...d, city: e.target.value }))}
            maxLength={30}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Telepon" hint="Format internasional, mis. +62 22 …">
          <input
            value={draft.phone}
            onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
            className={inputClass}
            placeholder="+62 22 1234 5678"
          />
        </Field>
        <Field label="WhatsApp" hint="Nomor untuk fast-response customer service.">
          <input
            value={draft.whatsapp}
            onChange={(e) =>
              setDraft((d) => ({ ...d, whatsapp: e.target.value }))
            }
            className={inputClass}
            placeholder="+62 812 3456 7890"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field
          label="Email Customer Service"
          hint="Format email valid. Tampil di footer dan auto-mailto."
        >
          <input
            type="email"
            value={draft.emailCs}
            onChange={(e) =>
              setDraft((d) => ({ ...d, emailCs: e.target.value }))
            }
            className={inputClass}
            placeholder="halo@thickapparel.id"
          />
        </Field>
        <Field
          label="Jam Operasional"
          count={{ current: draft.operationalHours.length, max: 100 }}
        >
          <input
            value={draft.operationalHours}
            onChange={(e) =>
              setDraft((d) => ({ ...d, operationalHours: e.target.value }))
            }
            maxLength={100}
            className={inputClass}
          />
        </Field>
      </div>

      {/* Editorial preview card */}
      <div className="border-t border-dashed border-site-border pt-6">
        <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray mb-3">
          Kartu Kontak
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 bg-cream border border-site-border">
          {[
            {
              icon: MapPin,
              k: "Alamat",
              v: `${draft.address}${draft.city ? `, ${draft.city}` : ""}`,
            },
            { icon: Phone, k: "Telepon", v: draft.phone },
            { icon: MessageCircle, k: "WhatsApp", v: draft.whatsapp },
            { icon: Mail, k: "Email CS", v: draft.emailCs },
            { icon: Clock, k: "Jam", v: draft.operationalHours },
          ].map((row, i) => {
            const Icon = row.icon;
            return (
              <div
                key={row.k}
                className={`px-4 py-4 ${i > 0 ? "md:border-l border-site-border" : ""}`}
              >
                <div className="flex items-center gap-1.5 text-[9.5px] tracking-[0.2em] uppercase text-site-gray mb-2">
                  <Icon size={11} strokeWidth={1.7} />
                  <span>{row.k}</span>
                </div>
                <div className="text-[12.5px] text-site-text leading-snug break-words">
                  {row.v || (
                    <span className="text-site-gray-light italic">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}
