"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Settings,
  SettingsSectionKey,
  SocialLink,
} from "@/types/settings";

export const DEFAULT_SETTINGS: Settings = {
  branding: {
    brandName: "ThickApparel",
    tagline: "Mode terpilih untuk semua",
    logoUrl: "",
    faviconUrl: "",
  },
  contact: {
    address: "Jl. Riau No. 12, Bandung Wetan",
    city: "Bandung",
    phone: "+62 22 1234 5678",
    whatsapp: "+62 812 3456 7890",
    emailCs: "halo@thickapparel.id",
    operationalHours: "Senin–Sabtu, 09.00–18.00 WIB",
  },
  social: [
    { platform: "instagram", url: "https://instagram.com/thickapparel" },
    { platform: "tiktok", url: "https://tiktok.com/@thickapparel" },
    { platform: "youtube", url: "" },
    { platform: "twitter", url: "" },
    { platform: "facebook", url: "https://facebook.com/thickapparel" },
  ],
  footer: {
    aboutText:
      "Mode terpilih untuk semua. Kualitas premium, harga terjangkau, dikirim ke seluruh Indonesia.",
    newsletterHeading: "Newsletter",
    copyright: "© 2026 ThickApparel. All rights reserved.",
  },
  seo: {
    metaTitle: "ThickApparel — Mode Terpilih Untuk Semua",
    metaDescription:
      "Koleksi fashion premium dengan kualitas terbaik. Kemeja, dress, outer, dan aksesoris untuk pria & wanita.",
    ogImage: "",
    siteUrl: "https://thickapparel.id",
  },
  integrations: {
    rajaOngkirKey: "",
    rajaOngkirMode: "mock",
    paymentGatewayKey: "",
    paymentGatewayMode: "mock",
  },
  maintenance: {
    enabled: false,
    message:
      "Kami sedang merapikan etalase. Silakan kembali sebentar lagi — terima kasih atas kesabarannya.",
    eta: "",
    allowAdmin: true,
  },
};

interface SettingsStore {
  settings: Settings;
  updateBranding: (patch: Partial<Settings["branding"]>) => void;
  updateContact: (patch: Partial<Settings["contact"]>) => void;
  updateSocial: (links: SocialLink[]) => void;
  updateFooter: (patch: Partial<Settings["footer"]>) => void;
  updateSeo: (patch: Partial<Settings["seo"]>) => void;
  updateIntegrations: (patch: Partial<Settings["integrations"]>) => void;
  setMaintenance: (patch: Partial<Settings["maintenance"]>) => void;
  resetSection: (section: SettingsSectionKey) => void;
  resetAll: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      updateBranding: (patch) =>
        set((s) => ({
          settings: {
            ...s.settings,
            branding: { ...s.settings.branding, ...patch },
          },
        })),
      updateContact: (patch) =>
        set((s) => ({
          settings: {
            ...s.settings,
            contact: { ...s.settings.contact, ...patch },
          },
        })),
      updateSocial: (links) =>
        set((s) => ({ settings: { ...s.settings, social: links } })),
      updateFooter: (patch) =>
        set((s) => ({
          settings: {
            ...s.settings,
            footer: { ...s.settings.footer, ...patch },
          },
        })),
      updateSeo: (patch) =>
        set((s) => ({
          settings: { ...s.settings, seo: { ...s.settings.seo, ...patch } },
        })),
      updateIntegrations: (patch) =>
        set((s) => ({
          settings: {
            ...s.settings,
            integrations: { ...s.settings.integrations, ...patch },
          },
        })),
      setMaintenance: (patch) =>
        set((s) => ({
          settings: {
            ...s.settings,
            maintenance: { ...s.settings.maintenance, ...patch },
          },
        })),
      resetSection: (section) =>
        set((s) => ({
          settings: { ...s.settings, [section]: DEFAULT_SETTINGS[section] },
        })),
      resetAll: () => set({ settings: DEFAULT_SETTINGS }),
    }),
    {
      name: "thickapparel-settings",
      partialize: (s) => ({ settings: s.settings }),
    },
  ),
);
