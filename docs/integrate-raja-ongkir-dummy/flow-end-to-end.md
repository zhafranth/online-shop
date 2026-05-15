# Flow End-to-End — Versi Dummy

Walkthrough lengkap setiap step dari sisi user, lengkap dengan: state yang berubah, komponen yang aktif, mock data yang dipakai, dan trigger transisi ke step berikutnya.

## State Machine

```
   CART          SHIPPING_ADDR     COURIER_SELECT     PAYMENT_SELECT
    │                 │                  │                 │
    ▼                 ▼                  ▼                 ▼
 ┌─────┐ ────────▶ ┌─────┐ ─────────▶ ┌─────┐ ────────▶ ┌─────┐
 │Step1│           │Step2│            │Step3│           │Step4│
 └─────┘ ◀──────── └─────┘ ◀───────── └─────┘ ◀──────── └─────┘
                                                            │
                                                            │ klik "Bayar QRIS"
                                                            ▼
                                                       ┌──────────┐
                                                       │PAYMENT_  │
                                                       │PENDING   │
                                                       └──────────┘
                                                            │
                                                            │ tombol "Simulasi Pembayaran"
                                                            ▼
                                                       ┌──────────┐
                                                       │PAYMENT_  │  ← order tercipta + AWB di-generate
                                                       │PAID      │
                                                       └──────────┘
                                                            │
                                                            ▼
                                                       ┌──────────┐
                                                       │SHIPPED   │  ← setTimeout 10s → "Dijemput"
                                                       └──────────┘
                                                            │
                                                            ▼ setTimeout 20s
                                                       ┌──────────┐
                                                       │IN_TRANSIT│  ← "Dikirim"
                                                       └──────────┘
                                                            │
                                                            ▼ setTimeout 30s
                                                       ┌──────────┐
                                                       │DELIVERED │  ← "Selesai"
                                                       └──────────┘
```

> Timing transisi otomatis (10s/20s/30s) **bisa dipendekkan** ke 3s/5s/8s untuk demo, biar user tidak nunggu lama.

---

## Step 1 — Cart (sudah ada)

**Route:** `/cart`

**Yang sudah ada:** halaman cart current sudah berfungsi (lihat `src/app/cart/page.tsx`).

**Tambahan untuk integrasi:**
- Hitung **total berat cart** (`Σ qty × product.weight`). Field `weight` (gram) belum ada di tipe `Product`, **wajib ditambahkan** ke `src/types/index.ts` dan `src/lib/constants.ts`.
- Tombol "Lanjut ke Checkout" → push ke `/checkout`.

**State berubah:** —

---

## Step 2 — Pilih Alamat Pengiriman

**Route:** `/checkout` step "Shipping Address"

### UI

```
┌───────────────────────────────────────────────┐
│  Alamat Pengiriman                            │
├───────────────────────────────────────────────┤
│  Nama Penerima      [_____________________]   │
│  No. HP             [_____________________]   │
│                                               │
│  Provinsi          [▼ Pilih Provinsi      ]   │
│  Kota/Kabupaten    [▼ Pilih Kota          ]   │  ← disabled sampai provinsi dipilih
│  Kecamatan         [▼ Pilih Kecamatan     ]   │  ← disabled sampai kota dipilih
│  Kode Pos          [_____________________]   │  ← auto-fill dari district
│                                               │
│  Alamat Lengkap                               │
│  [_______________________________________]    │
│  [_______________________________________]    │
│                                               │
│              [ Lanjut: Pilih Kurir → ]        │
└───────────────────────────────────────────────┘
```

### Data Source (Dummy)

- **Province list:** dari `dummyDestinations.provinces` (5 provinsi hardcode)
- **City list:** filter `dummyDestinations.cities` by `province_id`
- **District list:** filter `dummyDestinations.districts` by `city_id` (auto-isi `zip_code`)

