# RajaOngkir × Komerce — Dokumentasi Integrasi

Dokumentasi ini merangkum API **RajaOngkir V2** (sekarang dioperasikan di bawah platform **Komerce**) untuk dipakai sebagai referensi end-to-end di project **ThickApparel** — mulai dari pencarian alamat, perhitungan ongkir, pembuatan order kurir, tracking, sampai pembayaran (Virtual Account / QRIS).

> Sumber utama: <https://rajaongkir.com/docs>. Dokumen ini ditulis ulang dalam Bahasa Indonesia + contoh sesuai konteks Next.js 15 / TypeScript yang dipakai project.

## Struktur Dokumentasi

| File | Isi |
| --- | --- |
| [`getting-started.md`](./getting-started.md) | Cara daftar, ambil API key, base URL sandbox vs production, header autentikasi. |
| [`couriers.md`](./couriers.md) | Daftar kode kurir (`jne`, `sicepat`, `jnt`, dst.) + matriks fitur. |
| [`destinations.md`](./destinations.md) | Endpoint lokasi (Province / City / District / Subdistrict) untuk RajaOngkir V2. |
| [`shipping-cost.md`](./shipping-cost.md) | Endpoint hitung ongkir domestik & internasional. |
| [`waybill-tracking.md`](./waybill-tracking.md) | Endpoint Tracking AWB (RajaOngkir V2). |
| [`delivery-komship.md`](./delivery-komship.md) | Komship Delivery API — buat order, pickup, label, detail, cancel, history, webhook. |
| [`payment-gateway.md`](./payment-gateway.md) | Komerce Payment API — Virtual Account & QRIS. |
| [`qrisly.md`](./qrisly.md) | QRISLY — gateway khusus QRIS dengan webhook & mobile listener. |
| [`webhooks.md`](./webhooks.md) | Format payload webhook (Delivery + Payment + QRISLY) dan rekomendasi handler. |
| [`integration-guide.md`](./integration-guide.md) | Peta integrasi konkret untuk ThickApparel (cart → checkout → payment → tracking). |
| [`error-handling.md`](./error-handling.md) | Format error standar `meta.code` / `meta.status`, retry policy, kode HTTP umum. |

## Arsitektur Singkat

RajaOngkir/Komerce membagi servis-nya menjadi 3 modul yang saling melengkapi:

```
┌──────────────────────────────┐
│  1. RajaOngkir API V2        │  → cari lokasi, hitung ongkir, track AWB
│     (header: key)            │     Base: https://rajaongkir.komerce.id/api/v1
├──────────────────────────────┤
│  2. Komship Delivery API     │  → buat order kurir, pickup, label, history
│     (header: x-api-key)      │     Base: https://api(-sandbox).collaborator.komerce.id
├──────────────────────────────┤
│  3. Komerce Payment / QRISLY │  → VA bank, QRIS, callback webhook
│     (header: x-api-key)      │     Base: https://api(-sandbox).collaborator.komerce.id/user
└──────────────────────────────┘
```

API Key untuk modul 2 & 3 **identik** (dipakai bersama lewat Collaborator dashboard); modul 1 punya API key tersendiri yang dipasang di header `key`.

## Catatan untuk Project ThickApparel

- Saat ini ThickApparel adalah **frontend-only prototype** (lihat `CLAUDE.md` di root). Belum ada API route, store, atau database. Integrasi RajaOngkir nantinya **harus melalui Next.js Route Handler** (`app/api/...`) — **jangan pernah** memanggil API ini langsung dari client karena API key tidak boleh ter-expose ke browser.
- Pakai env var `RAJAONGKIR_API_KEY` (untuk modul Shipping Cost) dan `KOMERCE_API_KEY` (untuk Delivery + Payment).
- Mata uang ditampilkan dengan `formatPrice()` (`src/lib/utils.ts`) — respons cost dari API sudah dalam Rupiah, tinggal di-format.
- Semua satuan berat di Komerce adalah **gram** (`weight=1000` = 1 kg). Sesuaikan dengan field `weight` di tipe produk.

## Quick Reference Endpoint

| Modul | Method | Endpoint |
| --- | --- | --- |
| Province list | `GET` | `/destination/province` |
| City by province | `GET` | `/destination/city/{province_id}` |
| District by city | `GET` | `/destination/district/{city_id}` |
| Subdistrict by district | `GET` | `/destination/sub-district/{district_id}` |
| Hitung ongkir (district level) | `POST` | `/calculate/district/domestic-cost` |
| Hitung ongkir (domestic search) | `POST` | `/calculate/domestic-cost` |
| Hitung ongkir internasional | `POST` | `/calculate/international-cost` |
| Tracking AWB | `POST` | `/track/waybill?awb=...&courier=...` |
| Buat order kurir (Komship) | `POST` | `/order/api/v1/orders/store` |
| Request pickup | `POST` | `/order/api/v1/pickup/request` |
| Print label | `POST` | `/order/api/v1/orders/print-label` |
| Detail order | `GET` | `/order/api/v1/orders/detail` |
| Cancel order | `PUT` | `/order/api/v1/orders/cancel` |
| History AWB | `GET` | `/order/api/v1/orders/history-airway-bill` |
| Daftar payment methods | `GET` | `/user/api/v1/user/methods` |
| Create payment (VA/QRIS) | `POST` | `/user/api/v1/user/payment/create` |
| Status payment | `GET` | `/user/api/v1/user/payment/status/{payment_id}` |
| Cancel payment | `POST` | `/user/api/v1/user/payment/cancel` |

Detail tiap endpoint, parameter, dan contoh response ada di file masing-masing.
