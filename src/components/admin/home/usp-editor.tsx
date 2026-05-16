"use client";

import { useEffect, useState } from "react";
import { ChevronUp, ChevronDown, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHomeContentStore } from "@/stores/home-content-store";
import type { UspItem } from "@/types/home-content";
import { SectionShell, sortByOrder } from "./section-shell";

let counter = 0;
const newId = () => `u_${Date.now()}_${++counter}`;

export function UspEditor({
  index,
  total,
}: {
  index: number;
  total: number;
}) {
  const items = useHomeContentStore((s) => s.content.uspItems);
  const setUspItems = useHomeContentStore((s) => s.setUspItems);

  const [draft, setDraft] = useState<UspItem[]>(sortByOrder(items));
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setDraft(sortByOrder(items));
  }, [items]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(sortByOrder(items));

  const moveUp = (i: number) => {
    if (i === 0) return;
    setDraft((d) => {
      const next = [...d];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return next;
    });
  };
  const moveDown = (i: number) => {
    if (i >= draft.length - 1) return;
    setDraft((d) => {
      const next = [...d];
      [next[i + 1], next[i]] = [next[i], next[i + 1]];
      return next;
    });
  };
  const add = () => {
    if (draft.length >= 6) {
      setError("Maksimum 6 item.");
      return;
    }
    setError("");
    setDraft((d) => [
      ...d,
      { id: newId(), icon: "✶", title: "", sub: "", order: d.length + 1 },
    ]);
  };
  const remove = (id: string) => {
    if (draft.length <= 2) {
      setError("Minimal 2 item.");
      return;
    }
    setError("");
    setDraft((d) => d.filter((it) => it.id !== id));
  };
  const update = (id: string, patch: Partial<UspItem>) =>
    setDraft((d) => d.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  const handleSave = () => {
    for (const it of draft) {
      if (it.title.trim().length < 3 || it.title.trim().length > 30) {
        setError(`Setiap item: judul harus 3–30 karakter.`);
        return;
      }
      if (it.sub.trim().length < 5 || it.sub.trim().length > 60) {
        setError(`Setiap item: sub harus 5–60 karakter.`);
        return;
      }
      if (!it.icon.trim()) {
        setError(`Setiap item: icon wajib diisi.`);
        return;
      }
    }
    setError("");
    setUspItems(draft);
    setSavedAt(Date.now());
  };

  return (
    <SectionShell
      index={index}
      total={total}
      eyebrow="Banner · Promise"
      title="USP Strip"
      description="Empat (atau lebih) janji singkat di bawah hero. Format: emoji + judul + subtitle pendek."
      counterLabel={`${draft.length}/06`}
      dirty={dirty}
      savedAt={savedAt}
      onSave={handleSave}
      onDiscard={() => setDraft(sortByOrder(items))}
    >
      <div className="space-y-3">
        {draft.map((it, i) => {
          const isFirst = i === 0;
          const isLast = i === draft.length - 1;
          return (
            <div
              key={it.id}
              className="bg-white border border-site-border grid grid-cols-[40px_72px_1fr_40px]"
            >
              <div className="border-r border-site-border bg-cream/60 flex flex-col items-center justify-center gap-1 py-2 text-site-gray-light">
                <button
                  type="button"
                  onClick={() => moveUp(i)}
                  disabled={isFirst}
                  aria-label="Naikkan"
                  className="hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronUp size={14} strokeWidth={2} />
                </button>
                <span className="font-serif italic text-[16px] tabular-nums text-site-gray">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() => moveDown(i)}
                  disabled={isLast}
                  aria-label="Turunkan"
                  className="hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronDown size={14} strokeWidth={2} />
                </button>
              </div>

              <div className="border-r border-site-border bg-cream flex flex-col items-center justify-center px-2 py-2">
                <input
                  value={it.icon}
                  onChange={(e) => update(it.id, { icon: e.target.value })}
                  maxLength={4}
                  className="w-full text-center text-2xl bg-transparent outline-none font-sans"
                  aria-label="Icon"
                />
                <span className="text-[8.5px] tracking-[0.2em] uppercase text-site-gray-light mt-1">
                  emoji
                </span>
              </div>

              <div className="px-3 py-3 grid grid-cols-1 sm:grid-cols-[1fr_1.5fr] gap-2 min-w-0">
                <input
                  value={it.title}
                  onChange={(e) => update(it.id, { title: e.target.value })}
                  placeholder="Free Ongkir"
                  maxLength={30}
                  className="px-3 py-2 border border-site-border bg-white font-serif text-[15px] text-site-text outline-none focus:border-navy"
                />
                <input
                  value={it.sub}
                  onChange={(e) => update(it.id, { sub: e.target.value })}
                  placeholder="Min. belanja Rp 200.000"
                  maxLength={60}
                  className="px-3 py-2 border border-site-border bg-white font-sans text-[12.5px] text-site-gray outline-none focus:border-navy"
                />
              </div>

              <button
                type="button"
                onClick={() => remove(it.id)}
                aria-label="Hapus"
                className="border-l border-site-border text-[#b91c1c] hover:bg-[#fee2e2] flex items-center justify-center"
              >
                <Trash2 size={14} strokeWidth={1.8} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-4 pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={add}
          className="flex items-center gap-2"
        >
          <Plus size={14} strokeWidth={1.8} />
          Tambah Item
        </Button>
        <span className="text-[11px] text-site-gray font-mono">
          {draft.length}/06
        </span>
      </div>

      {error && (
        <div className="px-3.5 py-2.5 text-[12.5px] bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]">
          {error}
        </div>
      )}

      {/* Preview strip */}
      <div className="border-t border-dashed border-site-border pt-5">
        <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray mb-3">
          Live Preview
        </div>
        <div className="bg-cream border border-site-border py-6">
          <div
            className="grid gap-4 text-center px-6"
            style={{
              gridTemplateColumns: `repeat(${Math.max(2, Math.min(draft.length, 6))}, minmax(0, 1fr))`,
            }}
          >
            {draft.map((it) => (
              <div key={it.id}>
                <div className="text-2xl mb-2 grayscale opacity-80">
                  {it.icon}
                </div>
                <div className="font-serif text-[14.5px] text-site-text mb-1">
                  {it.title || "—"}
                </div>
                <div className="text-[11px] text-site-gray">
                  {it.sub || "—"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
