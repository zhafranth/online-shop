"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSettingsStore } from "@/stores/settings-store";

export function MaintenanceGate() {
  const pathname = usePathname();
  const branding = useSettingsStore((s) => s.settings.branding);
  const maintenance = useSettingsStore((s) => s.settings.maintenance);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated || !maintenance.enabled) return null;

  const onAdminRoute = pathname.startsWith("/admin");
  if (onAdminRoute && maintenance.allowAdmin) return null;

  const eta = maintenance.eta
    ? new Date(maintenance.eta).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  return (
    <div
      className="fixed inset-0 z-[2000] bg-cream flex items-center justify-center px-6 py-10 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Maintenance mode"
    >
      {/* Decorative diagonal stripes (subtle) */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #0a0a0a 0 1px, transparent 1px 14px)",
        }}
      />
      <div className="relative max-w-xl w-full text-center">
        <div className="text-[10px] tracking-[0.32em] uppercase text-site-gray font-mono normal-case tracking-tight mb-4">
          Sedang Berbenah · Maintenance Mode
        </div>
        <h1 className="font-serif text-[44px] sm:text-[60px] leading-[1.05] text-navy">
          {branding.brandName}
        </h1>
        <div className="mx-auto mt-5 h-px w-16 bg-navy/40" />
        <p className="text-[14.5px] sm:text-[15px] text-site-gray-dark mt-6 leading-relaxed">
          {maintenance.message}
        </p>
        {eta && (
          <div className="mt-8 inline-flex items-center gap-2.5 px-4 py-2.5 bg-white border border-site-border">
            <span className="inline-block w-2 h-2 rounded-full bg-navy animate-pulse" />
            <span className="text-[11px] tracking-[0.18em] uppercase text-site-gray">
              Estimasi Kembali
            </span>
            <span className="font-mono text-[12.5px] text-site-text tabular-nums">
              {eta}
            </span>
          </div>
        )}
        <div className="mt-12 text-[10px] tracking-[0.22em] uppercase text-site-gray-light font-mono normal-case tracking-tight">
          © {new Date().getFullYear()} {branding.brandName}
        </div>
      </div>
    </div>
  );
}
