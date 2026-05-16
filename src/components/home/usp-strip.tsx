"use client";

import { useShallow } from "zustand/react/shallow";
import { useHomeContentStore } from "@/stores/home-content-store";

const MD_COLS: Record<number, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",
};

export function UspStrip() {
  const items = useHomeContentStore(
    useShallow((s) => [...s.content.uspItems].sort((a, b) => a.order - b.order)),
  );
  const enabled = useHomeContentStore((s) => s.content.visibility.showUsp);

  if (!enabled || items.length === 0) return null;

  const mdCols = MD_COLS[Math.max(2, Math.min(items.length, 6))] ?? "md:grid-cols-4";

  return (
    <div className="bg-cream py-12 border-t border-site-border">
      <div className="container-site">
        <div className={`grid grid-cols-2 ${mdCols} gap-6 text-center`}>
          {items.map((it) => (
            <div key={it.id}>
              <div className="text-2xl mb-2 grayscale opacity-80">{it.icon}</div>
              <div className="font-serif text-base text-site-text mb-1">
                {it.title}
              </div>
              <div className="text-xs text-site-gray">{it.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
