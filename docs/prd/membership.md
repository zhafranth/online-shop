# PRD — Dashboard: Membership Management

| Status   | Draft v1.0                                       |
| -------- | ------------------------------------------------ |
| Owner    | Admin / Partnership Manager                      |
| Priority | P1 (High)                                        |
| Tanggal  | 2026-05-15                                       |

---

## 1. Ringkasan

Menambahkan menu **Membership** di dashboard admin untuk mengelola tiga program kemitraan (Program Agent, Reseller Online, Titip Jual) — termasuk konten landing page, status (Coming Soon vs Aktif), dan daftar pendaftar/submission ke depan.

## 2. Latar Belakang

- Storefront memiliki 3 halaman membership di `src/app/membership/`:
  - `/membership/program-agent`
  - `/membership/reseller-online`
  - `/membership/titip-jual`
- Semua menggunakan komponen `MembershipHero` (`src/components/membership/membership-hero.tsx`) dengan prop hardcoded.
- Saat ini semua program berstatus "Coming Soon" — belum ada form pendaftaran.
- Konten dapat berubah (image, deskripsi, copy banner) seiring waktu, tapi sekarang harus edit kode.

## 3. Pengguna & Use Case

| Peran               | Kebutuhan                                                             |
| ------------------- | --------------------------------------------------------------------- |
| Partnership Manager | Edit konten landing per program, ubah status, lihat pendaftar.        |
| Admin (Owner)       | Aktivasi/nonaktif program, audit pendaftar.                           |
| Content Editor      | Update copy hero (deskripsi, banner) tanpa deploy.                    |

### User Stories

1. Sebagai partnership manager, saya ingin mengedit copy & hero image setiap program membership tanpa edit kode.
2. Sebagai admin, saya ingin mengaktifkan / menonaktifkan halaman program (mis. menyembunyikan dari navbar jika belum siap).
3. Sebagai admin, saya ingin mengganti status banner dari "Coming Soon" jadi "Pendaftaran Dibuka" beserta CTA pendaftaran.
4. (Future) Sebagai partnership manager, saya ingin melihat daftar pendaftar tiap program dengan filter status (new / verified / rejected).

## 4. Scope

### In Scope (Fase 1)
- Halaman list program di `/admin/membership` (3 program tetap, tidak bisa tambah baru).
- Halaman edit di `/admin/membership/[programId]/edit`.
- Field yang dapat diedit: `eyebrow`, `title`, `titleAccent`, `description`, `image`, `imageCaption`, `bannerText`, `isActive`.
- Toggle `isActive` mempengaruhi:
  - Visibility item submenu **Membership** di navbar storefront.
  - Akses halaman publik (jika nonaktif → 404 atau redirect).
- Store baru `membership-store` + persist.

### In Scope (Fase 2 — Submission)
- Halaman list pendaftar di `/admin/membership/[programId]/submissions`.
- Form publik pendaftaran di `/membership/[programId]/daftar` (dipicu saat status aktif).
- Field submission: nama, email, telepon, kota, motivasi (textarea), portofolio/IG (opsional URL), status (new/contacted/approved/rejected).
- Aksi admin: ubah status, hapus, ekspor CSV.

### Out of Scope
- Pembuatan program baru via admin (3 program fixed sesuai brand decision).
- Pembayaran biaya membership.
- Sistem level / tier reseller.
- Komisi otomatis.

## 5. Functional Requirements

### 5.1 List Program — `/admin/membership`

- Tabel atau card grid (3 baris fixed) menampilkan tiap program:
  - Cover image kecil
  - Title (`titleAccent`) + program ID
  - Status badge: **Aktif** / **Coming Soon** / **Nonaktif**
  - Jumlah pendaftar (Fase 2)
  - Aksi: **Edit**, **Lihat Pendaftar** (Fase 2)
- Tidak ada tombol tambah baru.

### 5.2 Edit Program — `/admin/membership/[programId]/edit`

Form fields:
| Field         | Type      | Validasi                                  |
| ------------- | --------- | ----------------------------------------- |
| Eyebrow       | string    | maks 30 karakter (default "Membership")   |
| Title         | string    | 2–40 karakter                             |
| Title Accent  | string    | 2–40 karakter                             |
| Description   | textarea  | 30–500 karakter                           |
| Image         | URL       | hostname allowlist                        |
| Image Caption | string    | maks 60 karakter (opsional)               |
| Banner Text   | string    | 5–80 karakter                             |
| Status        | radio     | `coming-soon` / `active` / `inactive`     |

