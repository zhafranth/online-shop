"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AdminMember } from "@/types/admin-team";

const MEMBER_SEED: AdminMember[] = [
  {
    id: "rizky-pratama",
    name: "Rizky Pratama",
    email: "rizky@thickapparel.com",
    role: "owner",
    status: "active",
    lastActiveAt: "2026-05-16T07:42:00.000Z",
    createdAt: "2025-08-12T09:00:00.000Z",
    twoFactor: true,
    note: "Founder. Akses billing & struktur tim.",
  },
  {
    id: "syifa-anindita",
    name: "Syifa Anindita",
    email: "syifa@thickapparel.com",
    role: "manager",
    status: "active",
    lastActiveAt: "2026-05-15T16:20:00.000Z",
    createdAt: "2025-09-04T10:30:00.000Z",
    twoFactor: true,
    note: "Head of merchandising. Bertanggung jawab katalog & kurasi.",
  },
  {
    id: "bagas-w",
    name: "Bagas Wibisono",
    email: "bagas@thickapparel.com",
    role: "manager",
    status: "active",
    lastActiveAt: "2026-05-15T11:05:00.000Z",
    createdAt: "2025-10-22T13:45:00.000Z",
    twoFactor: false,
    note: "Mengelola kampanye promo dan email marketing.",
  },
  {
    id: "dewi-larasati",
    name: "Dewi Larasati",
    email: "dewi@thickapparel.com",
    role: "staff",
    status: "active",
    lastActiveAt: "2026-05-16T06:55:00.000Z",
    createdAt: "2026-01-18T08:15:00.000Z",
    twoFactor: true,
    note: "Customer support shift pagi.",
  },
  {
    id: "arif-nugroho",
    name: "Arif Nugroho",
    email: "arif@thickapparel.com",
    role: "staff",
    status: "active",
    lastActiveAt: "2026-05-14T20:10:00.000Z",
    createdAt: "2026-02-01T09:00:00.000Z",
    twoFactor: false,
    note: "Fulfilment & gudang — shift sore.",
  },
  {
    id: "kirana-sandra",
    name: "Kirana Sandra",
    email: "kirana@thickapparel.com",
    role: "staff",
    status: "invited",
    lastActiveAt: null,
    createdAt: "2026-05-12T15:30:00.000Z",
    twoFactor: false,
    note: "Calon staf konten — undangan dikirim 12 Mei.",
  },
  {
    id: "yusuf-akbar",
    name: "Yusuf Akbar",
    email: "yusuf@thickapparel.com",
    role: "staff",
    status: "suspended",
    lastActiveAt: "2026-04-02T11:00:00.000Z",
    createdAt: "2025-11-15T10:00:00.000Z",
    twoFactor: false,
    note: "Ditangguhkan sementara — sedang cuti panjang.",
  },
];

interface AdminTeamStore {
  members: AdminMember[];
  addMember: (member: AdminMember) => void;
  updateMember: (id: string, patch: Partial<AdminMember>) => void;
  deleteMember: (id: string) => void;
  setStatus: (id: string, status: AdminMember["status"]) => void;
  getById: (id: string) => AdminMember | undefined;
}

export const useAdminTeamStore = create<AdminTeamStore>()(
  persist(
    (set, get) => ({
      members: MEMBER_SEED,

      addMember: (member) =>
        set((s) => ({ members: [member, ...s.members] })),

      updateMember: (id, patch) =>
        set((s) => ({
          members: s.members.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        })),

      deleteMember: (id) =>
        set((s) => ({ members: s.members.filter((m) => m.id !== id) })),

      setStatus: (id, status) =>
        set((s) => ({
          members: s.members.map((m) => (m.id === id ? { ...m, status } : m)),
        })),

      getById: (id) => get().members.find((m) => m.id === id),
    }),
    {
      name: "thickapparel-admin-team",
      partialize: (s) => ({ members: s.members }),
    },
  ),
);
