"use client";

import type { TrackingManifest } from "@/types/raja-ongkir";

interface TrackingTimelineProps {
  manifest: TrackingManifest[];
  totalSteps?: number;
}

const PENDING_LABELS = [
  { code: "PICKUP", description: "Menunggu kurir menjemput paket" },
  { code: "TRANSIT", description: "Menunggu paket dikirim" },
  { code: "DELIVERED", description: "Menunggu paket diterima" },
];

function formatDate(date: string, time: string): string {
  if (!date) return "—";
  const dt = new Date(`${date}T${time}`);
  if (Number.isNaN(dt.getTime())) return `${date} ${time}`;
  return dt.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function TrackingTimeline({
  manifest,
  totalSteps = 4,
}: TrackingTimelineProps) {
  const pendingCount = Math.max(0, totalSteps - manifest.length);
  const pendingItems = PENDING_LABELS.slice(
    PENDING_LABELS.length - pendingCount,
  );

  return (
    <ol className="relative">
      {manifest
        .slice()
        .reverse()
        .map((m, i) => {
          const isLast = i === 0;
          return (
            <li key={`${m.manifest_code}-${i}`} className="flex gap-4 pb-5 last:pb-0 relative">
              <div className="flex flex-col items-center">
                <div
                  className={`w-3 h-3 rounded-full border-2 ${
                    isLast ? "bg-navy border-navy" : "bg-gold border-gold"
                  }`}
                />
                {i < manifest.length + pendingItems.length - 1 && (
                  <div className="w-px flex-1 bg-site-border mt-1" />
                )}
              </div>
              <div className="flex-1 pb-1">
                <div className="text-sm font-semibold text-site-text">
                  {m.manifest_description}
                </div>
                <div className="text-xs text-site-gray mt-0.5">
                  {formatDate(m.manifest_date, m.manifest_time)}
                  {m.city_name && m.city_name !== "—" ? ` · ${m.city_name}` : ""}
                </div>
              </div>
            </li>
          );
        })}
      {pendingItems.map((p, i) => (
        <li
          key={`pending-${p.code}`}
          className="flex gap-4 pb-5 last:pb-0 relative"
        >
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full border-2 border-site-border bg-white" />
            {i < pendingItems.length - 1 && (
              <div className="w-px flex-1 bg-site-border mt-1" />
            )}
          </div>
          <div className="flex-1">
            <div className="text-sm text-site-gray">{p.description}</div>
            <div className="text-xs text-site-gray-light mt-0.5">Menunggu…</div>
          </div>
        </li>
      ))}
    </ol>
  );
}
