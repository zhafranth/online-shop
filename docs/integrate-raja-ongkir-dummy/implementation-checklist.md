# Implementation Checklist

Urutan pengerjaan konkret untuk membangun versi dummy ini. Diatur jadi **5 milestone**, masing-masing bisa di-demo terpisah ke stakeholder.

> Tandai `[x]` di repo branch saat sudah selesai. Setiap milestone diakhiri dengan **smoke test manual**.

---

## Milestone 1 — Pondasi (Types + Services + Stores)

**Tujuan:** rangka adapter & store siap, walau belum dipakai komponen.

- [ ] Buat folder + file kosong:
  ```
  src/types/raja-ongkir.ts
  src/services/raja-ongkir/types.ts
  src/services/raja-ongkir/index.ts
  src/services/raja-ongkir/dummy/shipping.dummy.ts
  src/services/raja-ongkir/dummy/payment.dummy.ts
  src/lib/dummy/destinations.ts
  src/lib/dummy/couriers.ts
  src/lib/dummy/shipping-cost.ts
  src/lib/dummy/payment-channels.ts
  src/lib/dummy/awb-generator.ts
  src/lib/dummy/status-simulator.ts
  src/stores/shipping-store.ts
  src/stores/payment-store.ts
  ```
- [ ] Definisi tipe terpadu di `src/types/raja-ongkir.ts` (lihat [`dummy-data.md`](./dummy-data.md#tipe-typescript-terpadu))
- [ ] Interface `ShippingService` & `PaymentService` di `services/raja-ongkir/types.ts` (lihat [`adapter-pattern.md`](./adapter-pattern.md#interface-kontrak))
- [ ] Seed data: `DUMMY_PROVINCES`, `DUMMY_CITIES`, `DUMMY_DISTRICTS`, courier constants
- [ ] Implementasi `dummyShippingService` & `dummyPaymentService`
- [ ] Factory `services/raja-ongkir/index.ts` yang export `shippingService` & `paymentService`
- [ ] `shipping-store.ts` — state: `address: ShippingAddress | null`, action: `setAddress`, `reset`
- [ ] `payment-store.ts` — state: `sessions: Record<string, QrisPayment>`, action: `add`, `markPaid`, `cancel`, `expire`
- [ ] Extend `order-store.ts` — tambah field `awb?`, `paymentStatus?`, `paidAt?`, `shippingStatus?`, `manifest?: TrackingManifest[]`
- [ ] Smoke test: di komponen apapun, call `await shippingService.getProvinces()` → console.log hasilnya.

---

## Milestone 2 — Update Product Type & Checkout Skeleton

**Tujuan:** field berat ada di setiap produk; halaman checkout punya step state machine.

- [ ] **Update tipe Product** di `src/types/index.ts`:
  ```ts
  export interface Product {
    // ... existing
    weight: number; // gram per pcs
  }
  ```
- [ ] **Backfill weight** di seed `src/lib/constants.ts`:
  - Kaos / tee: 350 g
  - Hoodie: 700 g
  - Jaket: 900 g
  - Topi / aksesoris: 150 g
- [ ] Helper `useCartStore.totalWeight()` — sum `qty × weight`
- [ ] **Refactor `/checkout`** jadi state machine 4 step:
  ```ts
  type CheckoutStep = "address" | "courier" | "payment" | "review";
  ```
  Pakai `useState` + komponen per-step. Tombol back/next mengubah state.
- [ ] Komponen step-bar (sudah ada `StepBar` di `src/components/ui/`)
- [ ] Smoke test: navigasi step bisa back & forward tanpa data hilang.

---

## Milestone 3 — Address & Shipping Cost

**Tujuan:** user bisa pilih alamat → lihat opsi kurir + ongkir dummy.

- [ ] Komponen `<CheckoutAddress />`:
  - Dropdown Province (initial mount, fetch via `shippingService.getProvinces()`)
  - Dropdown City (disabled until province selected; fetch via `getCities`)
  - Dropdown District (similar)
  - Input recipient name, phone, zip code (auto-fill), full address
  - Validasi minimum: semua field wajib + phone format
  - Tombol "Lanjut" → simpan ke `shippingStore.setAddress` + transisi step
- [ ] Komponen `<CourierOptions />`:
  - On mount (atau saat address berubah) → call `shippingService.calculateCost`
  - Render radio list: nama kurir, service, cost (`formatPrice`), etd
  - Highlight pilihan tersimpan di `cartStore.shippingOption`
  - Tombol "Lanjut: Bayar" → simpan + transisi step
- [ ] Helper `formatEtd("2-3 day")` → `"2–3 hari"` (Indonesian)
- [ ] **Hardcoded warehouse origin** — taruh di constants:
  ```ts
  export const WAREHOUSE = {
    districtId: 1391, // BANDUNG WETAN
    cityName: "BANDUNG",
  };
  ```
- [ ] Smoke test: pilih alamat → ongkir muncul → pilih kurir → tombol Lanjut aktif.

---

## Milestone 4 — Payment QRIS Dummy

**Tujuan:** end-to-end checkout sampai status PAID.

- [ ] Komponen `<PaymentReview />` (step "payment"):
  - Tampilkan order summary (items + ongkir + total)
  - Tampilkan alamat
  - Pilihan payment method (hardcoded: QRIS aktif, VA disabled)
  - Tombol "Bayar Sekarang" → trigger create order + create payment
- [ ] Action `placeOrder()`:
  1. `useOrderStore.create({ ...cart, address, shippingOption, status: "AWAITING_PAYMENT" })`
  2. `paymentService.createQris({ amount: total, referenceId: order.id, ...customer })`
  3. `router.push(/checkout/pay/{payment_id})`
- [ ] **Route `/checkout/pay/[paymentId]/page.tsx`**:
  - Read payment dari `paymentStore`
  - Render QR code pakai library `qrcode.react`:
    ```bash
    npm i qrcode.react
    ```
    ```tsx
    <QRCodeSVG value={payment.qris_string} size={240} />
    ```
  - Countdown component (count from `expired_at`)
  - Polling `paymentService.getStatus(paymentId)` tiap 3 detik (`useEffect` + `setInterval`)
  - **Tombol simulasi** (dev-only):
    ```tsx
    {process.env.NODE_ENV !== "production" && paymentService.simulatePaid && (
      <button onClick={() => paymentService.simulatePaid!(paymentId)}>
        🔧 Simulasi Pembayaran Sukses
      </button>
    )}
    ```
  - On status `PAID` → redirect ke `/orders/{orderId}/success`
  - On status `EXPIRED` → banner expired + tombol "Order Ulang"
- [ ] **Route `/orders/[orderId]/success/page.tsx`**:
  - Tampilkan: order no, AWB, kurir, total, status
  - CTA: "Lacak Pesanan" + "Lihat Pesanan Saya"
- [ ] Smoke test: dari `/checkout` → bayar → tombol Simulasi → success page muncul + order tersimpan di `order-store`.

---

## Milestone 5 — Tracking & Status Auto-Progression

**Tujuan:** customer bisa lacak pesanan, status auto-update tanpa reload.

- [ ] Implementasi `deriveStatus` & `deriveManifest` dari `paidAt` (lihat [`dummy-data.md`](./dummy-data.md#opsi-b-derive-status-dari-paidat-recommended))
- [ ] Route `/orders/[orderId]/page.tsx`:
  - Fetch order dari `orderStore`
  - Render timeline dari `deriveManifest(order.paidAt)`
  - Highlight status terkini dari `deriveStatus(order.paidAt)`
  - Polling 1 detik (`useEffect` + `setInterval`) untuk re-derive → UI auto-update
  - Cleanup interval saat status = `Selesai`
- [ ] Komponen `<TrackingTimeline manifest={...} />`:
  - Vertical list dengan dot + line connector
  - State: solid dot = sudah, hollow dot = belum
  - Datetime format `id-ID`
- [ ] Smoke test:
  1. Checkout sampai PAID
  2. Pindah ke `/orders/[id]`
  3. Tunggu ~10 detik → "Dijemput" muncul
  4. Tunggu ~20 detik total → "Dikirim" muncul
  5. Tunggu ~30 detik total → "Selesai" muncul
  6. Reload halaman di tengah-tengah → status tetap konsisten

---

## Milestone 6 (Opsional) — Admin View

**Tujuan:** admin bisa lihat order baru di `/admin/orders`.

- [ ] Update `/admin/orders/page.tsx` untuk include order dari `order-store` (bukan hanya seed)
- [ ] Update `/admin/orders/[id]/page.tsx`:
  - Tampilkan AWB, kurir, status pengiriman
  - Tombol "Lacak" mengarah ke tracking yang sama
  - Tombol "Batalkan Order" (jika status = `Packing`):
    - Set order.status = `Dibatalkan`
    - Refund: tampilkan banner "refund manual" (karena dummy)
- [ ] Smoke test: order yang dibuat customer muncul di admin list.

---

## Definisi "Done" per Milestone

Setiap milestone selesai kalau:

1. ✅ Semua checkbox checked
2. ✅ `npm run lint` lulus tanpa error
3. ✅ `npm run build` sukses
4. ✅ Smoke test manual lulus di browser
5. ✅ Tidak ada `console.error` di DevTools saat flow normal

---

## Estimasi Waktu

| Milestone | Effort (solo, full-time) |
| --- | --- |
| M1 — Pondasi | 0.5 hari |
| M2 — Types + Checkout skeleton | 0.5 hari |
| M3 — Address + Cost | 1 hari |
| M4 — Payment QRIS | 1 hari |
| M5 — Tracking | 0.5 hari |
| M6 — Admin (opsional) | 0.5 hari |
| **Total** | **~4 hari** |

---

## Checklist Migrasi ke Real (Future)

Disimpan di sini sebagai placeholder — **jangan kerjakan sekarang**, hanya pas siap go-live:

- [ ] Daftar akun di <https://collaborator.komerce.id/>
- [ ] Setup `.env.local` dengan API key (Shipping Cost + Komerce)
- [ ] Buat Route Handler `/api/komerce/...` (lihat [`docs/raja-ongkir/integration-guide.md`](../raja-ongkir/integration-guide.md))
- [ ] Tulis `realShippingService` & `realPaymentService` di `services/raja-ongkir/real/`
- [ ] Update factory `services/raja-ongkir/index.ts` untuk include real
- [ ] Implementasi webhook receiver `/api/komerce/webhooks/payment`
- [ ] Set `NEXT_PUBLIC_USE_DUMMY_RAJAONGKIR=false`
- [ ] Hapus seed `DUMMY_*` (atau biarkan untuk testing)
- [ ] Setup monitoring (Sentry/Logtail) untuk error API
- [ ] Request production access dari Komerce admin
- [ ] Run UAT di sandbox dulu sebelum prod

---

## Branching Strategy (Rekomendasi)

```
main
└── feat/raja-ongkir-dummy
    ├── feat/m1-foundation
    ├── feat/m2-checkout-skeleton
    ├── feat/m3-address-shipping-cost
    ├── feat/m4-payment-qris
    ├── feat/m5-tracking
    └── feat/m6-admin (opsional)
```

PR kecil per milestone supaya code review fokus & rollback gampang.

---

## File yang Akan Dimodifikasi (Existing)

Daftar file existing yang **wajib di-touch**:

| File | Perubahan |
| --- | --- |
| `src/types/index.ts` | Tambah `weight` di `Product` |
| `src/types/admin.ts` | Extend `Order` dengan field shipping & payment |
| `src/lib/constants.ts` | Tambah `weight` di setiap produk; tambah `WAREHOUSE` constant |
| `src/lib/admin-seeds.ts` | Update `SEED_ORDERS` format (opsional) |
| `src/stores/cart-store.ts` | Tambah `shippingOption`, `totalWeight()`, action `setShippingOption` |
| `src/stores/order-store.ts` | Tambah action `create`, `markPaid`, `pushManifest`, `setStatus` |
| `src/app/checkout/page.tsx` | Refactor jadi state machine 4 step |
| `src/app/admin/orders/[id]/page.tsx` | Tampilkan AWB & tracking (M6) |

## File Baru yang Dibuat

| File | Tujuan |
| --- | --- |
| `src/types/raja-ongkir.ts` | Tipe terpadu Province/City/District/Payment dll |
| `src/services/raja-ongkir/{types,index}.ts` | Service interface + factory |
| `src/services/raja-ongkir/dummy/*.ts` | Implementasi dummy |
| `src/lib/dummy/*.ts` | Seed + helper dummy |
| `src/stores/{shipping,payment}-store.ts` | State checkout & payment |
| `src/app/checkout/components/*.tsx` | `<CheckoutAddress/>`, `<CourierOptions/>`, `<PaymentReview/>`, `<QrisPaymentPage/>` |
| `src/app/checkout/pay/[paymentId]/page.tsx` | Halaman QR + countdown |
| `src/app/orders/[orderId]/page.tsx` | Detail order + tracking |
| `src/app/orders/[orderId]/success/page.tsx` | Halaman sukses payment |
| `src/components/tracking/timeline.tsx` | Komponen vertical timeline reusable |
| `public/dummy/qris-placeholder.png` | Asset gambar QR dummy |
