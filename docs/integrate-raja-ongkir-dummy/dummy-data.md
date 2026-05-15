# Dummy Data — Struktur & Seed

Semua mock data ditaruh di **satu folder**: `src/lib/dummy/`. Format response **wajib** persis match struktur RajaOngkir asli — supaya saat swap ke real fetch, tipe TypeScript tidak berubah.

```
src/lib/dummy/
├── destinations.ts        # provinces, cities, districts
├── couriers.ts            # courier names, ETD, premium
├── shipping-cost.ts       # formula simulasi ongkir
├── payment-channels.ts    # daftar VA + QRIS (cuma QRIS yang dipakai dummy)
├── awb-generator.ts       # generate AWB random
└── status-simulator.ts    # auto-progression status order
```

---

## Destinations

### Provinces (`destinations.ts`)

Hardcode **5 provinsi** paling umum di Indonesia. Cukup untuk demo, tidak overload dropdown.

```ts
export const DUMMY_PROVINCES = [
  { id: 11, name: "DKI JAKARTA" },
  { id: 9,  name: "JAWA BARAT" },
  { id: 10, name: "JAWA TENGAH" },
  { id: 11, name: "JAWA TIMUR" },     // catatan: id ini boleh dummy, bukan id rajaongkir asli
  { id: 5,  name: "BANTEN" },
];

export const DUMMY_PROVINCES_RESPONSE = {
  meta: { message: "Success Get Province", code: 200, status: "success" as const },
  data: DUMMY_PROVINCES,
};
```

### Cities

```ts
export const DUMMY_CITIES: Record<number, Array<{ id: number; name: string; zip_code: string }>> = {
  // DKI JAKARTA
  11: [
    { id: 151, name: "JAKARTA PUSAT",    zip_code: "10110" },
    { id: 152, name: "JAKARTA UTARA",    zip_code: "14110" },
    { id: 153, name: "JAKARTA SELATAN",  zip_code: "12110" },
    { id: 154, name: "JAKARTA BARAT",    zip_code: "11110" },
    { id: 155, name: "JAKARTA TIMUR",    zip_code: "13110" },
  ],
  // JAWA BARAT
  9: [
    { id: 22,  name: "BANDUNG",          zip_code: "40111" },
    { id: 23,  name: "BANDUNG BARAT",    zip_code: "40721" },
    { id: 78,  name: "BOGOR",            zip_code: "16111" },
    { id: 79,  name: "BOGOR KAB.",       zip_code: "16911" },
    { id: 105, name: "DEPOK",            zip_code: "16411" },
  ],
  // JAWA TENGAH
  10: [
    { id: 398, name: "SEMARANG",         zip_code: "50111" },
    { id: 399, name: "SEMARANG KAB.",    zip_code: "50511" },
    { id: 472, name: "SOLO",             zip_code: "57111" },
    { id: 501, name: "YOGYAKARTA",       zip_code: "55111" },  // (in real: DIY, beda provinsi)
  ],
  // JAWA TIMUR
  11: [
    { id: 444, name: "SURABAYA",         zip_code: "60111" },
    { id: 256, name: "MALANG",           zip_code: "65111" },
    { id: 178, name: "JEMBER",           zip_code: "68111" },
  ],
  // BANTEN
  5: [
    { id: 461, name: "TANGERANG",        zip_code: "15111" },
    { id: 462, name: "TANGERANG SELATAN", zip_code: "15411" },
    { id: 73,  name: "SERANG",           zip_code: "42111" },
  ],
};
```

### Districts

Cukup hardcode 3–5 kecamatan **per kota yang dipakai**. Untuk demo tidak perlu lengkap.

```ts
export const DUMMY_DISTRICTS: Record<number, Array<{ id: number; name: string; zip_code: string }>> = {
  // JAKARTA SELATAN
  153: [
    { id: 2007, name: "JAGAKARSA",     zip_code: "12630" },
    { id: 2008, name: "KEBAYORAN BARU", zip_code: "12110" },
    { id: 2009, name: "TEBET",         zip_code: "12810" },
    { id: 2010, name: "MAMPANG PRAPATAN", zip_code: "12760" },
  ],
  // BANDUNG
  22: [
    { id: 1391, name: "BANDUNG WETAN",  zip_code: "40115" },
    { id: 1392, name: "COBLONG",        zip_code: "40132" },
    { id: 1393, name: "CIDADAP",        zip_code: "40141" },
  ],
  // ... dst untuk kota lain yang akan dipakai
};
```

