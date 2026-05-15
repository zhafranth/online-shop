# QRISLY

**QRISLY** adalah produk turunan dari Komerce yang fokus pada **QRIS dinamis** dengan fitur tambahan seperti mobile app listener, dashboard monitoring real-time, dan webhook retry policy. Cocok untuk merchant yang **hanya** butuh QRIS (tanpa VA).

> Untuk ThickApparel yang menerima banyak channel (VA + QRIS + COD nantinya), **Komerce Payment API** (lihat [`payment-gateway.md`](./payment-gateway.md)) sudah cukup. **QRISLY tepat dipilih** kalau ingin pengalaman QRIS yang lebih kaya (mobile listener untuk kasir, dashboard sendiri, dst).

## Fitur Utama

- **Dynamic QR generation** — amount custom + unique reference ID
- **Real-time monitoring** via dashboard
- **Webhook** dengan retry otomatis (1m → 5m → 15m)
- **Mobile App Listener** — aplikasi Android untuk monitoring transaksi langsung di HP kasir
- **Multi-provider** — backend mengarahkan ke beberapa PJSP QRIS
- **API key authentication + rate limiting**
- SLA 99.9% uptime

## Endpoint Inti

Detail path dan parameter persis ada di:

- <https://www.rajaongkir.com/docs/qrisly/getting-started/available-endpoints>

Empat operasi utama:

1. **Create QR** — generate QRIS dinamis untuk satu transaksi
2. **Get Status** — cek status transaksi by ID
3. **List Transactions** — riwayat transaksi (filter by date/status)
4. **Cancel / Refund** — batalkan transaksi (kalau didukung provider)

Header otentikasi sama dengan Komerce Payment: `x-api-key: <KEY>`.

## Webhook

Webhook QRISLY didaftarkan di dashboard pada menu **Webhook → QRISLY → Outbound Webhook**.

### Event Types

| Event | Trigger |
| --- | --- |
| `payment.success` | Pembayaran diterima |
| `payment.expired` | QR code expired sebelum dibayar |

### Payload Example (`payment.success`)

```json
{
  "event": "payment.success",
  "timestamp": "2025-05-14T10:35:22Z",
  "data": {
    "history_id": "8c5b8e8d-7b22-3e31-7a0e-0d5a2d1d6c09",
    "qris_id": "9d6c9f9e-8c33-4f42-8b1f-0e6a3e2e7d10",
    "amount": 100001,
    "original_amount": 100000,
    "status": "paid",
    "paid_at": "2025-05-14T10:35:22Z",
    "payment_method": "Bank Transfer",
    "payment_provider": "Bank BCA",
    "created_at": "2025-05-14T10:30:00Z"
  }
}
```

> Perhatikan: `amount` (yang diterima) bisa berbeda dengan `original_amount` (yang ditagihkan) karena tail-digit unique amount yang dipakai untuk reconciliation otomatis.

### Required Response

Endpoint webhook Anda **wajib** balas HTTP `200` + JSON valid:

```json
{ "success": true, "message": "Webhook received and processed" }
```

### Retry Policy

Jika non-2xx, QRISLY otomatis retry dengan delay:

1. 1 menit
2. 5 menit
3. 15 menit

Setelah 3 kali gagal, event akan ditandai failed di dashboard.

### Tanpa Signature (Saat Ini)

Dokumentasi QRISLY **tidak** menyebut signature verification (HMAC, dsb.). Untuk amankan endpoint webhook:

1. Pakai **path rahasia** (mis. `/api/qrisly/webhook/{random-uuid}`) sebagai bentuk shared secret implisit.
2. Whitelist IP source dari Komerce di reverse-proxy / Vercel firewall (jika diumumkan).
3. Selalu **verifikasi** transaksi balik ke endpoint Get Status sebelum mark order sebagai PAID — jangan trust payload mentah.

## Mobile App Listener

Komerce menyediakan APK Android untuk pasang di HP yang berfungsi sebagai listener notifikasi QRIS — cocok untuk toko fisik. Untuk ThickApparel (online), fitur ini **tidak diperlukan**.

Lihat: <https://www.rajaongkir.com/docs/qrisly/getting-started/mobile-application>

## Error Handling

Kode error mengikuti standar `meta.code` + `meta.status`. Daftar khusus QRISLY di:

<https://www.rajaongkir.com/docs/qrisly/getting-started/error-handling>

Lihat juga [`error-handling.md`](./error-handling.md) untuk pola umum di seluruh API Komerce.
