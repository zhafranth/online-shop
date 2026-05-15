# Integration Guide — ThickApparel × RajaOngkir/Komerce

Panduan konkret cara memasang RajaOngkir + Komship + Komerce Payment ke project **ThickApparel** (Next.js 15 App Router, Zustand, frontend-only saat ini).

> Dokumen ini bersifat **resep**, bukan kode yang sudah jadi. Selalu refer ke file endpoint masing-masing untuk detail parameter aktual.

## 1. Persiapan

### 1.1 Setup Environment

`.env.local` (sudah ada di gitignore):

```env
# Shipping cost
RAJAONGKIR_API_KEY=
RAJAONGKIR_BASE_URL=https://rajaongkir.komerce.id/api/v1

# Komship + Payment (satu key)
KOMERCE_API_KEY=
KOMERCE_BASE_URL=https://api-sandbox.collaborator.komerce.id
KOMERCE_PAYMENT_BASE_URL=https://api-sandbox.collaborator.komerce.id/user

# Webhook secret (random string)
KOMERCE_WEBHOOK_SECRET=

# Asal pengiriman (warehouse ThickApparel)
SHIPPER_NAME=ThickApparel
SHIPPER_PHONE=
SHIPPER_EMAIL=
SHIPPER_ADDRESS=
SHIPPER_DESTINATION_ID=     # district ID warehouse (cari dengan endpoint destination)
SHIPPER_PIN_POINT=          # "lat, lng"
```

### 1.2 Setup Library

Tidak ada package wajib, cukup `fetch` bawaan Next.js. Optional:

- `qrcode` untuk render QRIS string ke canvas (`npm i qrcode @types/qrcode`).
- `zod` untuk validasi payload (`npm i zod`).

## 2. Penambahan ke Struktur Project

### 2.1 Folder Baru

```
src/
├── app/
│   └── api/
│       └── komerce/
│           ├── destinations/
│           │   ├── province/route.ts
│           │   ├── city/[provinceId]/route.ts
│           │   ├── district/[cityId]/route.ts
│           │   └── subdistrict/[districtId]/route.ts
│           ├── shipping/
│           │   ├── cost/route.ts         # POST kalkulasi ongkir
│           │   └── track/route.ts        # GET tracking
│           ├── orders/
│           │   ├── store/route.ts        # POST create
│           │   ├── pickup/route.ts       # POST pickup
│           │   ├── label/route.ts        # POST print
│           │   ├── detail/route.ts       # GET detail
│           │   └── cancel/route.ts       # PUT cancel
│           ├── payment/
│           │   ├── methods/route.ts      # GET list channel
│           │   ├── create/route.ts       # POST create
│           │   ├── status/[id]/route.ts  # GET status
│           │   └── cancel/route.ts       # POST cancel
│           └── webhooks/
│               ├── payment/route.ts
│               └── delivery/route.ts
├── lib/
│   ├── komerce.ts                        # fetch helper + types
│   └── komerce-mappers.ts                # konversi response Komerce → tipe internal
├── stores/
│   ├── shipping-store.ts                 # cache province/city/district/cost
│   └── payment-store.ts                  # state payment yang sedang aktif
└── types/
    ├── shipping.ts
    └── payment.ts
```

### 2.2 Update `next.config.ts`

Tambahkan `qris_image_url` host (kalau pakai gambar QR dari Komerce) ke `images.remotePatterns`:

```ts
{
  protocol: "https",
  hostname: "api.collaborator.komerce.id",
},
{
  protocol: "https",
  hostname: "api-sandbox.collaborator.komerce.id",
}
```

## 3. Flow End-to-End

