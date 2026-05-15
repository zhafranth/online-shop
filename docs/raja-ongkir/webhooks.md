# Webhooks — Delivery, Payment, QRISLY

Komerce mengirim event asinkron ke endpoint Anda untuk **3 sumber** terpisah. Setiap sumber punya payload format sendiri; pastikan route handler dipisah.

| Sumber | Daftarkan di | Path Suggested |
| --- | --- | --- |
| Komship Delivery | Dashboard → Webhook → Delivery | `/api/komerce/webhooks/delivery` |
| Komerce Payment | Dashboard → Webhook → Payment | `/api/komerce/webhooks/payment` |
| QRISLY | Dashboard → Webhook → QRISLY | `/api/qrisly/webhook` |

## 1. Delivery Webhook (Komship)

### Cara Pendaftaran

Lewat **PUT** request ke endpoint Komerce (path persisnya ada di docs), atau lewat dashboard menu Integration → Webhook. URL endpoint harus **HTTPS**.

### Event Status

Status yang bisa di-deliver lewat webhook:

| Status | Arti |
| --- | --- |
| `Diajukan` | Pickup di-request |
| `Dijemput` | Kurir sudah pickup |
| `Dikirim` | Dalam perjalanan |
| `Dibatalkan` | Dibatalkan |
| `Selesai` | Sampai ke penerima (POD) |

### Payload (estimasi)

```json
{
  "order_no": "KOM2025051512345",
  "cnote": "JNE12345678",
  "status": "Dikirim"
}
```

| Field | Keterangan |
| --- | --- |
| `order_no` | Order number Komship |
| `cnote` | AWB / nomor resi |
| `status` | Salah satu nilai di tabel di atas |

### Required Response

Endpoint Anda wajib balas HTTP `200`. Tidak ada signature standar — gunakan path rahasia + verifikasi balik via `GET /orders/detail` untuk pastikan order benar.

---

## 2. Payment Webhook (Komerce Payment)

Webhook Payment dikirim saat status payment berubah ke terminal state (`PAID`, `EXPIRED`, `FAILED`).

### Payload (umum)

```json
{
  "event": "payment.paid",
  "timestamp": "2025-05-21T15:30:00+07:00",
  "data": {
    "payment_id": "pay_8f3b1a2c-7d4e-4a1b-9c0d-1e2f3a4b5c6d",
    "reference_id": "ORD-2025-0001",
    "amount": 525000,
    "paid_amount": 525000,
    "status": "PAID",
    "payment_method": "virtual_account",
    "channel_code": "BCA",
    "paid_at": "2025-05-21T15:30:00+07:00"
  }
}
```

### Event Types

| Event | Trigger |
| --- | --- |
| `payment.paid` | Pembayaran sukses |
| `payment.expired` | Lewat `expired_at` tanpa terbayar |
| `payment.failed` | Diproses tapi gagal (mis. timeout di bank) |
| `payment.cancelled` | Di-cancel oleh merchant |

### Idempotency

Kombinasi `payment_id` + `event` adalah **idempotency key**. Pastikan handler tidak proses event yang sama dua kali.

---

## 3. QRISLY Webhook

Lihat detail di [`qrisly.md`](./qrisly.md#webhook).

| Event | Trigger |
| --- | --- |
| `payment.success` | QRIS terbayar |
| `payment.expired` | QR code expired |

Retry policy: 1m → 5m → 15m setelah non-2xx response.

---

## Pola Implementasi di Next.js

### Route Handler Generic

```ts
// src/app/api/komerce/webhooks/payment/route.ts
import { NextResponse } from "next/server";
import { useOrderStore } from "@/stores/order-store";

export async function POST(req: Request) {
  const secretHeader = req.headers.get("x-webhook-secret");
  if (secretHeader !== process.env.KOMERCE_WEBHOOK_SECRET) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const payload = await req.json();
  const { event, data } = payload;

  // VERIFIKASI BALIK — jangan trust payload mentah
  const verify = await fetch(
    `${process.env.KOMERCE_PAYMENT_BASE_URL}/api/v1/user/payment/status/${data.payment_id}`,
    { headers: { "x-api-key": process.env.KOMERCE_API_KEY! }, cache: "no-store" },
  );
  const verifyJson = await verify.json();

  if (verifyJson?.data?.status !== data.status) {
    return NextResponse.json({ ok: false, reason: "mismatch" }, { status: 409 });
  }

  // TODO: update order di DB / Zustand store via server action
  console.log("[webhook] payment", event, data.reference_id, data.status);

  return NextResponse.json({ success: true, message: "Webhook received" });
}
```

### Verifikasi Balik (Anti-spoofing)

Karena docs Komerce belum menyediakan signature HMAC, gunakan **strategi 2-langkah**:

1. **Path rahasia / secret di header custom** untuk filter request kasar.
2. **Verifikasi balik** lewat `GET /payment/status/{id}` atau `GET /orders/detail` — bandingkan status di payload dengan status di API resmi. Hanya commit perubahan kalau dua-duanya cocok.

### Idempotency dengan Database

```ts
// Pseudocode
const eventKey = `${data.payment_id}:${event}`;
const exists = await db.webhookEvents.findUnique({ where: { key: eventKey } });
if (exists) return new NextResponse("Already processed", { status: 200 });

await db.$transaction([
  db.webhookEvents.create({ data: { key: eventKey, processedAt: new Date() } }),
  db.orders.update({ where: { id: data.reference_id }, data: { status: "PAID" } }),
]);
```

Karena project ini belum punya DB, untuk MVP cukup pakai in-memory Map / Vercel KV / Redis sebagai store idempotency.

### Logging

Setiap webhook **selalu** log payload mentah (mask data sensitif) untuk audit:

```ts
console.info(JSON.stringify({
  source: "komerce-payment",
  event,
  payment_id: data.payment_id,
  reference_id: data.reference_id,
  status: data.status,
  received_at: new Date().toISOString(),
}));
```

---

## Testing Webhook di Local

Karena Komerce harus bisa hit URL publik, gunakan tunnel saat development:

```bash
# pakai ngrok
ngrok http 3000

# pakai cloudflared (gratis)
cloudflared tunnel --url http://localhost:3000
```

Daftarkan URL `https://xxx.ngrok.io/api/komerce/webhooks/payment` di dashboard sandbox Komerce.

## Checklist Kesiapan Webhook

- [ ] Endpoint pakai HTTPS (di production)
- [ ] Selalu return `200` setelah berhasil baca payload
- [ ] Verifikasi balik via API resmi sebelum mutasi data
- [ ] Idempotency check (`payment_id` + `event`)
- [ ] Logging payload (masked)
- [ ] Timeout handler <5 detik (kalau berat, simpan ke queue dulu)
- [ ] Test scenario: `paid`, `expired`, retry, duplikat
