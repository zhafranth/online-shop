"use client";

import { useEffect, useState } from "react";
import { useHomeContentStore } from "@/stores/home-content-store";
import { SectionShell } from "./section-shell";

export function TickerEditor({
  index,
  total,
}: {
  index: number;
  total: number;
}) {
  const tickerText = useHomeContentStore((s) => s.content.tickerText);
  const setTickerText = useHomeContentStore((s) => s.setTickerText);

  const [draft, setDraft] = useState(tickerText);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    setDraft(tickerText);
  }, [tickerText]);

  const dirty = draft !== tickerText;

  return (
    <SectionShell
      index={index}
      total={total}
      eyebrow="Banner · Marquee"
      title="Ticker Bar"
      description="Strip horizontal scrolling di atas hero. Pisahkan tiap pesan dengan separator (mis. ✦) agar tampak ritmis."
      counterLabel={`${draft.length}/240`}
      dirty={dirty}
      savedAt={savedAt}
      onSave={() => {
        setTickerText(draft);
        setSavedAt(Date.now());
      }}
      onDiscard={() => setDraft(tickerText)}
    >
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={3}
        maxLength={240}
        className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-mono text-[13px] text-site-text outline-none focus:border-navy resize-y leading-relaxed"
        placeholder="✦ FREE ONGKIR  ✦ NEW ARRIVALS  ✦ RETUR 14 HARI"
      />

      {/* Live preview */}
      <div className="border-t border-dashed border-site-border pt-5">
        <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray mb-3">
          Live Preview
        </div>
        <div className="bg-site-text text-white py-2 overflow-hidden whitespace-nowrap">
          <div className="inline-block animate-ticker text-[11px] font-medium tracking-[0.16em] pr-20">
            {draft || "—"}
            {draft || "—"}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