```
┌─────────────────────────────────────────────────────────────────────┐
│  1. CHECKOUT                                                        │
│  /checkout → user pilih alamat (province → city → district)         │
│  Cache province di RSC (revalidate: 1 week)                         │
│  City/district fetch on-demand via client                           │
└──────────────────────┬──────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│  2. CEK ONGKIR                                                      │
│  user pilih district tujuan → FE call /api/komerce/shipping/cost    │
│  Tampilkan daftar kurir + service + cost + etd                      │
│  User pilih satu, simpan { courier, service, cost } ke cart store   │
└──────────────────────┬──────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│  3. PILIH METODE PEMBAYARAN                                         │
│  FE call /api/komerce/payment/methods (cacheable 5 min)             │
│  User pilih: VA <bank> atau QRIS                                    │
└──────────────────────┬──────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│  4. CREATE ORDER (LOKAL) → CREATE PAYMENT                           │
│  Generate ORD-XXX di order-store                                    │
│  Call /api/komerce/payment/create                                   │
│  Komerce balas { payment_id, virtual_account_number | qris_string } │
│  Simpan ke order.payment di store                                   │
└──────────────────────┬──────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│  5. HALAMAN INSTRUKSI BAYAR (/checkout/pay/[payment_id])            │
│  Tampilkan VA number / QR code + countdown sampai expired_at        │
│  Polling /api/komerce/payment/status/{id} tiap 5 detik              │
│  Webhook /api/komerce/webhooks/payment → push status realtime       │
└──────────────────────┬──────────────────────────────────────────────┘
                       │ PAID
                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│  6. CREATE KOMSHIP ORDER (server side, dipicu oleh webhook PAID)    │
│  Call /api/komerce/orders/store dengan data dari order ThickApparel │
│  Simpan komerceOrderNo ke order                                     │
└──────────────────────┬──────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│  7. ADMIN REQUEST PICKUP                                            │
│  /admin/orders/[id] → tombol "Request Pickup"                       │
│  POST /api/komerce/orders/pickup → AWB terbit                       │
│  Simpan AWB ke order                                                │
└──────────────────────┬──────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│  8. CUSTOMER TRACKING                                               │
│  /orders/[id] → tombol "Lacak"                                      │
│  Webhook delivery juga update order.status realtime                 │
└─────────────────────────────────────────────────────────────────────┘
```

## 4. Perubahan yang Diperlukan di Codebase

### 4.1 Tipe Data

**`src/types/index.ts`** — extend interface produk:

```ts
export interface Product {
  // ... existing
  weight: number;  // gram per pcs — wajib untuk hitung ongkir
}
```

**`src/types/admin.ts`** — extend Order:

```ts
export interface Order {
  id: string;
  // ... existing fields

  // Komship integration
  komerceOrderNo?: string;
  awb?: string;
  courier?: string;
  courierService?: string;
  shippingCost: number;
  shippingStatus?: "Created" | "Packing" | "Diajukan" | "Dijemput" | "Dikirim" | "Selesai" | "Dibatalkan";

  // Address detail (replace flat address)
  shippingAddress: {
    provinceId: number;
    provinceName: string;
    cityId: number;
    cityName: string;
    districtId: number;
    districtName: string;
    zipCode: string;
    fullAddress: string;
    phone: string;
    recipient: string;
  };

  // Payment
  payment?: {
    paymentId: string;
    method: "virtual_account" | "qris";
    channelCode?: string;
    vaNumber?: string;
    qrisString?: string;
    status: "PENDING" | "PAID" | "EXPIRED" | "CANCELLED" | "FAILED";
    expiredAt: string;
    paidAt?: string;
  };
}
```

### 4.2 Seed Data

`src/lib/constants.ts` → setiap `PRODUCTS[i]` perlu field `weight`:

```ts
{
  id: 1,
  name: "Thick Heavyweight Tee",
  // ...
  weight: 350,   // gram
}
```

`src/lib/admin-seeds.ts` → ganti `SEED_ORDERS` agar punya field shipping address detail seperti tipe di atas.

### 4.3 Halaman Checkout

`src/app/checkout/page.tsx` — refactor step "Shipping":