Preview di samping form: render `MembershipHero` dengan props live (debounced).

CTA: **Simpan**, **Batal**.

### 5.3 Submission List — `/admin/membership/[programId]/submissions` (Fase 2)

- Header: nama program + total submission.
- Filter: status (All / new / contacted / approved / rejected).
- Tabel: Tanggal · Nama · Email · Telepon · Kota · Status · Aksi (ubah status, hapus).
- Tombol **Export CSV**.

### 5.4 Integrasi Storefront

- `src/app/membership/program-agent/page.tsx` dkk dirombak jadi Client Component (atau Server Component + dynamic loader) yang baca props dari `useMembershipStore`.
- Navbar (`src/components/layout/navbar.tsx`) men-filter submenu berdasarkan `isActive`.
- Jika user mengakses halaman nonaktif → `notFound()` (App Router).

## 6. Data Model

### Type baru — `src/types/membership.ts`

```ts
export type MembershipProgramId = "program-agent" | "reseller-online" | "titip-jual";
export type MembershipStatus = "active" | "coming-soon" | "inactive";

export interface MembershipProgram {
  id: MembershipProgramId;
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
  image: string;
  imageCaption?: string;
  bannerText: string;
  status: MembershipStatus;
}

export interface MembershipSubmission {
  id: string;                     // UUID
  programId: MembershipProgramId;
  name: string;
  email: string;
  phone: string;
  city: string;
  motivation: string;
  portfolioUrl?: string;
  status: "new" | "contacted" | "approved" | "rejected";
  createdAt: string;              // ISO 8601
}
```

### Store baru — `src/stores/membership-store.ts`

```ts
interface MembershipStore {
  programs: MembershipProgram[];                  // 3 baris fixed
  submissions: MembershipSubmission[];            // Fase 2
  updateProgram: (id: MembershipProgramId, patch: Partial<MembershipProgram>) => void;
  addSubmission: (submission: MembershipSubmission) => void;
  updateSubmissionStatus: (id: string, status: MembershipSubmission["status"]) => void;
  deleteSubmission: (id: string) => void;
}
```

- Persist key: `thickapparel-membership`.
- Seed initial: 3 program sesuai konten existing di tiap `page.tsx`.

## 7. UX & Pola Desain

- Sidebar: tambah item **Membership** dengan icon `Handshake` atau `Users2`.
- Form edit pakai layout 2 kolom; kolom kanan = preview `MembershipHero` live.
- Status badge konsisten dengan order status (`order-status-badge.tsx`).

## 8. Acceptance Criteria

### Fase 1
- [ ] Menu Membership muncul di sidebar.
- [ ] `/admin/membership` menampilkan 3 program dengan status.
- [ ] Edit program menyimpan ke store dan storefront ter-update.
- [ ] Toggle status `inactive` menyembunyikan submenu di navbar dan return 404 saat akses langsung.
- [ ] Reload persist.

### Fase 2
- [ ] Halaman daftar publik tampil hanya saat status `active`.
- [ ] Submission masuk ke store, terlihat di admin.
- [ ] Admin dapat ubah status & hapus.
- [ ] Export CSV menghasilkan file valid (UTF-8 BOM).

## 9. Technical Notes

- Sebelumnya 3 program memiliki page terpisah; bisa tetap dipertahankan (per-route preserve SEO) atau di-konsolidasi ke `/membership/[id]/page.tsx`. Rekomendasi: **konsolidasi** ke dynamic route untuk konsistensi dengan data-driven.
- Validasi URL image idem dengan PRD Magazine.

## 10. Dependencies & Risks

- **Perubahan struktur routing** (jika konsolidasi) berarti existing link di footer/navbar harus disesuaikan.
- **Notifikasi email** ke admin saat submission masuk tidak ada di Fase 2 (out of scope).

## 11. Future Enhancements

- Tier reseller dengan komisi otomatis.
- Form pendaftaran multi-step + upload KTP.
- Notifikasi email + Slack ke partnership manager.
- Public listing reseller verified (showcase).
- Integrasi WhatsApp Business untuk follow-up.
