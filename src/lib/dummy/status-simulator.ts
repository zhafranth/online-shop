import type {
  OrderShippingStatus,
  TrackingManifest,
} from "@/types/raja-ongkir";

export const STATUS_THRESHOLDS_MS = {
  Dijemput: 10_000,
  Dikirim: 20_000,
  Selesai: 30_000,
} as const;

interface ManifestStep {
  code: string;
  description: string;
  status: OrderShippingStatus;
  elapsed: number;
}

const MANIFEST_STEPS: ManifestStep[] = [
  {
    code: "PACKING",
    description: "Pesanan sedang disiapkan oleh penjual",
    status: "Packing",
    elapsed: 0,
  },
  {
    code: "PICKUP",
    description: "Paket telah dijemput oleh kurir di gudang Bandung",
    status: "Dijemput",
    elapsed: STATUS_THRESHOLDS_MS.Dijemput,
  },
  {
    code: "TRANSIT",
    description: "Paket dalam perjalanan menuju kota tujuan",
    status: "Dikirim",
    elapsed: STATUS_THRESHOLDS_MS.Dikirim,
  },
  {
    code: "DELIVERED",
    description: "Paket telah diterima oleh penerima",
    status: "Selesai",
    elapsed: STATUS_THRESHOLDS_MS.Selesai,
  },
];

export function deriveStatus(paidAt: string): OrderShippingStatus {
  const elapsed = Date.now() - new Date(paidAt).getTime();
  if (elapsed >= STATUS_THRESHOLDS_MS.Selesai) return "Selesai";
  if (elapsed >= STATUS_THRESHOLDS_MS.Dikirim) return "Dikirim";
  if (elapsed >= STATUS_THRESHOLDS_MS.Dijemput) return "Dijemput";
  return "Packing";
}

export function deriveManifest(paidAt: string): TrackingManifest[] {
  const paidAtMs = new Date(paidAt).getTime();
  const elapsed = Date.now() - paidAtMs;
  return MANIFEST_STEPS.filter((m) => elapsed >= m.elapsed).map((m) => {
    const eventDate = new Date(paidAtMs + m.elapsed);
    return {
      manifest_code: m.code,
      manifest_description: m.description,
      manifest_date: eventDate.toISOString().slice(0, 10),
      manifest_time: eventDate.toTimeString().slice(0, 8),
      city_name: m.status === "Dijemput" ? "BANDUNG" : "—",
    };
  });
}

export function getNextStepInfo(paidAt: string): {
  current: OrderShippingStatus;
  nextStatus: OrderShippingStatus | null;
  msToNext: number | null;
} {
  const elapsed = Date.now() - new Date(paidAt).getTime();
  const upcoming = MANIFEST_STEPS.find((m) => elapsed < m.elapsed);
  return {
    current: deriveStatus(paidAt),
    nextStatus: upcoming?.status ?? null,
    msToNext: upcoming ? upcoming.elapsed - elapsed : null,
  };
}

export { MANIFEST_STEPS };
