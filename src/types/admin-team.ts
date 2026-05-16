export type AdminRole = "owner" | "manager" | "staff";

export type AdminMemberStatus = "active" | "invited" | "suspended";

export interface AdminMember {
  id: string;                  // slug, immutable
  name: string;
  email: string;
  role: AdminRole;
  status: AdminMemberStatus;
  lastActiveAt: string | null; // ISO 8601 or null when never logged in
  createdAt: string;           // ISO 8601 — invited/created at
  twoFactor: boolean;
  note: string;                // short internal note
}

export const ADMIN_ROLE_LABEL: Record<AdminRole, string> = {
  owner: "Pemilik",
  manager: "Manajer",
  staff: "Staf",
};

export const ADMIN_ROLE_DESCRIPTION: Record<AdminRole, string> = {
  owner: "Akses penuh, termasuk billing dan struktur tim.",
  manager: "Mengelola katalog, pesanan, promo, dan konten.",
  staff: "Operasional harian — pesanan dan stok.",
};

export const ADMIN_STATUS_LABEL: Record<AdminMemberStatus, string> = {
  active: "Aktif",
  invited: "Diundang",
  suspended: "Ditangguhkan",
};

export function monogram(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "··";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function relativeFromNow(iso: string | null, now: Date = new Date()): string {
  if (!iso) return "Belum login";
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "—";
  const diffMs = now.getTime() - t;
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "Baru saja";
  if (mins < 60) return `${mins} menit lalu`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} jam lalu`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days} hari lalu`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months} bulan lalu`;
  const years = Math.round(months / 12);
  return `${years} tahun lalu`;
}
