"use client";

import { useEffect, useState } from "react";
import { ToggleLeft, ToggleRight, Construction } from "lucide-react";
import { useSettingsStore } from "@/stores/settings-store";
import {
  Field,
  SectionShell,
  inputClass,
  textareaClass,
} from "./section-shell";

export function MaintenanceSection({
  index,
  total,
}: {
  index: number;
  total: number;
}) {
  const maintenance = useSettingsStore((s) => s.settings.maintenance);
  const setMaintenance = useSettingsStore((s) => s.setMaintenance);
  const resetSection = useSettingsStore((s) => s.resetSection);

  const [draft, setDraft] = useState(maintenance);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    setDraft(maintenance);
  }, [maintenance]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(maintenance);

  return (
    <SectionShell
      index={index}
      total={total}
      eyebrow="Operations · Mode"
      title="Maintenance Mode"
      description="Saat aktif, seluruh storefront publik diganti dengan halaman maintenance. Admin tetap bisa login bila opsi 'Allow Admin' menyala."
      dirty={dirty}
      savedAt={savedAt}
      onSave={() => {
        setMaintenance(draft);
        setSavedAt(Date.now());
      }}
      onReset={() => resetSection("maintenance")}
      onDiscard={() => setDraft(maintenance)}
    >
      {/* Big status toggle card */}
      <div
        className={`relative overflow-hidden border-[1.5px] transition-colors ${
          draft.enabled
            ? "border-[#b91c1c] bg-[#fef2f2]"
            : "border-site-border bg-white"
        }`}
      >
        <div className="absolute -right-6 -bottom-8 opacity-[0.07]">
          <Construction
            size={180}
            strokeWidth={1.2}
            className={draft.enabled ? "text-[#7f1d1d]" : "text-navy"}
          />
        </div>
        <div className="relative px-6 py-6 flex items-center justify-between gap-6">
          <div>
            <div
              className={`text-[10px] tracking-[0.22em] uppercase mb-1 ${draft.enabled ? "text-[#7f1d1d]" : "text-site-gray"}`}
            >
              Status
            </div>
            <div
              className={`font-serif text-[28px] leading-tight ${draft.enabled ? "text-[#7f1d1d]" : "text-navy"}`}
            >
              {draft.enabled ? "Storefront sedang OFF" : "Storefront LIVE"}
            </div>
            <p
              className={`mt-1.5 text-[12.5px] leading-relaxed max-w-md ${draft.enabled ? "text-[#7f1d1d]/85" : "text-site-gray"}`}
            >
              {draft.enabled
                ? "Pelanggan akan melihat halaman maintenance. Admin masih bisa akses /admin saat 'Allow Admin' aktif."
                : "Pelanggan dapat berbelanja seperti biasa. Aktifkan saat ada perawatan besar."}
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setDraft((d) => ({ ...d, enabled: !d.enabled }))
            }
            aria-pressed={draft.enabled}
            className="shrink-0 flex flex-col items-center gap-1.5"
          >
            {draft.enabled ? (
              <ToggleRight
                size={56}
                strokeWidth={1.4}
                className="text-[#b91c1c]"
              />
            ) : (
              <ToggleLeft
                size={56}
                strokeWidth={1.4}
                className="text-site-gray-light"
              />
            )}
            <span className="text-[10px] tracking-[0.18em] uppercase font-medium">
              {draft.enabled ? "On" : "Off"}
            </span>
          </button>
        </div>
      </div>

      <Field
        label="Pesan Maintenance"
        hint="Naskah utama yang muncul di halaman maintenance."
        count={{ current: draft.message.length, max: 300 }}
        required
      >
        <textarea
          value={draft.message}
          onChange={(e) => setDraft((d) => ({ ...d, message: e.target.value }))}
          rows={3}
          maxLength={300}
          className={textareaClass}
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field
          label="Estimasi Selesai"
          hint="Opsional. Tampil sebagai countdown / waktu kembali."
        >
          <input
            type="datetime-local"
            value={draft.eta}
            onChange={(e) => setDraft((d) => ({ ...d, eta: e.target.value }))}
            className={inputClass}
          />
        </Field>
        <Field
          label="Allow Admin"
          hint="Saat aktif, /admin/* tetap dapat diakses meskipun storefront mati."
        >
          <button
            type="button"
            onClick={() =>
              setDraft((d) => ({ ...d, allowAdmin: !d.allowAdmin }))
            }
            aria-pressed={draft.allowAdmin}
            className="w-full px-4 py-3 border-[1.5px] border-site-border bg-white flex items-center justify-between hover:border-navy transition-colors"
          >
            <span className="text-[13px] text-site-text">
              {draft.allowAdmin
                ? "Admin bisa akses dashboard"
                : "Semua route mati (termasuk admin)"}
            </span>
            {draft.allowAdmin ? (
              <ToggleRight size={28} strokeWidth={1.5} className="text-navy" />
            ) : (
              <ToggleLeft
                size={28}
                strokeWidth={1.5}
                className="text-site-gray-light"
              />
            )}
          </button>
        </Field>
      </div>

      {/* Maintenance preview */}
      <div className="border-t border-dashed border-site-border pt-6">
        <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray mb-3">
          Preview Halaman Maintenance
        </div>
        <div className="bg-cream border border-site-border p-10 min-h-[260px] flex flex-col items-center justify-center text-center">
          <div className="text-[10px] tracking-[0.32em] uppercase text-site-gray mb-3">
            Sedang Berbenah
          </div>
          <h2 className="font-serif text-[36px] leading-tight text-navy max-w-xl">
            ThickApparel
          </h2>
          <p className="text-[13.5px] text-site-gray mt-3 max-w-md leading-relaxed">
            {draft.message || "Pesan maintenance akan muncul di sini."}
          </p>
          {draft.eta && (
            <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-site-border text-[11px] font-mono tracking-tight text-site-gray-dark">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-navy animate-pulse" />
              ETA{" "}
              {new Date(draft.eta).toLocaleString("id-ID", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </div>
          )}
        </div>
      </div>
    </SectionShell>
  );
}
