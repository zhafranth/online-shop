# PRD — Dashboard: Shipping Management

| Status   | Draft v1.0                                          |
| -------- | --------------------------------------------------- |
| Owner    | Admin / Operations                                  |
| Priority | P1 (High)                                           |
| Tanggal  | 2026-05-15                                          |

---

## 1. Ringkasan

Menambahkan menu **Shipping** di dashboard admin agar tim operasional dapat mengelola opsi kurir, service level, dan biaya yang ditampilkan di checkout — tanpa edit kode. Juga mencakup pengaturan alamat warehouse (origin) sebagai data konfigurasi shipping.

## 2. Latar Belakang

- `SHIPPING_OPTIONS` di `src/lib/constants.ts:21` berisi 4 kurir hardcoded (JNE REG, J&T Express, SiCepat HEMAT, GoSend Same Day).
- `WAREHOUSE` di `src/lib/constants.ts:46` berisi origin pengiriman hardcoded (Bandung Wetan).
- Sudah ada `src/stores/shipping-store.ts`, tapi **tujuannya berbeda**: menyimpan alamat pengiriman & opsi terpilih untuk session checkout, bukan untuk admin config.
- Storefront menampilkan opsi shipping di checkout (`/checkout`) — termasuk integrasi mock RajaOngkir (`src/lib/dummy/`).

## 3. Pengguna & Use Case

| Peran          | Kebutuhan                                                          |
| -------------- | ------------------------------------------------------------------ |
| Operations     | CRUD courier option, set tarif, set ETD, enable/disable.           |
| Admin (Owner)  | Ubah alamat warehouse origin saat pindah gudang.                   |

### User Stories

1. Sebagai operations, saya ingin menambahkan kurir baru (mis. AnterAja) lengkap dengan service-nya, sehingga muncul di checkout.
2. Sebagai operations, saya ingin menonaktifkan sementara opsi GoSend tanpa menghapusnya — karena bisa di-aktifkan kembali nanti.
3. Sebagai operations, saya ingin mengubah tarif & ETD service tanpa deploy.
4. Sebagai admin, saya ingin mengubah alamat warehouse origin (provinsi/kota/kecamatan/kode pos) untuk perhitungan ongkir.
5. Sebagai admin, saya ingin urutan kurir di-drag-and-drop sesuai prioritas tampilan.

## 4. Scope

### In Scope
- Halaman `/admin/shipping` dengan dua section:
  - **Couriers** — CRUD opsi pengiriman.
  - **Warehouse Origin** — single form alamat origin.
- Field per courier: code, label, description, price, etd (range hari), enabled flag, sort order.
- Drag-handle reorder atau tombol naik/turun.
- Store admin baru `admin-shipping-store` (terpisah dari `shipping-store` checkout yang sudah ada).
- Integrasi: checkout (`/checkout`) baca dari store admin (bukan import langsung `SHIPPING_OPTIONS`).

### Out of Scope
- Integrasi real RajaOngkir API (saat ini mock di `src/lib/dummy/`).
- Tarif dinamis per zona (saat ini flat rate per service).
- Insurance / asuransi pengiriman.
- COD per courier toggle (akan diakomodasi via PRD Payment).

## 5. Functional Requirements

### 5.1 Couriers Section — `/admin/shipping` (tab "Couriers")

- Header: judul "Pengiriman", deskripsi, tombol **+ Tambah Kurir**.
- Tabel kolom: Order (drag handle), Code, Label, Description, Harga, ETD, Status (toggle Enabled), Aksi (Edit / Hapus).
- Edit & create lewat **modal** atau inline expand row.

#### Form fields (per courier service)
| Field         | Type        | Validasi                                  |
| ------------- | ----------- | ----------------------------------------- |
| Code          | string      | unique, lowercase, 2–20 karakter          |
| Label         | string      | 3–40 karakter (e.g. "JNE REG")            |
| Description   | string      | 5–80 karakter (e.g. "Estimasi 2–3 hari")  |
| Harga         | number (Rp) | min 0, default 0                          |
| ETD Min       | number      | 1–30 hari                                 |
| ETD Max       | number      | >= ETD Min, <=30                          |
| Enabled       | toggle      | default true                              |

ETD description bisa auto-generate dari ETD min/max: `Estimasi {min}–{max} hari kerja`.

### 5.2 Warehouse Origin Section — `/admin/shipping` (tab "Warehouse")

Form fields:
| Field           | Type   | Validasi              |
| --------------- | ------ | --------------------- |
| Province Name   | string | required              |
| Province ID     | number | required (mock id)    |
| City Name       | string | required              |
| City ID         | number | required              |
| District Name   | string | required              |
| District ID     | number | required              |
| ZIP Code        | string | 5 digit numeric       |

