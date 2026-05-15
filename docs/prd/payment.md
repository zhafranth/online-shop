# PRD — Dashboard: Payment Method Management

| Status   | Draft v1.0                                  |
| -------- | ------------------------------------------- |
| Owner    | Admin / Finance                             |
| Priority | P1 (High)                                   |
| Tanggal  | 2026-05-15                                  |

---

## 1. Ringkasan

Menambahkan menu **Payment** di dashboard admin untuk mengelola metode pembayaran yang tampil di checkout (Transfer Bank, GoPay/OVO, Kartu Kredit, COD, Paylater) — termasuk label, deskripsi, icon, dan status aktif. Mencakup juga konfigurasi detail per metode (mis. nomor rekening untuk transfer bank).

## 2. Latar Belakang

- `PAYMENT_OPTIONS` di `src/lib/constants.ts:28` berisi 5 metode hardcoded.
- Sudah ada `src/stores/payment-store.ts` — tapi **tujuannya berbeda**: menyimpan sesi QRIS pembayaran (mock), bukan untuk admin config.
- Saat ini hanya QRIS yang punya flow detail (`/checkout/pay`). Metode lain ditampilkan sebagai pilihan radio tanpa flow lanjutan.

## 3. Pengguna & Use Case

| Peran           | Kebutuhan                                                        |
| --------------- | ---------------------------------------------------------------- |
| Finance / Admin | CRUD metode pembayaran, enable/disable, atur detail (rekening).  |
| Admin (Owner)   | Audit metode aktif, ubah urutan tampilan.                        |

### User Stories

1. Sebagai finance, saya ingin menambahkan rekening bank baru tanpa edit kode.
2. Sebagai finance, saya ingin menonaktifkan sementara metode COD selama liburan.
3. Sebagai admin, saya ingin mengubah urutan tampilan metode pembayaran agar Transfer Bank tampil paling atas.
4. Sebagai admin, saya ingin menambah metode baru (mis. ShopeePay) dengan icon emoji atau URL.

## 4. Scope

### In Scope
- Halaman `/admin/payment` — list & CRUD metode pembayaran.
- Field: id, label, description, icon (emoji string atau URL), enabled, sort order.
- Untuk metode tipe **transfer**: tambah sub-form daftar rekening bank (bank name, nomor, atas nama).
- Untuk metode tipe **paylater / ewallet / cc / cod**: tidak ada detail tambahan.
- Store admin baru `admin-payment-store` (terpisah dari `payment-store.ts` session QRIS).
- Integrasi: `/checkout` baca dari store admin.

### Out of Scope
- Integrasi real payment gateway (Midtrans, Xendit, dll).
- Settlement & rekonsiliasi keuangan.
- Refund flow.
- Fee per metode pembayaran (biaya admin).
- Auto-verifikasi pembayaran transfer.

## 5. Functional Requirements

### 5.1 List Payment Method — `/admin/payment`

- Header: judul "Metode Pembayaran", tombol **+ Tambah Metode**.
- Tabel kolom: Order (drag handle), Icon, Label, Description, Tipe, Status (toggle Enabled), Aksi (Edit / Hapus).
- Empty state: "Belum ada metode pembayaran" + CTA tambah.

### 5.2 Create / Edit Method

#### Form fields
| Field         | Type      | Validasi                                                |
| ------------- | --------- | ------------------------------------------------------- |
| ID            | string    | unique, lowercase kebab-case, immutable saat edit       |
| Tipe          | select    | `transfer` / `ewallet` / `cc` / `cod` / `paylater`      |
| Label         | string    | 3–40 karakter                                           |
| Description   | string    | 5–80 karakter                                           |
| Icon          | string    | emoji single char ATAU URL gambar                       |
| Enabled       | toggle    | default true                                            |