Lihat [`dummy-data.md`](./dummy-data.md#destinations) untuk seed lengkap.

### Service Call

```ts
// pseudo code di komponen
const provinces = await shippingService.getProvinces();
const cities = await shippingService.getCities(selectedProvinceId);
const districts = await shippingService.getDistricts(selectedCityId);
```

Walaupun hardcode, tetap dibungkus `async` agar swap ke real fetch nanti tidak ubah komponen.

### State Berubah

`shipping-store` (baru):

```ts
useShippingStore.setAddress({
  recipientName: "Budi Santoso",
  phone: "081234567890",
  provinceId: 11, provinceName: "DKI JAKARTA",
  cityId: 153,    cityName: "JAKARTA SELATAN",
  districtId: 2007, districtName: "JAGAKARSA",
  zipCode: "12630",
  fullAddress: "Jl. Mawar No. 1, RT 01/RW 02",
});
```

### Transisi

Tombol "Lanjut" → step 3 (kirim event `SHIPPING_ADDR → COURIER_SELECT`).

---

## Step 3 — Pilih Kurir & Lihat Ongkir

**Route:** `/checkout` step "Shipping Method"

### UI

```
┌───────────────────────────────────────────────────────┐
│  Pilih Kurir                                          │
├───────────────────────────────────────────────────────┤
│  Berat total: 0.7 kg (700 g)                          │
│  Tujuan: JAGAKARSA, JAKARTA SELATAN                   │
│                                                       │
│  ○ JNE       — Reguler          Rp 18.000  (2-3 hari) │
│  ● JNT       — EZ               Rp 17.000  (2-3 hari) │  ← selected
│  ○ SiCepat   — Regular          Rp 19.000  (1-2 hari) │
│  ○ Anteraja  — Reguler          Rp 16.000  (2-4 hari) │
│  ○ POS       — Reguler          Rp 22.000  (3-5 hari) │
│                                                       │
│        [← Ganti Alamat]    [Lanjut: Bayar →]          │
└───────────────────────────────────────────────────────┘
```

### Service Call

```ts
const options = await shippingService.calculateCost({
  originDistrictId: 1391,        // ← hardcoded warehouse: BANDUNG WETAN
  destinationDistrictId: 2007,
  weight: 700,
  couriers: ["jne", "jnt", "sicepat", "anteraja", "pos"],
});
```

### Mock Logic (Dummy)

`DummyShippingService.calculateCost`:

```ts
// pseudocode
const baseCost = computeDummyBaseCost(origin, destination); // pakai jarak provinsi
const weightFactor = Math.ceil(weight / 1000); // per kg
return couriers.map((code) => ({
  name: COURIER_NAMES[code],
  code,
  service: "REG",
  description: "Layanan Reguler",
  cost: (baseCost + COURIER_PREMIUM[code]) * weightFactor,
  etd: ETD_PER_COURIER[code],
}));
```

Rumus simulasi sederhana → user merasakan **variasi harga + variasi durasi**, cukup untuk demo. Detail rumus → [`dummy-data.md`](./dummy-data.md#shipping-cost-formula).

### State Berubah

`cart-store.setShippingOption({ code: "jnt", service: "EZ", cost: 17000, etd: "2-3 day" })`

### Transisi

"Lanjut" → step 4.

---

## Step 4 — Review Order & Pilih Payment

**Route:** `/checkout` step "Payment"

### UI

```
┌────────────────────────────────────────────────────┐
│  Ringkasan Pesanan                                 │
├────────────────────────────────────────────────────┤
│  Thick Heavyweight Tee × 2     Rp 500.000          │
│  Thick Hoodie × 1              Rp 400.000          │
│  ─────────────────────────────────                 │
│  Subtotal                      Rp 900.000          │
│  Ongkir (J&T EZ)               Rp  17.000          │
│  ─────────────────────────────────                 │
│  Total                         Rp 917.000          │
│                                                    │
│  Metode Pembayaran                                 │
│  ● QRIS  (Scan via DANA/OVO/GoPay/BCA mobile)      │
│                                                    │
│  Kirim ke:                                         │
│  Budi Santoso (0812-3456-7890)                     │
│  Jl. Mawar No. 1, RT 01/RW 02                      │
│  JAGAKARSA, JAKARTA SELATAN 12630                  │
│                                                    │
│         [← Ganti Kurir]    [Bayar Sekarang →]      │
└────────────────────────────────────────────────────┘
```

### Service Call

Saat tombol "Bayar Sekarang":

```ts
// 1. Generate order di order-store
const order = useOrderStore.create({
  items: cart.items,
  shippingAddress: shipping.address,
  shippingOption: cart.shippingOption,
  subtotal, total,
  status: "AWAITING_PAYMENT",
});

// 2. Generate payment session
const payment = await paymentService.createQris({
  amount: total,
  referenceId: order.id,
  customerName: shipping.address.recipientName,
});

// 3. Simpan ke payment-store + push ke halaman QR
usePaymentStore.start(payment);
router.push(`/checkout/pay/${payment.payment_id}`);
```

### Mock Output `paymentService.createQris`

```json
{
  "payment_id": "pay_DUM_20250515_AB12CD",
  "reference_id": "ORD-2025-0001",
  "payment_method": "qris",
  "qris_string": "DUMMY-QRIS-PAYLOAD-ORD-2025-0001-917000",
  "qris_image_url": "/dummy/qris-placeholder.png",
  "amount": 917000,
  "status": "PENDING",
  "expired_at": "2025-05-15T10:30:00+07:00",
  "created_at": "2025-05-15T10:00:00+07:00"
}
```

---

## Step 5 — Halaman Pembayaran QRIS

**Route:** `/checkout/pay/[payment_id]`

### UI

```
┌────────────────────────────────────────────────┐
│  Bayar via QRIS                                │
├────────────────────────────────────────────────┤
│  Total: Rp 917.000                             │
│                                                │
│            ▓▓▓ ▓▓▓ ▓ ▓                         │
│            ▓ ▓ ▓ ▓ ▓ ▓                         │
│            ▓▓  ▓ ▓ ▓▓     ← QR code dummy      │
│            ▓ ▓ ▓ ▓ ▓ ▓                         │
│            ▓▓▓ ▓▓▓ ▓ ▓                         │
│                                                │
│  Scan dengan aplikasi:                         │
│  DANA · OVO · GoPay · ShopeePay · BCA Mobile   │
│                                                │
│  ⏱  Bayar sebelum: 28:45                       │
│                                                │
│  ┌──────────────────────────────────────────┐  │
│  │ 🔧 [Simulasi Pembayaran Sukses]          │  │ ← hanya muncul di dev mode
│  │ 🔧 [Simulasi Pembayaran Expired]         │  │
│  └──────────────────────────────────────────┘  │
└────────────────────────────────────────────────┘
```

### Behavior

- **QR Code Render:** pakai library `qrcode.react` dengan input `qris_string` dummy. Sesungguhnya tidak bisa di-scan (string-nya placeholder), tapi visual-nya seperti QRIS asli.
- **Countdown:** dari `expired_at` (default 30 menit). Saat habis → state `EXPIRED`.
- **Polling Simulasi:** `useEffect` polling `paymentService.getStatus(payment_id)` tiap 3 detik. Karena dummy, status hanya berubah lewat tombol simulasi.
- **Tombol Simulasi Pembayaran Sukses** (visible **only when** `process.env.NODE_ENV !== "production"` atau env `NEXT_PUBLIC_PAYMENT_DEBUG=true`):
  - Set status `payment-store` → `PAID`
  - Update `order-store` order tersebut → status `PAID`
  - Generate **dummy AWB** = `"DUM" + Date.now() + 4-random-digit`
  - Auto-redirect ke `/orders/[orderId]/success`
- **Tombol Simulasi Expired:** set status → `EXPIRED`, tampilkan banner "Pembayaran kadaluarsa, silakan order ulang."

### Catatan UX

- Tampilkan **instruksi bayar** (langkah-langkah scan) sebagai accordion di bawah QR — supaya saat swap ke real, layout sudah siap.
- **Tombol "Sudah Bayar"** untuk customer (selain tombol Simulasi yang dev-only): bisa dipakai untuk re-check status. Di dummy mode, tombol ini sama dengan polling.

---

## Step 6 — Order Created

**Route:** `/orders/[orderId]/success`

### UI

```
┌──────────────────────────────────────────────┐
│  ✓ Pembayaran Berhasil!                      │
├──────────────────────────────────────────────┤
│  No. Pesanan : ORD-2025-0001                 │
│  AWB         : DUM17157321094821             │
│  Kurir       : J&T Express (EZ)              │
│  Total       : Rp 917.000                    │
│  Status      : Sedang dikemas                │
│                                              │
│  Pesanan kamu akan segera diproses ✨        │
│                                              │
│       [Lacak Pesanan]    [Lihat Order]       │
└──────────────────────────────────────────────┘
```

### State Berubah

```ts
useOrderStore.update(order.id, {
  status: "Packing",
  awb: "DUM17157321094821",
  paymentStatus: "PAID",
  paidAt: new Date().toISOString(),
});

// trigger auto-status-update simulator
startStatusSimulator(order.id);  // setTimeout chain
```

---

## Step 7 — Tracking / Order Detail

**Route:** `/orders/[orderId]` (atau `/admin/orders/[id]` untuk admin)

### UI

```
┌────────────────────────────────────────────────────┐
│  Detail Pesanan ORD-2025-0001                      │
├────────────────────────────────────────────────────┤
│  AWB: DUM17157321094821  |  J&T EZ                 │
│                                                    │
│  ●─── Packing                Hari ini, 10:00       │
│  │    Pesanan sedang disiapkan                     │
│  │                                                 │
│  ●─── Dijemput               Hari ini, 10:00:10    │   ← simulasi: +10s
│  │    Paket telah dipickup di Gudang Bandung       │
│  │                                                 │
│  ●─── Dikirim                Hari ini, 10:00:20    │   ← +20s
│  │    Paket sedang dalam perjalanan ke JAKSEL      │
│  │                                                 │
│  ○─── Selesai                (belum)               │   ← +30s
│       Paket telah diterima                         │
│                                                    │
│  ─────────────────────────────────────             │
│  Item:                                             │
│   • Thick Heavyweight Tee × 2                      │
│   • Thick Hoodie × 1                               │
└────────────────────────────────────────────────────┘
```

### Mock Logic — Status Simulator

`src/lib/dummy/status-simulator.ts`:

```ts
const STATUS_CHAIN: Array<{ delayMs: number; status: OrderStatus; desc: string }> = [
  { delayMs: 10_000, status: "Dijemput", desc: "Paket telah dipickup oleh kurir" },
  { delayMs: 20_000, status: "Dikirim",  desc: "Paket dalam perjalanan ke kota tujuan" },
  { delayMs: 30_000, status: "Selesai",  desc: "Paket telah diterima oleh penerima" },
];

export function startStatusSimulator(orderId: string) {
  STATUS_CHAIN.forEach(({ delayMs, status, desc }) => {
    setTimeout(() => {
      useOrderStore.getState().appendManifest(orderId, {
        manifest_code: status.toUpperCase(),
        manifest_description: desc,
        manifest_date: new Date().toISOString().slice(0, 10),
        manifest_time: new Date().toISOString().slice(11, 19),
        city_name: "—",
      });
      useOrderStore.getState().updateStatus(orderId, status);
    }, delayMs);
  });
}
```

> Karena pakai `setTimeout`, simulator **hilang saat reload**. Untuk demo yang lebih stabil, simpan `paidAt` ke order dan **hitung status realtime saat render** berdasarkan selisih waktu sekarang vs `paidAt` (10s/20s/30s threshold). Detail di [`dummy-data.md`](./dummy-data.md#auto-status-progression).

---

## Edge Case yang Disimulasikan

| Skenario | Cara Trigger | Expected |
| --- | --- | --- |
| QR expired tanpa bayar | Tunggu countdown / klik "Simulasi Expired" | Banner "kadaluarsa" + tombol order ulang |
| User refresh di tengah pembayaran | Reload `/checkout/pay/[id]` | Halaman re-render dari `payment-store` (persisted); countdown lanjut |
| User refresh setelah PAID | Reload `/orders/[id]` | Status dihitung ulang dari `paidAt` (lihat catatan simulator) |
| Cart kosong saat ke checkout | Klik link `/checkout` tanpa item | Redirect ke `/cart` |
| Order detail tidak ditemukan | Buka `/orders/XYZ-123` random | Tampilkan 404-ish "Pesanan tidak ditemukan" |

---

## Diagram Flow Antar-Komponen

```
┌─────────────────────┐    ┌──────────────────────┐
│ <CheckoutAddress/>  │───▶│ shippingService      │
│                     │    │  .getProvinces()     │
│                     │    │  .getCities()        │
│                     │    │  .getDistricts()     │
└──────────┬──────────┘    └──────────────────────┘
           │
           ▼ setAddress
┌─────────────────────┐
│ shippingStore       │
└─────────────────────┘
           │
           ▼
┌─────────────────────┐    ┌──────────────────────┐
│ <CourierOptions/>   │───▶│ shippingService      │
│                     │    │  .calculateCost()    │
└──────────┬──────────┘    └──────────────────────┘
           │
           ▼ setShippingOption
┌─────────────────────┐
│ cartStore           │
└─────────────────────┘
           │
           ▼
┌─────────────────────┐    ┌──────────────────────┐
│ <PaymentChoose/>    │───▶│ paymentService       │
│                     │    │  .createQris()       │
└──────────┬──────────┘    └──────────────────────┘
           │
           ▼ start
┌─────────────────────┐
│ paymentStore        │ ─── countdown ─── │
│ + orderStore.create │ ─── polling ────  │
└──────────┬──────────┘                   │
           │                              │
           ▼                              ▼
┌─────────────────────┐    ┌──────────────────────┐
│ <QrisPaymentPage/>  │◀───│ paymentService       │
│                     │    │  .getStatus()        │
└──────────┬──────────┘    └──────────────────────┘
           │
           ▼ klik "Simulasi Bayar"
┌─────────────────────┐
│ orderStore.update(  │
│  paymentStatus=PAID │
│  awb=DUMxxx)        │
└──────────┬──────────┘
           │
           ▼ startStatusSimulator
┌─────────────────────┐
│ <OrderTracking/>    │
│ (status auto-update)│
└─────────────────────┘
```

Detail data + interface tiap service → [`dummy-data.md`](./dummy-data.md) & [`adapter-pattern.md`](./adapter-pattern.md).
