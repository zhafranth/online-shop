"use client";

import { Button } from "@/components/ui/button";

interface SectionShellProps {
  index: number;
  total: number;
  eyebrow: string;
  title: string;
  description: string;
  dirty: boolean;
  savedAt: number | null;
  onSave: () => void;
  onReset: () => void;
  onDiscard: () => void;
  saveLabel?: string;
  children: React.ReactNode;
}

export function SectionShell({
  index,
  total,
  eyebrow,
  title,
  description,
  dirty,
  savedAt,
  onSave,
  onReset,
  onDiscard,
  saveLabel = "Simpan Perubahan",
  children,
}: SectionShellProps) {
  return (
    <div className="bg-white border border-site-border">
      {/* Section header — editorial chapter opener */}
      <header className="px-7 pt-7 pb-6 border-b border-site-border flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 text-[10px] tracking-[0.22em] uppercase text-site-gray">
            <span className="font-mono normal-case tracking-tight tabular-nums">
              {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <span className="h-px w-6 bg-site-border" />
            <span>{eyebrow}</span>
          </div>
          <h2 className="font-serif text-[30px] leading-tight mt-2 text-navy">
            {title}
          </h2>
          <p className="text-[13px] text-site-gray mt-1.5 max-w-2xl leading-relaxed">
            {description}
          </p>
        </div>
        <div className="hidden lg:flex flex-col items-end shrink-0 pt-1">
          <span className="font-serif italic text-[60px] leading-none text-site-gray-light/70 select-none">
            §{index}
          </span>
        </div>
      </header>

      {/* Body */}
      <div className="px-7 py-7 space-y-7">{children}</div>

      {/* Footer save bar */}
      <footer className="border-t border-site-border bg-cream/40">
        <div className="px-7 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3 text-[11.5px] text-site-gray">
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full ${dirty ? "bg-[#d97706]" : "bg-navy/40"}`}
            />
            {dirty ? (
              <span className="font-mono">Perubahan belum tersimpan.</span>
            ) : savedAt ? (
              <span className="font-mono">
                Tersimpan ·{" "}
                {new Date(savedAt).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            ) : (
              <span className="font-mono">Sinkron dengan default.</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={onReset}
              className="text-[11px] tracking-[0.14em] uppercase text-site-gray hover:text-navy underline-offset-4 hover:underline px-1"
            >
              Reset Default
            </button>
            {dirty && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onDiscard}
              >
                Batalkan
              </Button>
            )}
            <Button type="button" size="sm" disabled={!dirty} onClick={onSave}>
              {saveLabel}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface FieldProps {
  label: string;
  hint?: string;
  required?: boolean;
  count?: { current: number; max: number };
  children: React.ReactNode;
}

export function Field({ label, hint, required, count, children }: FieldProps) {
  return (
    <div>
      <label className="flex items-baseline justify-between gap-3 mb-2">
        <span className="text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase">
          {label}
          {required && (
            <span className="ml-1 text-[#b91c1c] normal-case tracking-normal">
              *
            </span>
          )}
        </span>
        {count && (
          <span className="text-[10.5px] tabular-nums text-site-gray font-mono">
            {count.current}/{count.max}
          </span>
        )}
      </label>
      {children}
      {hint && (
        <p className="mt-1.5 text-[11.5px] text-site-gray leading-relaxed">
          {hint}
        </p>
      )}
    </div>
  );
}

const inputBase =
  "w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-sans text-sm text-site-text outline-none focus:border-navy transition-colors";

export const inputClass = inputBase;
export const monoInputClass =
  "w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-mono text-[13px] tracking-tight text-site-text outline-none focus:border-navy transition-colors";
export const textareaClass = `${inputBase} leading-relaxed resize-y`;