CTA: **Simpan Alamat Warehouse**.

Note: Field ID (province/city/district) dipakai untuk perhitungan ongkir mock RajaOngkir. Untuk UX yang lebih baik, masa depan bisa pakai dropdown cascading (lihat _Future_).

### 5.3 Integrasi Checkout

- `/checkout` baca daftar courier yang `enabled === true`, sorted by `order`.
- Origin RajaOngkir mock dibaca dari store, bukan konstanta.
- Jika tidak ada courier `enabled`, tampilkan empty state "Pengiriman belum dikonfigurasi" + cegah lanjut.

## 6. Data Model

### Type baru — `src/types/shipping-admin.ts`

```ts
export interface ShippingCourier {
  code: string;            // "jne", "jnt", "sicepat", "gosend", ...
  label: string;
  description: string;     // auto-generated atau manual
  price: number;           // Rupiah
  etdMin: number;          // hari
  etdMax: number;
  enabled: boolean;
  order: number;
}

export interface WarehouseOrigin {
  provinceId: number;
  provinceName: string;
  cityId: number;
  cityName: string;
  districtId: number;
  districtName: string;
  zipCode: string;
}
```

### Store baru — `src/stores/admin-shipping-store.ts`

```ts
interface AdminShippingStore {
  couriers: ShippingCourier[];
  warehouse: WarehouseOrigin;
  addCourier: (courier: ShippingCourier) => void;
  updateCourier: (code: string, patch: Partial<ShippingCourier>) => void;
  deleteCourier: (code: string) => void;
  reorderCouriers: (orderedCodes: string[]) => void;
  setWarehouse: (warehouse: WarehouseOrigin) => void;
}
```

- Persist key: `thickapparel-admin-shipping`.
- Seed initial: hydrate dari `SHIPPING_OPTIONS` & `WAREHOUSE` di `constants.ts`.
- Existing `shipping-store.ts` (checkout session) tetap dipertahankan — penamaan ulang **tidak** diperlukan; cukup beda key dan beda concern.

## 7. UX & Pola Desain

- Sidebar group **Configuration** dengan item **Shipping** (icon `Truck`).
- Tab di dalam page: gunakan komponen tab simple (atau dua section terpisah dengan heading).
- Drag-and-drop pakai library ringan (mis. `dnd-kit`) atau cukup tombol naik/turun untuk MVP.

## 8. Acceptance Criteria

- [ ] Menu **Shipping** muncul di sidebar admin.
- [ ] Tambah courier → muncul di `/checkout` dengan label, harga, & ETD yang benar.
- [ ] Toggle `enabled = false` → courier hilang dari checkout.
- [ ] Hapus courier → konfirmasi modal → hilang dari store & checkout.
- [ ] Reorder courier mengubah urutan tampilan di checkout.
- [ ] Edit warehouse origin tersimpan; perhitungan ongkir mock memakai origin baru.
- [ ] Validasi ETD min/max & uniqueness code berjalan.
- [ ] Reload persist.

## 9. Technical Notes

- File baru: `src/stores/admin-shipping-store.ts`, `src/types/shipping-admin.ts`, `src/app/admin/shipping/page.tsx`, `src/components/admin/courier-form.tsx`.
- Storefront integration: ubah `/checkout` agar pakai `useAdminShippingStore` untuk daftar opsi.
- `formatPrice` dari `src/lib/utils.ts` untuk render harga.
- Migrasi konstanta: setelah Fase 1, `SHIPPING_OPTIONS` & `WAREHOUSE` di `constants.ts` bisa di-deprecate (atau dipertahankan sebagai seed default).

## 10. Dependencies & Risks

- **Hubungan dengan `shipping-store.ts` (checkout):** dua store ini independen; pastikan jangan tertukar saat refactor.
- **Mock RajaOngkir:** ID provinsi/kota/kecamatan harus konsisten dengan `src/lib/dummy/destinations.ts`. Saat user input ID asal/asalnya tidak match dummy, ongkir bisa 0. Mitigasi: validasi ID exists di dummy data sebelum save (warning, tidak block).
- **COD support:** beberapa kurir mendukung COD, beberapa tidak — saat ini tidak dibatasi per courier. Bisa jadi enhancement bersama PRD Payment.

## 11. Future Enhancements

- Dropdown cascading provinsi → kota → kecamatan menggunakan dummy data atau API real.
- Per-courier zone pricing.
- Toggle COD per courier.
- Integrasi real RajaOngkir API + API key di Settings.
- Cutoff time / hari pickup per kurir.
- SLA & complaint tracking.
