# Komerce Payment API

API pembayaran resmi dari Komerce, terintegrasi langsung dengan akun Collaborator yang dipakai untuk Komship. Mendukung **Virtual Account (VA)** ke bank-bank Indonesia dan **QRIS** dinamis.

- **Base URL Sandbox:** `https://api-sandbox.collaborator.komerce.id/user`
- **Base URL Production:** `https://api.collaborator.komerce.id/user`
- **Header otentikasi:** `x-api-key: <KOMERCE_API_KEY>` (sama dengan Komship) + `Content-Type: application/json`

> Webhook payment di-deliver ke endpoint yang Anda daftarkan di dashboard. Lihat [`webhooks.md`](./webhooks.md#payment-webhook).

## Channel yang Didukung

| Tipe | Channel |
| --- | --- |
| Virtual Account | BCA, BNI, BRI, Mandiri, Permata |
| QRIS | DANA, OVO, GoPay, ShopeePay, LinkAja, mobile banking apapun yang scan QRIS |

---

## Daftar Endpoint

| # | Method | Endpoint | Fungsi |
| - | --- | --- | --- |
| 1 | `GET` | `/api/v1/user/methods` | List payment method yang tersedia |
| 2 | `POST` | `/api/v1/user/payment/create` | Buat transaksi (VA atau QRIS) |
| 3 | `GET` | `/api/v1/user/payment/status/{payment_id}` | Cek status transaksi |
| 4 | `POST` | `/api/v1/user/payment/cancel` | Batalkan transaksi pending |

---

## 1. Get Payment Methods

```http
GET /api/v1/user/methods
```

### cURL

```bash
curl --location 'https://api-sandbox.collaborator.komerce.id/user/api/v1/user/methods' \
  --header 'x-api-key: YOUR_KOMERCE_KEY'
```

### Response (200)

```json
{
  "meta": { "message": "Success Get Payment Methods", "code": 200, "status": "success" },
  "data": {
    "virtual_account": [
      { "code": "BCA",     "name": "Bank BCA",     "fee": 4000 },
      { "code": "BNI",     "name": "Bank BNI",     "fee": 4000 },
      { "code": "MANDIRI", "name": "Bank Mandiri", "fee": 4000 },
      { "code": "BRI",     "name": "Bank BRI",     "fee": 4000 },
      { "code": "PERMATA", "name": "Bank Permata", "fee": 4000 }
    ],
    "qris": [
      { "code": "QRIS", "name": "QRIS", "fee_percent": 0.7 }
    ]
  }
}
```

> Struktur fee per channel bisa berbeda di production — jangan hardcode angka di FE, pull dari endpoint ini.

---

## 2. Create Payment

```http
POST /api/v1/user/payment/create
```

Membuat transaksi pembayaran. Body sedikit berbeda untuk VA vs QRIS.

### 2a. Create Virtual Account

```json
{
  "payment_method": "virtual_account",
  "channel_code": "BCA",
  "amount": 525000,
  "reference_id": "ORD-2025-0001",
  "customer_name": "Budi Santoso",
  "customer_email": "budi@example.com",
  "customer_phone": "081298765432",
  "description": "Pembayaran order ORD-2025-0001 ThickApparel",
  "expired_at": "2025-05-22T23:59:59+07:00"
}
```

### 2b. Create QRIS

```json
{
  "payment_method": "qris",
  "amount": 525000,
  "reference_id": "ORD-2025-0001",
  "customer_name": "Budi Santoso",
  "customer_email": "budi@example.com",
  "description": "Pembayaran order ORD-2025-0001",
  "expired_at": "2025-05-22T23:59:59+07:00"
}
```

### Field

| Field | Type | Required | Keterangan |
| --- | --- | :---: | --- |
| `payment_method` | string | ✅ | `virtual_account` atau `qris` |
| `channel_code` | string | ⚠️ VA only | `BCA`, `BNI`, `MANDIRI`, `BRI`, `PERMATA` |
| `amount` | int | ✅ | Total Rupiah |
| `reference_id` | string | ✅ | ID order Anda sendiri (unik) — biasanya `order.id` |
| `customer_name` | string | ✅ | Nama pelanggan |
| `customer_email` | string | ✅ | Email pelanggan |
| `customer_phone` | string | ❌ | Nomor HP |
| `description` | string | ❌ | Deskripsi transaksi |
| `expired_at` | string (ISO 8601) | ❌ | Batas waktu pembayaran (default 24 jam) |

### cURL (VA)

```bash
curl --location 'https://api-sandbox.collaborator.komerce.id/user/api/v1/user/payment/create' \
  --header 'x-api-key: YOUR_KOMERCE_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "payment_method": "virtual_account",
    "channel_code": "BCA",
    "amount": 525000,
    "reference_id": "ORD-2025-0001",
    "customer_name": "Budi Santoso",
    "customer_email": "budi@example.com",
    "description": "Order ThickApparel"
  }'
```

### Response (201) — VA

```json
{
  "meta": { "message": "Success Create Payment", "code": 201, "status": "success" },
  "data": {
    "payment_id": "pay_8f3b1a2c-7d4e-4a1b-9c0d-1e2f3a4b5c6d",
    "reference_id": "ORD-2025-0001",
    "payment_method": "virtual_account",
    "channel_code": "BCA",
    "virtual_account_number": "8808123456789012",
    "amount": 525000,
    "fee": 4000,
    "status": "PENDING",
    "expired_at": "2025-05-22T23:59:59+07:00",
    "created_at": "2025-05-21T10:00:00+07:00"
  }
}
```

### Response (201) — QRIS

```json
{
  "meta": { "message": "Success Create Payment", "code": 201, "status": "success" },
  "data": {
    "payment_id": "pay_9a3c1b2d-8e4f-4b2c-ad1e-2f3a4b5c6d7e",
    "reference_id": "ORD-2025-0001",
    "payment_method": "qris",
    "qris_string": "00020101021226...520400005303360540710000005802ID5910THICKAPPARE6007JAKARTA61051234062070703A0163041ABC",
    "qris_image_url": "https://api.collaborator.komerce.id/static/qris/pay_xxx.png",
    "amount": 525000,
    "status": "PENDING",
    "expired_at": "2025-05-22T23:59:59+07:00",
    "created_at": "2025-05-21T10:00:00+07:00"
  }
}
```

> `qris_string` adalah payload mentah untuk di-encode jadi QR code (bisa dipakai library `qrcode` di Next.js). `qris_image_url` adalah versi PNG siap pakai.

---

## 3. Get Payment Status

```http
GET /api/v1/user/payment/status/{payment_id}
```

### cURL

```bash
curl --location 'https://api-sandbox.collaborator.komerce.id/user/api/v1/user/payment/status/pay_8f3b1a2c-7d4e-4a1b-9c0d-1e2f3a4b5c6d' \
  --header 'x-api-key: YOUR_KOMERCE_KEY'
```

### Response (200)

```json
{
  "meta": { "message": "Success Get Payment Status", "code": 200, "status": "success" },
  "data": {
    "payment_id": "pay_8f3b1a2c-7d4e-4a1b-9c0d-1e2f3a4b5c6d",
    "reference_id": "ORD-2025-0001",
    "status": "PAID",
    "amount": 525000,
    "paid_at": "2025-05-21T15:30:00+07:00",
    "paid_amount": 525000,
    "payment_method": "virtual_account",
    "channel_code": "BCA"
  }
}
```

### Nilai `status`

| Status | Arti |
| --- | --- |
| `PENDING` | Menunggu pembayaran |
| `PAID` | Sudah dibayar |
| `EXPIRED` | Lewat batas waktu, belum dibayar |
| `CANCELLED` | Dibatalkan oleh merchant |
| `FAILED` | Gagal diproses |

---

## 4. Cancel Payment

```http
POST /api/v1/user/payment/cancel
```

### Request Body

```json
{ "payment_id": "pay_8f3b1a2c-7d4e-4a1b-9c0d-1e2f3a4b5c6d" }
```

### cURL

```bash
curl --location 'https://api-sandbox.collaborator.komerce.id/user/api/v1/user/payment/cancel' \
  --header 'x-api-key: YOUR_KOMERCE_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"payment_id": "pay_xxx"}'
```

### Response (200)

```json
{
  "meta": { "message": "Payment cancelled", "code": 200, "status": "success" },
  "data": { "payment_id": "pay_xxx", "status": "CANCELLED" }
}
```

Hanya bisa cancel saat status masih `PENDING`.

---

## Payment Flow End-to-End

```
1. User confirm checkout di /checkout
        │
        ▼
2. FE call POST /api/komerce/payment/create
   (server-side: lempar ke Komerce /payment/create)
        │
        ▼
3. Komerce balas { payment_id, virtual_account_number | qris_string }
        │
        ▼
4. FE render:
   - VA: tampilkan nomor VA + tombol "Copy" + instruksi bank
   - QRIS: render QR dari qris_string (atau pakai qris_image_url)
        │
        ▼
5. User bayar di app bank / e-wallet
        │
        ▼
6. Webhook Komerce → POST /api/komerce/webhook
   Update order.status = "PAID" di store
        │
        ▼
7. FE polling /api/komerce/payment/status/{id} setiap 5–10 detik
   (sebagai fallback kalau webhook telat) — stop saat status PAID/EXPIRED
        │
        ▼
8. Setelah PAID, trigger create order Komship + pickup request
```

> **Best practice:** percayai webhook sebagai source of truth, tapi tetap polling status sebagai fallback agar UX cepat update kalau webhook lambat.

---

## Implementasi di ThickApparel

### Tipe TypeScript

```ts
// src/types/payment.ts
export type PaymentMethod = "virtual_account" | "qris";
export type PaymentStatus = "PENDING" | "PAID" | "EXPIRED" | "CANCELLED" | "FAILED";

export interface CreatePaymentRequest {
  payment_method: PaymentMethod;
  channel_code?: "BCA" | "BNI" | "MANDIRI" | "BRI" | "PERMATA";
  amount: number;
  reference_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  description?: string;
  expired_at?: string;
}

export interface PaymentVA {
  payment_id: string;
  reference_id: string;
  payment_method: "virtual_account";
  channel_code: string;
  virtual_account_number: string;
  amount: number;
  fee: number;
  status: PaymentStatus;
  expired_at: string;
  created_at: string;
}

export interface PaymentQRIS {
  payment_id: string;
  reference_id: string;
  payment_method: "qris";
  qris_string: string;
  qris_image_url: string;
  amount: number;
  status: PaymentStatus;
  expired_at: string;
  created_at: string;
}
```

### Route Handler — Create Payment

```ts
// src/app/api/komerce/payment/create/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(
    `${process.env.KOMERCE_PAYMENT_BASE_URL}/api/v1/user/payment/create`,
    {
      method: "POST",
      headers: {
        "x-api-key": process.env.KOMERCE_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    },
  );

  return NextResponse.json(await res.json(), { status: res.status });
}
```

### UX di Halaman Checkout

`/checkout` saat ini punya step bar `Cart → Shipping → Payment → Done`. Step **Payment** sekarang harus:

1. Tampilkan pilihan channel dari `/api/komerce/payment/methods`.
2. Saat user pilih channel + klik "Bayar", call `/api/komerce/payment/create`.
3. Redirect ke `/checkout/payment/[payment_id]` yang menampilkan instruksi (VA/QR + countdown sampai `expired_at`).
4. Halaman tersebut polling status tiap 5 detik dan re-render saat status berubah ke `PAID`.

### Catatan Keamanan

- **Verifikasi webhook signature** di route handler — meski docs Komerce belum mendokumentasikan signature, tetap implementasikan check dengan secret di header custom (mis. `X-Komerce-Signature`). Lihat [`webhooks.md`](./webhooks.md).
- **Validasi `amount` di webhook** — bandingkan `data.amount` dengan total order di DB sebelum tandai `PAID`. Jangan percaya FE.
- **Idempotency** — webhook bisa di-deliver berkali-kali. Pakai `payment_id` sebagai unique key saat update order status.
