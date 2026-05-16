"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  EditorsPicksConfig,
  HeroSlide,
  HomeContent,
  HomeVisibility,
  UspItem,
} from "@/types/home-content";

const HERO_SEED: HeroSlide[] = [
  {
    id: "h1",
    src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=80",
    alt: "Koleksi pria terbaru",
    order: 1,
  },
  {
    id: "h2",
    src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=80",
    alt: "Koleksi wanita terkurasi",
    order: 2,
  },
  {
    id: "h3",
    src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1800&q=80",
    alt: "Editorial collection",
    order: 3,
  },
  {
    id: "h4",
    src: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1800&q=80",
    alt: "Outer & blazer",
    order: 4,
  },
];

const TICKER_SEED =
  "✦ FREE ONGKIR MIN. Rp200.000     ✦ NEW ARRIVALS EVERY WEEK     ✦ SIZE S – 4XL     ✦ RETUR 14 HARI     ✦ GARANSI KUALITAS     ";

const USP_SEED: UspItem[] = [
  { id: "u1", icon: "🚚", title: "Free Ongkir", sub: "Min. belanja Rp 200.000", order: 1 },
  { id: "u2", icon: "↩", title: "Retur 14 Hari", sub: "Tanpa pertanyaan", order: 2 },
  { id: "u3", icon: "🔒", title: "Pembayaran Aman", sub: "SSL Encrypted", order: 3 },
  { id: "u4", icon: "⭐", title: "Kualitas Terjamin", sub: "Garansi kepuasan", order: 4 },
];

const EDITORS_PICKS_SEED: EditorsPicksConfig = {
  heroProductId: 2,
  smallProductIds: [3, 4],
};

const VISIBILITY_SEED: HomeVisibility = {
  showHero: true,
  showTicker: true,
  showUsp: true,
  showEditorsPicks: true,
  showLatestMagazine: true,
  showNewArrivals: true,
  showGenderBanner: false,
};

export const DEFAULT_HOME_CONTENT: HomeContent = {
  heroSlides: HERO_SEED,
  tickerText: TICKER_SEED,
  uspItems: USP_SEED,
  editorsPicks: EDITORS_PICKS_SEED,
  visibility: VISIBILITY_SEED,
};

interface HomeContentStore {
  content: HomeContent;
  setHeroSlides: (slides: HeroSlide[]) => void;
  setTickerText: (text: string) => void;
  setUspItems: (items: UspItem[]) => void;
  setEditorsPicks: (picks: EditorsPicksConfig) => void;
  setVisibility: (patch: Partial<HomeVisibility>) => void;
  reset: () => void;
}

export const useHomeContentStore = create<HomeContentStore>()(
  persist(
    (set) => ({
      content: DEFAULT_HOME_CONTENT,
      setHeroSlides: (slides) =>
        set((s) => ({
          content: {
            ...s.content,
            heroSlides: slides
              .map((sl, i) => ({ ...sl, order: i + 1 })),
          },
        })),
      setTickerText: (text) =>
        set((s) => ({ content: { ...s.content, tickerText: text } })),
      setUspItems: (items) =>
        set((s) => ({
          content: {
            ...s.content,
            uspItems: items.map((it, i) => ({ ...it, order: i + 1 })),
          },
        })),
      setEditorsPicks: (picks) =>
        set((s) => ({ content: { ...s.content, editorsPicks: picks } })),
      setVisibility: (patch) =>
        set((s) => ({
          content: {
            ...s.content,
            visibility: { ...s.content.visibility, ...patch },
          },
        })),
      reset: () => set({ content: DEFAULT_HOME_CONTENT }),
    }),
    {
      name: "thickapparel-home-content",
      partialize: (s) => ({ content: s.content }),
    },
  ),
);