### Service Methods (Dummy)

```ts
export function getProvincesDummy() {
  return Promise.resolve(DUMMY_PROVINCES_RESPONSE);
}

export function getCitiesDummy(provinceId: number) {
  return Promise.resolve({
    meta: { message: "Success Get City By Province ID", code: 200, status: "success" as const },
    data: DUMMY_CITIES[provinceId] ?? [],
  });
}

export function getDistrictsDummy(cityId: number) {
  return Promise.resolve({
    meta: { message: "Success Get District By City ID", code: 200, status: "success" as const },
    data: DUMMY_DISTRICTS[cityId] ?? [],
  });
}
```

> Promise dipakai meski sync, supaya signature sama dengan versi real (`fetch`-based).

---

## Couriers

```ts
// src/lib/dummy/couriers.ts
export const DUMMY_COURIERS = [
  { code: "jne",      name: "Jalur Nugraha Ekakurir (JNE)" },
  { code: "jnt",      name: "J&T Express" },
  { code: "sicepat",  name: "SiCepat Ekspres" },
  { code: "anteraja", name: "Anteraja" },
  { code: "pos",      name: "POS Indonesia" },
] as const;

export const COURIER_SERVICE: Record<string, { service: string; description: string }> = {
  jne:      { service: "REG",      description: "Layanan Reguler" },
  jnt:      { service: "EZ",       description: "Express" },
  sicepat:  { service: "REG",      description: "Regular Service" },
  anteraja: { service: "Regular",  description: "Reguler Anteraja" },
  pos:      { service: "Reguler",  description: "Paket Kilat Khusus" },
};

export const COURIER_ETD: Record<string, string> = {
  jne:      "2-3 day",
  jnt:      "2-3 day",
  sicepat:  "1-2 day",
  anteraja: "2-4 day",
  pos:      "3-5 day",
};

// "Premium" per kurir (penambahan dari base cost)
export const COURIER_PREMIUM: Record<string, number> = {
  jne:      2000,
  jnt:      1000,
  sicepat:  3000,
  anteraja: 0,
  pos:      6000,
};
```

---

## Shipping Cost Formula

`src/lib/dummy/shipping-cost.ts` — rumus jarak sederhana berbasis ID provinsi. Tidak realistic, tapi cukup memberi variasi.

```ts
// "Wilayah" untuk simulasi jarak
const ZONE_BY_PROVINCE: Record<number, number> = {
  11: 1, // DKI Jakarta
  9:  2, // Jabar
  5:  2, // Banten
  10: 3, // Jateng
  11: 4, // Jatim (kolisi id, ignore)
};

// Base cost per kombinasi (origin_zone, dest_zone)
const BASE_COST_MATRIX = [
  // dest=1   2    3    4
  [   9000, 12000, 16000, 20000 ], // origin=1
  [  12000,  9000, 13000, 17000 ], // origin=2
  [  16000, 13000,  9000, 14000 ], // origin=3
  [  20000, 17000, 14000,  9000 ], // origin=4
];

export function computeDummyCost(
  originProvinceId: number,
  destinationProvinceId: number,
  weightGrams: number,
  courierCode: string,
): number {
  const oZone = (ZONE_BY_PROVINCE[originProvinceId] ?? 1) - 1;
  const dZone = (ZONE_BY_PROVINCE[destinationProvinceId] ?? 1) - 1;
  const base = BASE_COST_MATRIX[oZone][dZone];
  const weightFactor = Math.max(1, Math.ceil(weightGrams / 1000));
  const premium = COURIER_PREMIUM[courierCode] ?? 0;
  return (base + premium) * weightFactor;
}
```

### `calculateCostDummy` (matches RajaOngkir response)

```ts
export interface CalculateCostInput {
  originDistrictId: number;
  destinationDistrictId: number;
  weight: number;
  couriers: string[];
}

export function calculateCostDummy(input: CalculateCostInput) {
  // Lookup balik district → province (perlu helper)
  const originProvince = districtToProvinceId(input.originDistrictId);
  const destProvince = districtToProvinceId(input.destinationDistrictId);

  const data = input.couriers.map((code) => ({
    name: COURIER_NAMES[code],
    code,
    service: COURIER_SERVICE[code].service,
    description: COURIER_SERVICE[code].description,
    cost: computeDummyCost(originProvince, destProvince, input.weight, code),
    etd: COURIER_ETD[code],
  }));

  return Promise.resolve({
    meta: {
      message: "Success Calculate Shipping cost",
      code: 200,
      status: "success" as const,
    },
    data,
  });
}
```

