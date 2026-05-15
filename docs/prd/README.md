# Dashboard PRD — ThickApparel

Kumpulan Product Requirements Document (PRD) untuk setiap menu / fitur dashboard admin ThickApparel. Tujuan dokumentasi ini: menjadi acuan tunggal sebelum implementasi, sehingga tiap fitur jelas scope, data model, acceptance criteria, dan risiko-nya.

## Status Fase 1 — Prioritas Tinggi

PRD untuk menu yang fitur-nya sudah ada di storefront tapi belum bisa dikelola admin.

| #  | Menu             | File                              | Owner                  | Status |
| -- | ---------------- | --------------------------------- | ---------------------- | ------ |
| 1  | Magazine         | [magazine.md](./magazine.md)      | Content Editor         | Draft  |
| 2  | Membership       | [membership.md](./membership.md)  | Partnership Manager    | Draft  |
| 3  | Shipping         | [shipping.md](./shipping.md)      | Operations             | Draft  |
| 4  | Payment          | [payment.md](./payment.md)        | Finance                | Draft  |
| 5  | Categories       | [categories.md](./categories.md)  | Merchandiser           | Draft  |

## Status Fase 2 — Prioritas Menengah

PRD untuk peningkatan kontrol konten & operasional dashboard.

| #  | Menu               | File                                  | Owner                 | Status |
| -- | ------------------ | ------------------------------------- | --------------------- | ------ |
| 6  | Home Content       | [home-content.md](./home-content.md)  | Content Editor        | Draft  |
| 7  | Size Guide         | [size-guide.md](./size-guide.md)      | Merchandiser          | Draft  |
| 8  | Promo / Discount   | [promo.md](./promo.md)                | Merchandiser          | Draft  |
| 9  | Settings           | [settings.md](./settings.md)          | Owner                 | Draft  |
| 10 | Admin Users        | [admin-users.md](./admin-users.md)    | Owner / Super Admin   | Draft  |

## Fase 3 — Future / Opsional

- Voucher / Coupon code
- Review & Rating produk
- Wishlist / Favorit
- FAQ management
- Stock movement / inventory log
- Activity log / audit trail
- Notification / email template

---

## Konvensi PRD

Setiap PRD mengikuti struktur:

1. **Ringkasan** — 2–4 kalimat tujuan fitur.
2. **Latar Belakang** — kondisi saat ini + referensi file existing.
3. **Pengguna & Use Case** — peran + user stories.
4. **Scope** — In Scope vs Out of Scope (eksplisit).
5. **Functional Requirements** — per halaman / section, dengan tabel field & validasi.
6. **Data Model** — type baru + store baru (Zustand).
7. **UX & Pola Desain** — komponen reusable yang dipakai.
8. **Acceptance Criteria** — checklist yang testable.
9. **Technical Notes** — file baru, breaking changes, migrasi.
10. **Dependencies & Risks** — ketergantungan & mitigasi.
11. **Future Enhancements** — out-of-scope yang dicatat untuk roadmap.

## Standar Teknis (Bersama)

Mengacu pada `CLAUDE.md`:

- **Type baru** masuk ke `src/types/<feature>.ts`.
- **Store baru** masuk ke `src/stores/<feature>-store.ts` (Zustand + `persist` + `partialize`).
- **Persist key** prefix `thickapparel-<feature>`.
- **Seed data** di `src/lib/<feature>-seeds.ts` (jika ada) — dipakai untuk hydrate awal store.
- **Komponen admin baru** di `src/components/admin/<name>.tsx` (kebab-case).
- **Route admin baru** di `src/app/admin/<feature>/page.tsx` (+ `[id]/edit/page.tsx`, `new/page.tsx`).
- **Bahasa user-facing**: Bahasa Indonesia.
- **UI primitives**: gunakan `Button`, `Badge`, `Input`, `DataTable`, `ConfirmModal` yang sudah ada.
- **Currency**: `formatPrice()` dari `src/lib/utils.ts`.
- **Image remote**: hostname harus di-allowlist di `next.config.ts`.

## Sidebar Layout Target (Setelah Fase 1 + 2)

```
Dashboard
─ Catalog
   ├ Products
   └ Categories          ← Fase 1
─ Content
   ├ Magazine            ← Fase 1
   ├ Membership          ← Fase 1
   └ Home / Banner       ← Fase 2
─ Sales
   ├ Orders
   └ Promo               ← Fase 2
─ Configuration
   ├ Shipping            ← Fase 1
   ├ Payment             ← Fase 1
   └ Size Guide          ← Fase 2
─ People
   ├ Users (customer)
   └ Admins              ← Fase 2 (super_admin only)
─ Settings               ← Fase 2 (super_admin only)
```

Menu yang tampil ke setiap admin akan difilter berdasarkan **role** (lihat PRD Admin Users — matrix permission).

## Implementation Order Rekomendasi

Urutan implementasi setelah PRD disetujui — diurutkan berdasarkan dependency & complexity.

### Fase 1
1. **Categories** — pondasi untuk dropdown di Product Form, paling sederhana.
2. **Payment** — independen, low complexity.
3. **Shipping** — independen, sedang (form warehouse + tabel courier).
4. **Magazine** — kompleks (body block repeater), independen dari menu lain.
5. **Membership** — kompleks bila Fase 2 (submission) ikut, independen.

### Fase 2
6. **Size Guide** — paling sederhana di Fase 2.
7. **Settings** — independen, banyak section tapi tiap section sederhana.
8. **Home Content** — refactor komponen home jadi data-driven.
9. **Admin Users** — perlu refactor `admin-auth-store` & `admin-guard`; sentuh banyak file.
10. **Promo** — **butuh Categories selesai** karena target by-category; paling kompleks (runtime apply non-destructive).

> Catatan: PRD ini snapshot v1.0 — adjustment menyusul setelah review owner. Naikkan versi di header PRD saat revisi.

## Workflow

1. **Review & Approve PRD** — owner / stakeholder kasih feedback di tiap dokumen.
2. **Update PRD ke v1.x** — revisi sesuai feedback, naikkan versi di header.
3. **Implementation** — buat task tracking, kerjakan sesuai Acceptance Criteria.
4. **Final QA** — tick semua checklist di Acceptance Criteria.
5. **Update PRD ke "Released"** — jadi acuan dokumentasi setelah fitur live.
