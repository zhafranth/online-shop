"use client";

import { Button } from "@/components/ui/button";

interface SectionShellProps {
  index: number;
  total: number;
  eyebrow: string;
  title: string;
  description: string;
  counterLabel?: string;
  dirty: boolean;
  savedAt: number | null;
  onSave: () => void;
  onDiscard?: () => void;
  saveLabel?: string;
  children: React.ReactNode;
}

export function SectionShell({
  index,
  total,
  eyebrow,
  title,
  description,
  counterLabel,
  dirty,
  savedAt,
  onSave,
  onDiscard,
  saveLabel = "Simpan Section",
  children,
}: SectionShellProps) {
  return (
    <div className="bg-white border border-site-border">
      <header className="px-7 pt-7 pb-6 border-b border-site-border flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 text-[10px] tracking-[0.22em] uppercase text-site-gray">
            <span className="font-mono normal-case tracking-tight tabular-nums">
              {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <span className="h-px w-6 bg-site-border" />
            <span>{eyebrow}</span>
            {counterLabel && (
              <>
                <span className="h-px w-6 bg-site-border" />
                <span className="font-mono normal-case tracking-tight">
                  {counterLabel}
                </span>
              </>
            )}
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

      <div className="px-7 py-7 space-y-5">{children}</div>

      <footer className="border-t border-site-border bg-cream/40 px-7 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
          {dirty && onDiscard && (
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
      </footer>
    </div>
  );
}

export function sortByOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order);
}