### Hasil Contoh

Input: warehouse di BANDUNG WETAN (Jabar zone 2), kirim ke JAGAKARSA (DKI zone 1), berat 700 g.

| Kurir | Base | + Premium | × Weight | Output |
| --- | ---:| ---:| ---:| ---:|
| JNE | 12.000 | 2.000 | × 1 | **14.000** |
| J&T | 12.000 | 1.000 | × 1 | **13.000** |
| SiCepat | 12.000 | 3.000 | × 1 | **15.000** |
| Anteraja | 12.000 | 0 | × 1 | **12.000** |
| POS | 12.000 | 6.000 | × 1 | **18.000** |

> Angka jelas tidak akurat dibanding ongkir asli, tapi user merasakan variasi → demo lebih credible.

---

## Payment Channels (Dummy)

```ts
// src/lib/dummy/payment-channels.ts
export const DUMMY_PAYMENT_METHODS_RESPONSE = {
  meta: { message: "Success Get Payment Methods", code: 200, status: "success" as const },
  data: {
    virtual_account: [
      // disabled untuk MVP dummy, hanya display
      { code: "BCA",     name: "Bank BCA",     fee: 4000, enabled: false },
      { code: "BNI",     name: "Bank BNI",     fee: 4000, enabled: false },
      { code: "MANDIRI", name: "Bank Mandiri", fee: 4000, enabled: false },
    ],
    qris: [
      { code: "QRIS", name: "QRIS", fee_percent: 0.7, enabled: true },
    ],
  },
};
```

Untuk MVP dummy: **hanya QRIS yang aktif**. VA ditampilkan greyed-out dengan tooltip "Segera hadir".

---

## Payment Session (Create QRIS)

```ts
// src/lib/dummy/payment-channels.ts
export function createQrisDummy(input: {
  amount: number;
  referenceId: string;
  customerName: string;
}) {
  const paymentId = `pay_DUM_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const now = new Date();
  const expiredAt = new Date(now.getTime() + 30 * 60 * 1000); // +30 menit

  return Promise.resolve({
    meta: { message: "Success Create Payment", code: 201, status: "success" as const },
    data: {
      payment_id: paymentId,
      reference_id: input.referenceId,
      payment_method: "qris" as const,
      qris_string: `DUMMY-QRIS-${input.referenceId}-${input.amount}`,
      qris_image_url: "/dummy/qris-placeholder.png", // taruh PNG di public/dummy/
      amount: input.amount,
      status: "PENDING" as const,
      expired_at: expiredAt.toISOString(),
      created_at: now.toISOString(),
    },
  });
}
```

### Get Status (dummy)

Status disimpan di `payment-store` (Zustand). `getStatusDummy(payment_id)` cukup baca dari store:

```ts
export function getStatusDummy(paymentId: string) {
  const session = usePaymentStore.getState().sessions[paymentId];
  return Promise.resolve({
    meta: { message: "ok", code: 200, status: "success" as const },
    data: session ?? null,
  });
}
```

### Mark Paid (dipanggil dari tombol Simulasi)

```ts
export function markPaidDummy(paymentId: string) {
  usePaymentStore.getState().markPaid(paymentId);
  // trigger order update + status simulator
}
```

---

## AWB Generator

```ts
// src/lib/dummy/awb-generator.ts
export function generateDummyAwb(): string {
  const ts = Date.now().toString().slice(-10);
  const rnd = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `DUM${ts}${rnd}`;
}
// contoh output: "DUM17157321094821"
```

---

## Auto-Status Progression

Karena dummy tidak ada webhook untuk update status pengiriman, ada **dua pendekatan**:

### Opsi A: `setTimeout` Chain (sederhana, hilang saat reload)

```ts
// src/lib/dummy/status-simulator.ts
export function startStatusSimulator(orderId: string) {
  const chain = [
    { ms: 10_000, status: "Dijemput" as const, desc: "Paket dipickup oleh kurir" },
    { ms: 20_000, status: "Dikirim"  as const, desc: "Paket dalam perjalanan" },
    { ms: 30_000, status: "Selesai"  as const, desc: "Paket diterima" },
  ];

  chain.forEach(({ ms, status, desc }) => {
    setTimeout(() => {
      useOrderStore.getState().pushManifest(orderId, {
        manifest_code: status.toUpperCase(),
        manifest_description: desc,
        manifest_date: new Date().toISOString().slice(0, 10),
        manifest_time: new Date().toTimeString().slice(0, 8),
        city_name: "—",
      });
      useOrderStore.getState().setStatus(orderId, status);
    }, ms);
  });
}
```

### Opsi B: Derive Status dari `paidAt` (recommended)

Tidak butuh `setTimeout` aktif. Saat render `/orders/[id]`, hitung status berdasarkan selisih waktu sekarang vs `paidAt`:

```ts
// src/lib/dummy/status-simulator.ts
const THRESHOLDS_MS = {
  Dijemput: 10_000,
  Dikirim:  20_000,
  Selesai:  30_000,
};

