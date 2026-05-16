"use client";

import { useEffect, useState } from "react";
import {
  Bookmark,
  MapPin,
  Share2,
  PanelBottom,
  Search,
  KeyRound,
  Construction,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { useSettingsStore } from "@/stores/settings-store";
import type { SettingsSectionKey } from "@/types/settings";
import { BrandingSection } from "@/components/admin/settings/branding-section";
import { ContactSection } from "@/components/admin/settings/contact-section";
import { SocialSection } from "@/components/admin/settings/social-section";
import { FooterSection } from "@/components/admin/settings/footer-section";
import { SeoSection } from "@/components/admin/settings/seo-section";
import { IntegrationsSection } from "@/components/admin/settings/integrations-section";
import { MaintenanceSection } from "@/components/admin/settings/maintenance-section";

type TocEntry = {
  key: SettingsSectionKey;
  label: string;
  caption: string;
  icon: typeof Bookmark;
};

const TOC: TocEntry[] = [
  {
    key: "branding",
    label: "Identitas Brand",
    caption: "Nama, tagline, logo, favicon.",
    icon: Bookmark,
  },
  {
    key: "contact",
    label: "Kontak & Lokasi",
    caption: "Alamat, telepon, email CS.",
    icon: MapPin,
  },
  {
    key: "social",
    label: "Sosial Media",
    caption: "Instagram, TikTok, dst.",
    icon: Share2,
  },
  {
    key: "footer",
    label: "Footer",
    caption: "About copy, newsletter, hak cipta.",
    icon: PanelBottom,
  },
  {
    key: "seo",
    label: "SEO & OG",
    caption: "Meta default & social cards.",
    icon: Search,
  },
  {
    key: "integrations",
    label: "Integrasi & API",
    caption: "RajaOngkir, payment gateway.",
    icon: KeyRound,
  },
  {
    key: "maintenance",
    label: "Maintenance",
    caption: "Tutup storefront sementara.",
    icon: Construction,
  },
];

export default function AdminSettingsPage() {
  const settings = useSettingsStore((s) => s.settings);
  const resetAll = useSettingsStore((s) => s.resetAll);

  const [active, setActive] = useState<SettingsSectionKey>("branding");
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    const el = document.getElementById(`section-${active}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [active]);

  const total = TOC.length;
  const activeIndex = TOC.findIndex((t) => t.key === active) + 1;

  const renderSection = (key: SettingsSectionKey, idx: number) => {
    const props = { index: idx + 1, total };
    switch (key) {
      case "branding":
        return <BrandingSection {...props} />;
      case "contact":
        return <ContactSection {...props} />;
      case "social":
        return <SocialSection {...props} />;
      case "footer":
        return <FooterSection {...props} />;
      case "seo":
        return <SeoSection {...props} />;
      case "integrations":
        return <IntegrationsSection {...props} />;
      case "maintenance":
        return <MaintenanceSection {...props} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* ─── HEADER ─── */}
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3 text-[10px] tracking-[0.22em] uppercase text-site-gray">
            <span>System</span>
            <span className="h-px w-6 bg-site-border" />
            <span className="font-mono normal-case tracking-tight">
              Dossier 01–{String(total).padStart(2, "0")} · §{activeIndex}
            </span>
          </div>
          <h2 className="font-serif text-[34px] leading-tight mt-2 text-navy">
            Site Settings
          </h2>
          <p className="text-[13px] text-site-gray mt-1.5 max-w-xl leading-relaxed">
            Pusat konfigurasi storefront — identitas brand, kontak, integrasi,
            sampai maintenance switch. Tiap section disimpan terpisah.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setConfirmReset(true)}
          className="flex items-center gap-2"
        >
          Reset Semua
        </Button>
      </header>

      {/* ─── INSIGHT STRIP ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 bg-white border border-site-border">
        {[
          { k: "Brand", v: settings.branding.brandName || "—" },
          {
            k: "Sosial Aktif",
            v: settings.social
              .filter((l) => l.url.trim())
              .length.toString()
              .padStart(2, "0"),
          },
          {
            k: "Integrasi",
            v: `${settings.integrations.rajaOngkirMode}/${settings.integrations.paymentGatewayMode}`,
          },
          {
            k: "Maintenance",
            v: settings.maintenance.enabled ? "Aktif" : "Off",
          },
        ].map((s, i) => (
          <div
            key={s.k}
            className={`px-6 py-5 ${i > 0 ? "md:border-l border-site-border" : ""}`}
          >
            <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray">
              {s.k}
            </div>
            <div
              className={`font-serif text-[24px] leading-tight mt-2 truncate ${
                s.k === "Maintenance" && settings.maintenance.enabled
                  ? "text-[#b91c1c]"
                  : "text-navy"
              }`}
            >
              {s.v}
            </div>
          </div>
        ))}
      </div>

      {/* ─── TWO COLUMN LAYOUT ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">
        {/* TOC rail */}
        <aside className="lg:sticky lg:top-6 self-start">
          <div className="bg-white border border-site-border">
            <div className="px-4 pt-4 pb-3 border-b border-site-border">
              <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray">
                Table of Contents
              </div>
              <div className="font-serif text-[18px] mt-0.5 text-navy">
                Sections
              </div>
            </div>
            <ul>
              {TOC.map((entry, i) => {
                const isActive = active === entry.key;
                const Icon = entry.icon;
                return (
                  <li key={entry.key}>
                    <button
                      type="button"
                      onClick={() => setActive(entry.key)}
                      className={`group w-full text-left flex gap-3 px-4 py-3 border-t border-site-border first:border-t-0 transition-colors ${
                        isActive
                          ? "bg-cream"
                          : "bg-white hover:bg-cream/40"
                      }`}
                    >
                      <span
                        className={`shrink-0 font-serif italic text-[20px] leading-none tabular-nums pt-0.5 ${isActive ? "text-navy" : "text-site-gray-light"}`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5">
                          <Icon
                            size={12}
                            strokeWidth={1.7}
                            className={isActive ? "text-navy" : "text-site-gray"}
                          />
                          <span
                            className={`text-[12.5px] font-medium truncate ${isActive ? "text-navy" : "text-site-text"}`}
                          >
                            {entry.label}
                          </span>
                        </span>
                        <span className="block text-[11px] text-site-gray mt-0.5 truncate">
                          {entry.caption}
                        </span>
                      </span>
                      {isActive && (
                        <span className="shrink-0 self-stretch w-[2px] bg-navy -my-3 -mr-4" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-3 px-4 py-3 bg-cream border border-site-border text-[11px] text-site-gray font-mono leading-relaxed">
            <span className="text-navy">▌</span> Section disimpan masing-masing.
            Klik judul untuk lompat.
          </div>
        </aside>

        {/* Section content */}
        <div className="space-y-6 min-w-0">
          {TOC.map((entry, i) => (
            <div
              key={entry.key}
              id={`section-${entry.key}`}
              className="scroll-mt-6"
            >
              {renderSection(entry.key, i)}
            </div>
          ))}
        </div>
      </div>

      <ConfirmModal
        open={confirmReset}
        title="Reset Semua Settings"
        message="Semua section akan dikembalikan ke nilai default. Aksi ini tidak bisa dibatalkan."
        confirmLabel="Reset"
        variant="danger"
        onConfirm={() => {
          resetAll();
          setConfirmReset(false);
        }}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}
