export type PromoType = "percent" | "fixed" | "shipping";

export type PromoApplicability = "all" | "category" | "first-order";

export type PromoLifecycle = "active" | "scheduled" | "expired" | "paused";

export interface Promo {
  id: string;                 // slug, immutable
  code: string;               // UPPERCASE code shown to customers
  label: string;              // short headline
  description: string;        // one-line description (Indonesian)
  type: PromoType;
  value: number;              // percent (0-100) for "percent", rupiah for "fixed"; ignored for "shipping"
  maxDiscount: number | null; // cap (rupiah) for percent promos; null = uncapped
  minPurchase: number;        // minimum subtotal in rupiah
  startsAt: string;           // ISO 8601
  endsAt: string;             // ISO 8601
  usageLimit: number | null;  // null = unlimited
  usageCount: number;
  applicability: PromoApplicability;
  categoryId: string | null;  // when applicability === "category"
  enabled: boolean;           // manual switch — overrides to "paused" when off
  createdAt: string;          // ISO 8601
}

export const PROMO_TYPE_LABEL: Record<PromoType, string> = {
  percent: "Persentase",
  fixed: "Potongan Tetap",
  shipping: "Gratis Ongkir",
};

export const PROMO_TYPE_BADGE: Record<PromoType, string> = {
  percent: "% Off",
  fixed: "Rp Off",
  shipping: "Ongkir",
};

export const PROMO_APPLICABILITY_LABEL: Record<PromoApplicability, string> = {
  all: "Semua Produk",
  category: "Kategori Tertentu",
  "first-order": "Pesanan Pertama",
};

export const PROMO_LIFECYCLE_LABEL: Record<PromoLifecycle, string> = {
  active: "Aktif",
  scheduled: "Terjadwal",
  expired: "Berakhir",
  paused: "Dijeda",
};

export function getPromoLifecycle(promo: Promo, now: Date = new Date()): PromoLifecycle {
  if (!promo.enabled) return "paused";
  const start = new Date(promo.startsAt).getTime();
  const end = new Date(promo.endsAt).getTime();
  const t = now.getTime();
  if (t < start) return "scheduled";
  if (t > end) return "expired";
  if (promo.usageLimit !== null && promo.usageCount >= promo.usageLimit) return "expired";
  return "active";
}

export function formatPromoValue(promo: Promo): string {
  if (promo.type === "shipping") return "Gratis Ongkir";
  if (promo.type === "percent") return `${promo.value}%`;
  // fixed
  return "Rp " + promo.value.toLocaleString("id-ID");
}

export function formatPromoShortValue(promo: Promo): string {
  if (promo.type === "shipping") return "FREE";
  if (promo.type === "percent") return `-${promo.value}%`;
  return `-${(promo.value / 1000).toFixed(0)}K`;
}
