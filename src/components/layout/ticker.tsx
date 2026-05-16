"use client";

import { useHomeContentStore } from "@/stores/home-content-store";

export function Ticker() {
  const text = useHomeContentStore((s) => s.content.tickerText);
  const enabled = useHomeContentStore((s) => s.content.visibility.showTicker);

  if (!enabled || !text.trim()) return null;

  return (
    <div className="bg-site-text text-white py-2 overflow-hidden whitespace-nowrap">
      <div className="inline-block animate-ticker text-[11px] font-medium tracking-[0.16em] pr-20">
        {text}
        {text}
      </div>
    </div>
  );
}
