# Getting Started

Panduan registrasi, otentikasi, dan environment untuk seluruh modul RajaOngkir × Komerce.

## 1. Registrasi Akun

1. Buat akun di **<https://collaborator.komerce.id/>** (Komerce Collaborator). Akun ini berlaku untuk seluruh modul (RajaOngkir, Komship, Payment, QRISLY).
2. Login → menu **Integration → API Key**.
3. Tersedia beberapa jenis API Key, ambil sesuai modul yang akan dipakai:
   - **RajaOngkir (Shipping Cost)** — untuk pencarian lokasi, kalkulasi ongkir, tracking AWB.
   - **Shipping Delivery (Komship)** — untuk create order kurir, pickup, label, dst.
   - **Payment** — untuk Virtual Account / QRIS.

> Untuk modul **Shipping Delivery** dan **Payment**, API key-nya **sama** (satu key dipakai dua modul). Modul **RajaOngkir Shipping Cost** memakai key tersendiri.

## 2. Base URL

| Modul | Sandbox | Production |
| --- | --- | --- |
| RajaOngkir V2 (Shipping Cost) | `https://rajaongkir.komerce.id/api/v1` *(satu URL, tidak ada sandbox terpisah — gunakan akun trial)* | `https://rajaongkir.komerce.id/api/v1` |
| Komship Delivery API | `https://api-sandbox.collaborator.komerce.id` | `https://api.collaborator.komerce.id` |
| Komerce Payment API | `https://api-sandbox.collaborator.komerce.id/user` | `https://api.collaborator.komerce.id/user` |

> ⚠️ API key sandbox **tidak otomatis** berfungsi di production. Wajib request approval ke admin Komerce sebelum go-live.

## 3. Header Otentikasi

Setiap modul punya nama header berbeda — jangan tertukar.

### Shipping Cost (RajaOngkir V2)

```http
key: <RAJAONGKIR_API_KEY>
```

Contoh:

```bash
curl --location 'https://rajaongkir.komerce.id/api/v1/destination/province' \
  --header 'key: YOUR_API_KEY'
```

### Delivery API (Komship) & Payment API

```http
x-api-key: <KOMERCE_API_KEY>
Content-Type: application/json
```

Contoh:

```bash
curl --location 'https://api-sandbox.collaborator.komerce.id/order/api/v1/orders/detail?order_no=KOMXXXXX' \
  --header 'x-api-key: YOUR_API_KEY'
```

## 4. Konvensi Response

Semua endpoint Komerce/RajaOngkir mengembalikan envelope **konsisten**:

```json
{
  "meta": {
    "message": "Success ...",
    "code": 200,
    "status": "success"
  },
  "data": { /* atau [] */ }
}
```

- `meta.code` mengikuti HTTP status code (200, 201, 400, 401, 422, 500).
- `meta.status` bernilai `"success"` atau `"error"`.
- Saat error, `data` bisa berisi `null` atau `{ "errors": "..." }`.

Lihat [`error-handling.md`](./error-handling.md) untuk daftar code yang sering muncul.

## 5. Setup di Project ThickApparel

Karena project ini masih frontend-only, integrasi RajaOngkir **wajib** lewat Next.js Route Handler agar API key tidak bocor.

### `.env.local` (jangan di-commit)

```env
# RajaOngkir V2 (Shipping Cost)
RAJAONGKIR_API_KEY=your_rajaongkir_key
RAJAONGKIR_BASE_URL=https://rajaongkir.komerce.id/api/v1

# Komship + Payment (satu key, dua modul)
KOMERCE_API_KEY=your_komerce_key
KOMERCE_BASE_URL=https://api-sandbox.collaborator.komerce.id
KOMERCE_PAYMENT_BASE_URL=https://api-sandbox.collaborator.komerce.id/user

# Webhook secret (buat string acak sendiri untuk verifikasi sumber webhook)
KOMERCE_WEBHOOK_SECRET=please_change_me
```

### Pola route handler

```ts
// src/app/api/raja-ongkir/province/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(`${process.env.RAJAONGKIR_BASE_URL}/destination/province`, {
    headers: { key: process.env.RAJAONGKIR_API_KEY! },
    next: { revalidate: 60 * 60 * 24 }, // provinsi nyaris tidak pernah berubah, cache 24 jam
  });
  const json = await res.json();
  return NextResponse.json(json, { status: res.status });
}
```

> Gunakan `next: { revalidate }` untuk meng-cache data lokasi yang jarang berubah (province/city/district). Untuk `calculate-cost` dan `track/waybill` pakai `cache: "no-store"`.

## 6. Rate Limit & Kuota

RajaOngkir tidak mengumumkan angka rate limit eksplisit di dokumentasi publik — yang dipakai adalah **kuota harian/bulanan** berbasis paket berlangganan. Pantau response status `429` dan log error untuk antisipasi throttling.

## 7. Postman Collection

Tim Komerce menyediakan koleksi Postman lengkap:

- Shipping Cost: `/docs/shipping-cost/getting_started/postman_collection`
- Delivery API: `/docs/delivery-order-api/getting_started/postman_collection`

Import koleksi ini saat awal eksplorasi untuk verifikasi response sebelum coding.