1. Ganti single textarea alamat dengan **4 dropdown** (province / city / district + zip code + alamat detail).
2. Tambah komponen `<ShippingOptions />` yang fetch ongkir setelah district dipilih.
3. Simpan pilihan kurir + ongkir ke `cart-store`.

`src/app/checkout/payment` (baru) — page untuk pilih channel + tampilkan VA/QR.

### 4.4 Halaman Admin

`src/app/admin/orders/[id]/page.tsx` — tambah tombol:

- **Request Pickup** (panggil `/api/komerce/orders/pickup`)
- **Print Label** (panggil `/api/komerce/orders/label`)
- **Cancel Order** (panggil `/api/komerce/orders/cancel`)

Tampilkan AWB, kurir, status terkini.

### 4.5 Halaman Tracking Customer

`src/app/orders/[id]/page.tsx` (atau di profile) — render timeline dari endpoint history AWB.

## 5. Strategi Caching

| Data | TTL | Mekanisme |
| --- | --- | --- |
| Province list | 7 hari | `next: { revalidate: 604800 }` di RSC |
| City list per province | 7 hari | sama |
| District per city | 1 hari | sama |
| Payment methods | 5 menit | `revalidate: 300` |
| Shipping cost | **no cache** | `cache: "no-store"` |
| Tracking AWB | **no cache** | sama |
| Order detail | **no cache** | sama |

## 6. Testing Plan

### Unit / Integration

- Mock fetch dengan `msw` (Mock Service Worker).
- Test mapping response Komerce → tipe internal.
- Test handler webhook untuk semua status.

### Manual E2E (Sandbox)

1. Buat order dengan amount kecil (`amount: 1000`) di sandbox.
2. Pakai VA simulator yang Komerce sediakan → cek webhook PAID masuk.
3. Repeat untuk QRIS.
4. Test cancel order sebelum & sesudah pickup → expected: pertama sukses, kedua gagal `422`.

## 7. Migration Plan (Pendek)

| Sprint | Goal |
| --- | --- |
| Sprint 1 | Endpoint destination + cost (baca-only), terintegrasi di checkout |
| Sprint 2 | Payment API (VA + QRIS), webhook payment, alur PAID |
| Sprint 3 | Komship create order + pickup + label (admin side) |
| Sprint 4 | Tracking AWB di customer side + webhook delivery |
| Sprint 5 | Hardening: idempotency, retry, monitoring, error UX |

## 8. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| API key bocor ke client | Penyalahgunaan kuota | Wajib lewat route handler, tidak pernah di-expose ke FE |
| Webhook tidak masuk | Order stuck PENDING | Polling fallback + cron job rekonsiliasi via Get Status |
| Komerce sandbox ≠ production | Bug muncul saat go-live | UAT lengkap di sandbox, request production access sebelum launch |
| Format response berubah | FE break | Pakai `zod` schema validator di tiap response, log diff |
| Berat produk salah | Ongkir salah → rugi | Audit data `weight` di seed, butuh approval QA sebelum live |

## 9. Referensi Cepat

- Docs resmi: <https://rajaongkir.com/docs>
- Dashboard Collaborator: <https://collaborator.komerce.id/>
- Commodity codes (Lion): [Google Sheets](https://docs.google.com/spreadsheets/d/1aveqmZkts9DLmWKViyuBOGV1ORQYyWgBBoX0sqTiE3A/edit?usp=sharing)
- File dokumentasi terkait di repo ini:
  - [`getting-started.md`](./getting-started.md)
  - [`destinations.md`](./destinations.md)
  - [`shipping-cost.md`](./shipping-cost.md)
  - [`waybill-tracking.md`](./waybill-tracking.md)
  - [`delivery-komship.md`](./delivery-komship.md)
  - [`payment-gateway.md`](./payment-gateway.md)
  - [`qrisly.md`](./qrisly.md)
  - [`webhooks.md`](./webhooks.md)
  - [`error-handling.md`](./error-handling.md)
  - [`couriers.md`](./couriers.md)
