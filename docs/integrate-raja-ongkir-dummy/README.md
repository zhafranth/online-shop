# Integrasi RajaOngkir — Versi Dummy (No DB)

Dokumen ini berisi **plan + flow end-to-end** untuk memasang fitur shipping (RajaOngkir/Komship) dan payment QRIS (Komerce Payment) ke ThickApparel **dengan semua data masih hardcode/dummy**, tanpa database.

> Tujuan: pengguna (admin & customer) bisa "merasakan" flow lengkap — pilih alamat → cek ongkir → pilih kurir → bayar QRIS → cek tracking — **persis seperti production**, hanya saja semua respons API disimulasikan secara lokal. Saat siap, tinggal swap layer adapter ke endpoint asli RajaOngkir (lihat [`docs/raja-ongkir/`](../raja-ongkir/README.md)).

## File di Folder Ini

| File | Isi |
| --- | --- |
| [`flow-end-to-end.md`](./flow-end-to-end.md) | Diagram + langkah-langkah user journey dari halaman katalog → tracking pesanan |
| [`dummy-data.md`](./dummy-data.md) | Struktur seed data tiruan untuk province/city/district/courier/payment + format response yang persis match RajaOngkir |
| [`implementation-checklist.md`](./implementation-checklist.md) | Daftar konkret file/komponen yang dibuat per stage, urutan kerjaan |
| [`adapter-pattern.md`](./adapter-pattern.md) | Pola "service adapter" — satu interface, dua implementasi (`dummy` vs `real`) — supaya migrasi ke API beneran cuma ganti env var |

## Prinsip Desain

### 1. Adapter Pattern, Bukan Hardcode di Komponen

```
Komponen UI
   │
   │ memanggil ── ShippingService (interface)
   │                   ├── DummyShippingService   ← AKTIF SEKARANG
   │                   └── RajaOngkirShippingService  ← nanti
```

Komponen `<ShippingOptions />` cukup tahu cara memanggil `shippingService.calculateCost(...)`. Apakah hasilnya dari hardcode array atau dari `fetch('https://rajaongkir.komerce.id/...')` — itu urusan implementasi service, **bukan urusan komponen**.

### 2. Bentuk Response = Bentuk RajaOngkir Asli

Mock data **wajib** mengikuti struktur response RajaOngkir (envelope `{ meta, data }` + field-field konsisten). Lihat [`dummy-data.md`](./dummy-data.md). Manfaatnya:
- Tipe TypeScript yang sama dipakai untuk dummy & real
- Saat swap ke real, **zero perubahan** di komponen
- Bisa unit-test mapper/transformer dengan respons mock

### 3. Zustand Sebagai "Fake Backend"

ThickApparel sudah punya pattern Zustand + `persist` middleware (`thickapparel-*` di localStorage). Pakai itu sebagai "database":

| Store | Peran sebagai "backend" |
| --- | --- |
| `cart-store` | Cart aktif, shipping options yang dipilih |
| `order-store` | Order yang dibuat (sudah ada) — tambah field `awb`, `paymentStatus` |
| `payment-store` *(baru)* | Sesi pembayaran QRIS aktif (countdown, status PENDING/PAID/EXPIRED) |
| `shipping-store` *(baru)* | Cache lokasi yang dipilih user (province/city/district) |

### 4. Simulasi Webhook = Tombol

Karena tidak ada webhook receiver, simulasikan dengan:
- **Tombol "Simulasi Pembayaran"** di halaman payment → ubah status `PENDING → PAID` di store
- **`setTimeout`** untuk auto-update status pengiriman: `Dijemput` → `Dikirim` → `Selesai` (tiap 10–30 detik supaya user lihat perubahan)

### 5. Tidak Pakai Route Handler Dulu

Karena tidak ada API beneran yang di-hit, semua "service" dijalankan **client-side** sebagai fungsi TypeScript biasa. Saat swap ke real RajaOngkir, **wajib** pindah ke Route Handler (`app/api/...`) supaya API key aman.

## Gambaran Singkat Flow

```
[Catalog] → [Cart] → [Checkout] ─┐
                                 │
              ┌──────────────────┘
              ▼
    1. Pilih Alamat
       (province → city → district)  ← DUMMY: 5 prov × beberapa kota
              │
              ▼
    2. Pilih Kurir & Lihat Ongkir
       (calculate cost)              ← DUMMY: rumus jarak sederhana
              │
              ▼
    3. Review & Pilih QRIS
              │
              ▼
    4. Halaman Pembayaran
       (QR code + countdown)         ← DUMMY: QR placeholder + tombol "Bayar"
              │
              ▼  klik "Simulasi Pembayaran"
    5. Order Confirmed
       (status PAID, AWB di-generate)← DUMMY: AWB = "DUM" + 10 digit random
              │
              ▼
    6. Halaman Order Detail / Tracking
       (timeline status)             ← DUMMY: status auto-update via setTimeout
```

Detail tiap step + contoh data + komponen yang dibuat → lihat [`flow-end-to-end.md`](./flow-end-to-end.md).

## Apa yang BUKAN Ada di Dummy

Untuk transparansi, **fitur ini tidak akan ada** di versi dummy (semua akan masuk versi real):

- Validasi nomor HP / format alamat realtime
- Multi-warehouse origin
- Asuransi & commodity code (kurir Lion)
- COD (Cash on Delivery)
- Pengiriman internasional
- Print label PDF (cuma display info, tidak generate PDF)
- Pickup scheduling (langsung anggap pickup OK begitu order dibuat)

## Trade-off

| Aspek | Versi Dummy | Versi Real |
| --- | --- | --- |
| Setup | Tidak butuh API key | Butuh akun Komerce + 2 API key |
| Ongkir akurat? | ❌ (rumus simulasi) | ✅ |
| QR Code valid? | ❌ (placeholder) | ✅ bisa di-scan beneran |
| Webhook | Tombol simulasi | Webhook beneran masuk |
| Cocok untuk | Demo investor, prototyping UX, internal review | Production |

## Migration Path

Setelah versi dummy approved, untuk swap ke real:

1. Daftar akun di <https://collaborator.komerce.id/>, ambil API key
2. Buat file `.env.local` dengan key (lihat [`docs/raja-ongkir/getting-started.md`](../raja-ongkir/getting-started.md#5-setup-di-project-thickapparel))
3. Buat Route Handler `app/api/komerce/*` (struktur folder ada di [`docs/raja-ongkir/integration-guide.md`](../raja-ongkir/integration-guide.md#21-folder-baru))
4. Tulis `RajaOngkirShippingService` & `RajaOngkirPaymentService` yang implement interface yang sama dengan Dummy version
5. Ganti env flag `NEXT_PUBLIC_USE_DUMMY_RAJAONGKIR=false`
6. Komponen UI tidak perlu diubah

Lebih detail di [`adapter-pattern.md`](./adapter-pattern.md).
