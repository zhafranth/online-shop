"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  MembershipProgram,
  MembershipProgramId,
} from "@/types/membership";

const PROGRAM_SEED: MembershipProgram[] = [
  {
    id: "program-agent",
    eyebrow: "Membership",
    title: "Program",
    titleAccent: "Agent",
    description:
      "Untuk individu yang ingin membangun bisnis bersama ThickApparel. Kami menyiapkan jalur kemitraan eksklusif, pelatihan, dan dukungan operasional penuh.",
    image:
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1400&q=80",
    imageCaption: "Atelier ThickApparel · Jakarta Selatan",
    bannerText: "Program Agent · Segera Hadir · 2026",
    status: "coming-soon",
  },
  {
    id: "reseller-online",
    eyebrow: "Membership",
    title: "Reseller",
    titleAccent: "Online",
    description:
      "Jual koleksi kami dari mana saja. Kami menyiapkan inventaris, materi pemasaran, dan dukungan pengiriman — Anda fokus pada audiens dan cerita.",
    image:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1400&q=80",
    imageCaption: "Studio packaging · 2026",
    bannerText: "Reseller Online · Pendaftaran Dibuka Akhir 2026",
    status: "coming-soon",
  },
  {
    id: "titip-jual",
    eyebrow: "Membership",
    title: "Titip",
    titleAccent: "Jual",
    description:
      "Titipkan pakaian Anda dan biarkan koleksi pribadi menemukan pemilik baru. Kami mengurus kurasi, foto, hingga penjualan akhir — Anda menerima hasilnya.",
    image:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1400&q=80",
    imageCaption: "Consignment rack · ThickApparel",
    bannerText: "Titip Jual · Coming Soon · Stay Tuned",
    status: "coming-soon",
  },
];

interface MembershipStore {
  programs: MembershipProgram[];
  updateProgram: (
    id: MembershipProgramId,
    patch: Partial<MembershipProgram>,
  ) => void;
  getById: (id: MembershipProgramId) => MembershipProgram | undefined;
  getVisible: () => MembershipProgram[];
}

export const useMembershipStore = create<MembershipStore>()(
  persist(
    (set, get) => ({
      programs: PROGRAM_SEED,

      updateProgram: (id, patch) =>
        set((s) => ({
          programs: s.programs.map((p) =>
            p.id === id ? { ...p, ...patch } : p,
          ),
        })),

      getById: (id) => get().programs.find((p) => p.id === id),

      getVisible: () => get().programs.filter((p) => p.status !== "inactive"),
    }),
    {
      name: "thickapparel-membership",
      partialize: (s) => ({ programs: s.programs }),
    },
  ),
);