export function deriveStatus(paidAt: string): keyof typeof THRESHOLDS_MS | "Packing" {
  const elapsed = Date.now() - new Date(paidAt).getTime();
  if (elapsed >= THRESHOLDS_MS.Selesai) return "Selesai";
  if (elapsed >= THRESHOLDS_MS.Dikirim) return "Dikirim";
  if (elapsed >= THRESHOLDS_MS.Dijemput) return "Dijemput";
  return "Packing";
}

export function deriveManifest(paidAt: string) {
  const elapsed = Date.now() - new Date(paidAt).getTime();
  const manifest = [
    { code: "PACKING",  desc: "Pesanan sedang disiapkan",     elapsed: 0 },
    { code: "PICKUP",   desc: "Paket dipickup oleh kurir",   elapsed: 10_000 },
    { code: "TRANSIT",  desc: "Paket dalam perjalanan",      elapsed: 20_000 },
    { code: "DELIVERED",desc: "Paket diterima",               elapsed: 30_000 },
  ];
  return manifest.filter((m) => elapsed >= m.elapsed).map((m) => ({
    manifest_code: m.code,
    manifest_description: m.desc,
    manifest_date: new Date(new Date(paidAt).getTime() + m.elapsed).toISOString().slice(0, 10),
    manifest_time: new Date(new Date(paidAt).getTime() + m.elapsed).toTimeString().slice(0, 8),
    city_name: "—",
  }));
}
```

**Keuntungan Opsi B:**
- Survive reload — user F5 di halaman tracking, status tetap konsisten
- Tidak ada memory leak dari `setInterval`
- Hanya butuh re-render → bisa pakai `useEffect` polling 1 detik untuk auto-refresh status di UI

**Rekomendasi:** **pakai Opsi B**. Tidak ada side-effect, idempotent, dan paling mendekati behavior real (server menjadi source of truth).

---

## Lokasi Asset Statis

`public/dummy/`:
- `qris-placeholder.png` — gambar QR code dummy (boleh download dari generator online + tulis "DUMMY" di tengah)
- `logo-jne.png`, `logo-jnt.png`, dst. — logo kurir untuk UI

---

## Tipe TypeScript Terpadu

`src/types/raja-ongkir.ts` — **dipakai untuk dummy & real**:

```ts
export interface Meta {
  message: string;
  code: number;
  status: "success" | "error";
}

export interface ApiResponse<T> {
  meta: Meta;
  data: T;
}

export interface Province { id: number; name: string }
export interface City { id: number; name: string; zip_code: string }
export interface District { id: number; name: string; zip_code: string }

export interface ShippingOption {
  name: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

export type PaymentStatus = "PENDING" | "PAID" | "EXPIRED" | "CANCELLED" | "FAILED";

export interface QrisPayment {
  payment_id: string;
  reference_id: string;
  payment_method: "qris";
  qris_string: string;
  qris_image_url: string;
  amount: number;
  status: PaymentStatus;
  expired_at: string;
  created_at: string;
  paid_at?: string;
}

export interface TrackingManifest {
  manifest_code: string;
  manifest_description: string;
  manifest_date: string;
  manifest_time: string;
  city_name: string;
}

export type OrderShippingStatus =
  | "Packing"
  | "Dijemput"
  | "Dikirim"
  | "Selesai"
  | "Dibatalkan";
```

---

## Konvensi Penamaan

- File mock: prefix `dummy-` atau letakkan di folder `dummy/` — tujuan: **mudah di-grep dan diganti** saat migrasi.
- Function dummy: suffix `Dummy` (mis. `getProvincesDummy`).
- Konstanta seed: `UPPER_SNAKE` dengan prefix `DUMMY_` (mis. `DUMMY_PROVINCES`).

Saat migrasi ke real:

```bash
# cari semua entry point dummy
grep -rn "Dummy\|DUMMY_" src/
```

Hasilnya jadi checklist migrasi.
