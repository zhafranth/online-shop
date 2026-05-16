"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Article } from "@/types/magazine";
import { ARTICLES } from "@/lib/magazine-seeds";

interface MagazineStore {
  articles: Article[];
  addArticle: (article: Article) => void;
  updateArticle: (slug: string, patch: Partial<Article>) => void;
  deleteArticle: (slug: string) => void;
  setFeatured: (slug: string) => void;
  getBySlug: (slug: string) => Article | undefined;
  getRelated: (slug: string, limit?: number) => Article[];
}

export const useMagazineStore = create<MagazineStore>()(
  persist(
    (set, get) => ({
      articles: ARTICLES,

      addArticle: (article) =>
        set((s) => {
          const next = article.featured
            ? s.articles.map((a) => ({ ...a, featured: false }))
            : s.articles;
          return { articles: [article, ...next] };
        }),

      updateArticle: (slug, patch) =>
        set((s) => {
          const willPromote = patch.featured === true;
          return {
            articles: s.articles.map((a) => {
              if (a.slug === slug) return { ...a, ...patch };
              if (willPromote) return { ...a, featured: false };
              return a;
            }),
          };
        }),

      deleteArticle: (slug) =>
        set((s) => ({ articles: s.articles.filter((a) => a.slug !== slug) })),

      setFeatured: (slug) =>
        set((s) => ({
          articles: s.articles.map((a) => ({
            ...a,
            featured: a.slug === slug,
          })),
        })),

      getBySlug: (slug) => get().articles.find((a) => a.slug === slug),

      getRelated: (slug, limit = 3) => {
        const current = get().articles.find((a) => a.slug === slug);
        if (!current) return get().articles.slice(0, limit);
        const sameCategory = get().articles.filter(
          (a) => a.slug !== slug && a.category === current.category,
        );
        const others = get().articles.filter(
          (a) => a.slug !== slug && a.category !== current.category,
        );
        return [...sameCategory, ...others].slice(0, limit);
      },
    }),
    {
      name: "thickapparel-magazine",
      partialize: (s) => ({ articles: s.articles }),
    },
  ),
);
