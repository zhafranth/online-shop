"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { useSettingsStore } from "@/stores/settings-store";
import type { IntegrationMode } from "@/types/settings";
import { Field, SectionShell } from "./section-shell";

function maskKey(value: string) {
  if (!value) return "";
  if (value.length <= 8) return "•".repeat(value.length);
  return `${value.slice(0, 4)}${"•".repeat(Math.max(0, value.length - 8))}${value.slice(-4)}`;
}

interface SecretFieldProps {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
}

function SecretField({ label, hint, value, onChange }: SecretFieldProps) {
  const [reveal, setReveal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <Field label={label} hint={hint}>
      <div className="flex items-stretch gap-2">
        <input
          type={reveal ? "text" : "password"}
          value={reveal ? value : value ? maskKey(value) : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Tempel API key di sini…"
          className="flex-1 px-3.5 py-3 border-[1.5px] border-site-border bg-white font-mono text-[13px] tracking-tight text-site-text outline-none focus:border-navy"
        />
        <button
          type="button"
          onClick={() => setReveal((v) => !v)}
          aria-label={reveal ? "Sembunyikan" : "Tampilkan"}
          className="px-3 border-[1.5px] border-site-border bg-white text-site-gray-dark hover:border-navy hover:text-navy transition-colors"
        >
          {reveal ? <EyeOff size={15} strokeWidth={1.7} /> : <Eye size={15} strokeWidth={1.7} />}
        </button>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Salin"
          disabled={!value}
          className="px-3 border-[1.5px] border-site-border bg-white text-site-gray-dark hover:border-navy hover:text-navy transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {copied ? (
            <Check size={15} strokeWidth={1.8} className="text-navy" />
          ) : (
            <Copy size={15} strokeWidth={1.7} />
          )}
        </button>
      </div>
    </Field>
  );
}

interface ModePickerProps {
  value: IntegrationMode;
  onChange: (v: IntegrationMode) => void;
}

function ModePicker({ value, onChange }: ModePickerProps) {
  return (
    <div className="grid grid-cols-2 border-[1.5px] border-site-border bg-white">
      {(["mock", "live"] as const).map((m) => {
        const active = value === m;
        return (
          <button
            key={m}
            type="button"
            onClick={() => onChange(m)}
            className={`px-3 py-2.5 text-[10px] tracking-[0.18em] uppercase font-medium transition-colors ${
              active
                ? "bg-navy text-white"
                : "bg-white text-site-gray hover:text-navy"
            }`}
          >
            {m === "mock" ? "Mock / Sandbox" : "Live / Production"}
          </button>
        );
      })}
    </div>
  );
}

export function IntegrationsSection({
  index,
  total,
}: {
  index: number;
  total: number;
}) {
  const integrations = useSettingsStore((s) => s.settings.integrations);
  const updateIntegrations = useSettingsStore((s) => s.updateIntegrations);
  const resetSection = useSettingsStore((s) => s.resetSection);

  const [draft, setDraft] = useState(integrations);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    setDraft(integrations);
  }, [integrations]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(integrations);

  return (
    <SectionShell
      index={index}
      total={total}
      eyebrow="Operations · API"
      title="Integrasi & Kunci API"
      description="Kredensial integrasi pihak ketiga. Default mode adalah mock/sandbox; ubah ke live hanya saat backend siap."
      dirty={dirty}
      savedAt={savedAt}
      onSave={() => {
        updateIntegrations(draft);
        setSavedAt(Date.now());
      }}
      onReset={() => resetSection("integrations")}
      onDiscard={() => setDraft(integrations)}
    >
      {/* Disclaimer */}
      <div className="bg-[#fef7e6] border-[1.5px] border-[#f5c563] p-4 flex gap-3">
        <ShieldAlert
          size={18}
          strokeWidth={1.7}
          className="text-[#b45309] shrink-0 mt-0.5"
        />
        <div>
          <div className="text-[12.5px] font-semibold text-[#7a4500] mb-0.5">
            Prototype mode — kunci tersimpan di localStorage browser.
          </div>
          <p className="text-[12px] text-[#7a4500]/85 leading-relaxed">
            Bukan tempat aman untuk secret produksi. Saat backend dibangun,
            migrasikan ke server-side env (mis.{" "}
            <code className="font-mono text-[11.5px] bg-white/60 px-1 rounded">
              process.env.RAJA_ONGKIR_KEY
            </code>
            ).
          </p>
        </div>
      </div>

      {/* RajaOngkir block */}
      <div className="bg-white border border-site-border">
        <div className="px-5 py-3 bg-cream border-b border-site-border flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-site-gray">
            <span className="font-serif italic text-[18px] text-navy not-italic font-normal normal-case tracking-tight">
              01
            </span>
            <span className="h-px w-4 bg-site-border" />
            <span>RajaOngkir</span>
          </div>
          <span className="text-[10px] tracking-[0.16em] uppercase font-mono normal-case tracking-tight text-site-gray">
            shipping rates
          </span>
        </div>
        <div className="px-5 py-5 space-y-5">
          <SecretField
            label="API Key"
            hint="Didapat dari dashboard RajaOngkir."
            value={draft.rajaOngkirKey}
            onChange={(v) => setDraft((d) => ({ ...d, rajaOngkirKey: v }))}
          />
          <Field label="Mode">
            <ModePicker
              value={draft.rajaOngkirMode}
              onChange={(v) => setDraft((d) => ({ ...d, rajaOngkirMode: v }))}
            />
          </Field>
        </div>
      </div>

      {/* Payment Gateway block */}
      <div className="bg-white border border-site-border">
        <div className="px-5 py-3 bg-cream border-b border-site-border flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-site-gray">
            <span className="font-serif italic text-[18px] text-navy not-italic font-normal normal-case tracking-tight">
              02
            </span>
            <span className="h-px w-4 bg-site-border" />
            <span>Payment Gateway</span>
          </div>
          <span className="text-[10px] tracking-[0.16em] uppercase font-mono normal-case tracking-tight text-site-gray">
            checkout
          </span>
        </div>
        <div className="px-5 py-5 space-y-5">
          <SecretField
            label="Server Key"
            hint="Midtrans, Xendit, atau gateway pilihan kamu."
            value={draft.paymentGatewayKey}
            onChange={(v) =>
              setDraft((d) => ({ ...d, paymentGatewayKey: v }))
            }
          />
          <Field label="Mode">
            <ModePicker
              value={draft.paymentGatewayMode}
              onChange={(v) =>
                setDraft((d) => ({ ...d, paymentGatewayMode: v }))
              }
            />
          </Field>
        </div>
      </div>
    </SectionShell>
  );
}