#### Sub-form bila tipe = `transfer` (Daftar Rekening)
| Field         | Type      | Validasi                       |
| ------------- | --------- | ------------------------------ |
| Bank Name     | string    | 2–30 karakter (mis. "BCA")     |
| Account No    | string    | 8–20 digit numerik             |
| Account Holder| string    | 3–60 karakter                  |

Repeater: tambah / hapus rekening. Minimal 1 rekening jika tipe transfer dan enabled.

### 5.3 Integrasi Checkout

- `/checkout` baca daftar metode yang `enabled = true`, sorted.
- Jika user memilih metode tipe `transfer`, tampilkan list rekening di halaman konfirmasi.
- Jika user memilih `ewallet` (mis. GoPay) → flow QRIS lanjut ke `/checkout/pay` (existing).
- Metode lain (`cc`, `cod`, `paylater`) — tetap dummy mock flow saat ini.

## 6. Data Model

### Type baru — `src/types/payment-admin.ts`

```ts
export type PaymentMethodType = "transfer" | "ewallet" | "cc" | "cod" | "paylater";

export interface BankAccount {
  bankName: string;
  accountNo: string;
  accountHolder: string;
}

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  label: string;
  description: string;
  icon: string;                  // emoji atau URL
  enabled: boolean;
  order: number;
  bankAccounts?: BankAccount[];  // hanya bila type === "transfer"
}
```

### Store baru — `src/stores/admin-payment-store.ts`

```ts
interface AdminPaymentStore {
  methods: PaymentMethod[];
  addMethod: (method: PaymentMethod) => void;
  updateMethod: (id: string, patch: Partial<PaymentMethod>) => void;
  deleteMethod: (id: string) => void;
  reorder: (orderedIds: string[]) => void;
}
```

- Persist key: `thickapparel-admin-payment`.
- Seed initial: hydrate dari `PAYMENT_OPTIONS` di `constants.ts`, default `type` sesuai mapping.
- **Tidak** mengubah `payment-store.ts` (session QRIS) — keduanya independen.

## 7. UX & Pola Desain

- Sidebar group **Configuration** → item **Payment** (icon `CreditCard`).
- Untuk icon, dukung dua mode input: emoji picker sederhana **atau** URL.
- Empty state untuk bank accounts: "Belum ada rekening" + tombol **+ Tambah Rekening**.

## 8. Acceptance Criteria

- [ ] Menu **Payment** muncul di sidebar admin.
- [ ] CRUD metode pembayaran berfungsi.
- [ ] Toggle enabled menyembunyikan metode dari checkout.
- [ ] Reorder mengubah urutan tampilan di checkout.
- [ ] Tipe `transfer` mensyaratkan minimal 1 rekening (form blocked submit jika kosong).
- [ ] Validasi ID unique & immutable saat edit.
- [ ] Reload persist.

## 9. Technical Notes

- File baru: `src/stores/admin-payment-store.ts`, `src/types/payment-admin.ts`, `src/app/admin/payment/page.tsx`, `src/components/admin/payment-method-form.tsx`.
- Existing `PAYMENT_OPTIONS` constant dapat dipertahankan sebagai seed default; tidak perlu dihapus.
- Icon emoji: validasi panjang 1–4 karakter (mendukung emoji compound).

## 10. Dependencies & Risks

- **Konflik nama store:** `payment-store.ts` (session) vs `admin-payment-store.ts` (config) — beri komentar header yang jelas untuk hindari import salah.
- **Rekening sensitif:** nomor rekening adalah PII ringan; karena tidak ada backend, semua tersimpan di `localStorage` (tidak ideal untuk produksi nyata). Sertakan disclaimer di PRD bahwa **ini prototype**.

## 11. Future Enhancements

- Integrasi payment gateway (Midtrans, Xendit) dengan API key di Settings.
- Auto-verifikasi pembayaran transfer (Mutation API bank).
- Fee/biaya admin per metode.
- Pembatasan metode per courier (mis. COD hanya tersedia bila kurir tertentu).
- Riwayat audit perubahan rekening.
- Multi-currency (ke depan jika expand internasional).
