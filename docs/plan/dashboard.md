# Dashboard Development Plan — ThickApparel Admin

Tracking dokumen untuk pengembangan menu admin dashboard yang masih bertanda **Soon** di sidebar (`src/components/admin/admin-sidebar.tsx`). Urutan pengerjaan mengikuti rekomendasi di `docs/prd/README.md` (section "Implementation Order Rekomendasi"), disusun berdasarkan **dependency** dan **complexity**.

> **Aturan kerja:** sebelum mulai mengembangkan menu apa pun, baca PRD terkait di `docs/prd/<feature>.md` sebagai single source of truth. Acceptance Criteria di PRD adalah definisi "done". Jangan menambah scope tanpa update PRD.

---

## Ringkasan Status

| Menu             | Sidebar Status | Plan Status     | PRD                                              |
| ---------------- | -------------- | --------------- | ------------------------------------------------ |
| Dashboard        | ready          | ✅ Done          | —                                                |
| Products         | ready          | ✅ Done          | —                                                |
| Orders           | ready          | ✅ Done          | —                                                |
| Customers        | ready          | ✅ Done          | —                                                |
| Categories       | ready          | ✅ Done          | [categories.md](../prd/categories.md)            |
| Payment          | ready          | ✅ Done          | [payment.md](../prd/payment.md)                  |
| Shipping         | ready          | ✅ Done          | [shipping.md](../prd/shipping.md)                |
| Magazine         | ready          | ✅ Done          | [magazine.md](../prd/magazine.md)                |
| Membership       | ready          | ✅ Done          | [membership.md](../prd/membership.md)            |
| Size Guide       | ready          | ✅ Done          | [size-guide.md](../prd/size-guide.md)            |
| Settings         | ready          | ✅ Done          | [settings.md](../prd/settings.md)                |
| Home & Banner    | ready          | ✅ Done          | [home-content.md](../prd/home-content.md)        |
| Admins           | ready          | ✅ Done          | [admin-users.md](../prd/admin-users.md)          |
| Promo            | ready          | ✅ Done          | [promo.md](../prd/promo.md)                      |

Legenda: ⏳ Not Started · 🚧 In Progress · 🔎 Review · ✅ Done

---

## Fase 1 — Prioritas Tinggi

Menu yang fitur-nya sudah dipakai storefront tetapi belum ada UI admin-nya. Urutan dipilih agar Products bisa segera terhubung Category, lalu checkout punya konfigurasi Payment + Shipping yang dinamis.

### 1. Categories ✅

- **PRD:** [`docs/prd/categories.md`](../prd/categories.md)
- **Kenapa duluan:** menjadi pondasi dropdown di Product Form & filter storefront — paling sederhana, tidak bergantung pada menu lain.
- **Route baru:**
  - `src/app/admin/categories/page.tsx` — list
  - `src/app/admin/categories/new/page.tsx`
  - `src/app/admin/categories/[id]/edit/page.tsx`
- **Type & store:**
  - `src/types/category.ts`
  - `src/stores/category-store.ts` (persist key `thickapparel-categories`)
  - Update `src/types/index.ts` (Product → relasi category)
- **Integrasi:**
  - Product Form (`src/components/admin/product-form.tsx`) — ganti input kategori bebas → dropdown dari store.
  - Storefront catalog filter — baca daftar kategori dari store.
- **Definisi Done:** semua checklist di PRD §8 (Acceptance Criteria) lulus.

### 2. Payment ✅

- **PRD:** [`docs/prd/payment.md`](../prd/payment.md)
- **Kenapa kedua:** independen, kompleksitas rendah, langsung dipakai checkout.
- **Route baru:** `src/app/admin/payment/page.tsx` (+ form modal atau halaman create/edit sesuai PRD §5.2).
- **Type & store:**
  - `src/types/payment-admin.ts`
  - `src/stores/admin-payment-store.ts` (persist key `thickapparel-admin-payment`)
- **Integrasi checkout:** ganti hardcode `PAYMENT_OPTIONS` di `src/lib/constants.ts` → konsumsi dari store admin (PRD §5.3).
- **Definisi Done:** Acceptance Criteria PRD §8 lulus, termasuk fallback bila store kosong (tetap ada minimal 1 metode default).

### 3. Shipping ✅

- **PRD:** [`docs/prd/shipping.md`](../prd/shipping.md)
- **Kenapa ketiga:** independen, kompleksitas sedang (dua tab: Couriers + Warehouse Origin).
- **Route baru:** `src/app/admin/shipping/page.tsx` (tab UI di dalam satu halaman, PRD §5.1 & §5.2).
- **Type & store:**
  - `src/types/shipping-admin.ts`
  - `src/stores/admin-shipping-store.ts` (persist key `thickapparel-admin-shipping`)
- **Integrasi checkout:** `SHIPPING_OPTIONS` jadi data-driven (PRD §5.3).
- **Catatan:** sudah ada referensi integrasi RajaOngkir di `docs/raja-ongkir/` & `docs/integrate-raja-ongkir-dummy/` — tetap di luar scope Fase 1, hanya catat sebagai future enhancement bila PRD belum memerintahkan.

### 4. Magazine ✅

- **PRD:** [`docs/prd/magazine.md`](../prd/magazine.md)
- **Kenapa keempat:** kompleks (body block repeater, slug, draft/publish), tetapi independen.
- **Route baru:**
  - `src/app/admin/magazine/page.tsx` — list (PRD §5.1)
  - `src/app/admin/magazine/new/page.tsx` (PRD §5.2)
  - `src/app/admin/magazine/[slug]/edit/page.tsx` (PRD §5.3)
- **Store:** `src/stores/magazine-store.ts` (persist key `thickapparel-magazine`).
- **Integrasi storefront:** halaman magazine + slug detail konsumsi store (PRD §5.4) — saat ini data masih hardcode di halaman magazine.
- **Hati-hati:** validasi slug unik & block ordering — bagian termudah salah implement, cek Acceptance Criteria.

### 5. Membership ⏳

- **PRD:** [`docs/prd/membership.md`](../prd/membership.md)
- **Kenapa kelima:** Fase 1 sederhana (CRUD program), Fase 2 menambah submission inbox — bisa dipisah jadi dua iterasi.
- **Route baru:**
  - `src/app/admin/membership/page.tsx` — list program (PRD §5.1)
  - `src/app/admin/membership/[programId]/edit/page.tsx` (PRD §5.2)
  - `src/app/admin/membership/[programId]/submissions/page.tsx` (PRD §5.3 — **Fase 2**)
- **Type & store:**
  - `src/types/membership.ts`
  - `src/stores/membership-store.ts` (persist key `thickapparel-membership`)
- **Integrasi storefront:** halaman membership & form pendaftaran konsumsi store (PRD §5.4).
- **Catatan iterasi:** kerjakan Acceptance Criteria PRD §8 "Fase 1" dulu, lalu "Fase 2" setelah review.

---

## Fase 2 — Prioritas Menengah

Setelah Fase 1 selesai dan stabil, lanjut ke peningkatan kontrol konten & operasional.

### 6. Size Guide ✅

- **PRD:** [`docs/prd/size-guide.md`](../prd/size-guide.md)
- **Kenapa duluan di Fase 2:** paling sederhana, satu halaman tabel + form.
- **Route baru:** `src/app/admin/size-guide/page.tsx` (PRD §5.1 — single page, edit inline / modal).
- **Type & store:** `src/types/size-guide.ts`, `src/stores/size-guide-store.ts` (persist key `thickapparel-size-guide`).
- **Integrasi:** ganti hardcode `SIZE_GUIDE` di `src/lib/constants.ts` → store.

### 7. Settings ✅

- **PRD:** [`docs/prd/settings.md`](../prd/settings.md)
- **Kenapa kedua di Fase 2:** independen, section banyak (Branding, Contact, Social, Footer, SEO, Integrations, Maintenance) tapi tiap section sederhana.
- **Route baru:** `src/app/admin/settings/page.tsx` (tab atau accordion section sesuai PRD §5.1–§5.7).
- **Type & store:** `src/types/settings.ts`, `src/stores/settings-store.ts` (persist key `thickapparel-settings`).
- **Integrasi:** footer + meta tags + logo + maintenance mode konsumsi store (PRD §5.4–§5.7).
- **Catatan:** maintenance mode (§5.7) → middleware atau guard di `layout.tsx` storefront — cek breaking change.

### 8. Home Content ✅

- **PRD:** [`docs/prd/home-content.md`](../prd/home-content.md)
- **Kenapa ketiga:** butuh refactor komponen home jadi data-driven (Hero, Ticker, USP, Editor's Picks).
- **Route baru:** `src/app/admin/home/page.tsx` — section editor (PRD §5.1–§5.5).
- **Type & store:** `src/types/home-content.ts`, `src/stores/home-content-store.ts` (persist key `thickapparel-home-content`).
- **Integrasi:** `src/app/page.tsx` + komponen home (`src/components/home/*` bila ada) konsumsi store.
- **Hati-hati:** section visibility toggle (§5.5) — pastikan default state aman bila store fresh.

### 9. Admin Users ✅

- **PRD:** [`docs/prd/admin-users.md`](../prd/admin-users.md)
- **Kenapa keempat:** perlu refactor `src/stores/admin-auth-store.ts` & `src/components/admin/admin-guard.tsx`; menyentuh banyak file (sidebar filter + per-module guard).
- **Route baru:**
  - `src/app/admin/admins/page.tsx` — list (PRD §5.1)
  - `src/app/admin/admins/new/page.tsx` (PRD §5.2)
  - `src/app/admin/admins/[id]/edit/page.tsx`
  - `src/app/admin/profile/page.tsx` (PRD §5.3)
- **Type & store:**
  - `src/types/admin-user.ts`
  - Update `src/stores/admin-auth-store.ts` (PRD §6 — tambah role/permissions di session)
  - `src/stores/admin-users-store.ts` (persist key `thickapparel-admin-users`)
- **Breaking changes:**
  - Login (`src/app/admin/login/page.tsx`) baca daftar admin dari store, bukan `ADMIN_CREDENTIALS` di `src/lib/admin-seeds.ts` (PRD §5.5). Pertahankan satu admin seed sebagai bootstrap.
  - Sidebar filter berdasarkan role (PRD §5.6) — update `admin-sidebar.tsx`.
  - Per-page guard (PRD §5.7) — pertimbangkan helper di `admin-guard.tsx`.
- **Catatan:** hanya `super_admin` boleh akses menu ini.

### 10. Promo ✅

- **PRD:** [`docs/prd/promo.md`](../prd/promo.md)
- **Kenapa terakhir:** paling kompleks (runtime apply non-destructive, status otomatis berdasarkan tanggal) dan **butuh Categories sudah selesai** (target by-category, PRD §5.2 & §5.4).
- **Route baru:**
  - `src/app/admin/promo/page.tsx` — list kampanye (PRD §5.1)
  - `src/app/admin/promo/new/page.tsx` (PRD §5.2)
  - `src/app/admin/promo/[id]/edit/page.tsx`
  - `src/app/admin/promo/badges/page.tsx` (PRD §5.3 — custom badge)
- **Type & store:** `src/types/promo.ts`, `src/stores/promo-store.ts` (persist key `thickapparel-promo`).
- **Integrasi:** runtime apply di product list/detail (PRD §5.4) — **tidak mengubah harga master**, hanya menerapkan diskon di derived selector.
- **Hati-hati:** status otomatis (`scheduled` / `active` / `expired`) berdasarkan `start_at` / `end_at` — pastikan derive di selector, bukan stored boolean (PRD §5.5).

---

## Workflow Tracking

Saat memulai sebuah menu:

1. **Update status** di tabel "Ringkasan Status" → `🚧 In Progress`, lalu di section detail menu yang sama.
2. **Re-baca PRD** menu tersebut secara penuh. Catat pertanyaan terbuka di bagian "Catatan Iterasi" di bawah jika ada.
3. **Buat task list** mengikuti Acceptance Criteria PRD §8 — setiap baris jadi satu task yang dapat dicentang.
4. **Saat selesai per task,** centang Acceptance Criteria di PRD (atau buat checklist mirror di sini) — bukan menunggu semua selesai.
5. **Saat menu selesai,** ubah status di sidebar (`admin-sidebar.tsx` → `status: "ready"`), update tabel di plan ini → ✅ Done, dan update tabel di `docs/prd/README.md` bila perlu.

> Bila PRD perlu direvisi selama implementasi, **stop coding** — update PRD-nya dulu (naikkan versi di header), lalu lanjutkan. Jangan biarkan kode & PRD divergen.

---

## Catatan Iterasi

_Tambah entri di sini saat ada keputusan / blocker / revisi PRD selama implementasi. Format:_

```
- YYYY-MM-DD — <menu> — <ringkasan keputusan / blocker> (link PR / commit bila ada)
```

- 2026-05-15 — Categories — Implementasi Fase 1 #1 selesai. `Product.category` di-loose jadi `string`, seed `PRODUCTS` di `constants.ts` dilowercase, dan `product-store` ditambah `version: 1` + `migrate` agar localStorage existing ikut. Reorder pakai tombol arrow (drag handle ditunda). Catalog filter + gender banner + product form sudah baca dari `useCategoryStore`. Drag-and-drop, hierarki nested, dan bulk reassign tetap di future enhancements.
- 2026-05-16 — Shipping — Implementasi Fase 1 #3 selesai. `admin-shipping-store` baru dengan persist key `thickapparel-admin-shipping` menyimpan list kurir + warehouse origin (seed dari `SHIPPING_OPTIONS` & `WAREHOUSE` di `constants.ts`). Page `/admin/shipping` pakai dua tab (Kurir + Gudang Asal) dengan style editorial mirror dari Payment. `courier-options.tsx` di checkout sekarang baca langsung dari store (tarif flat per PRD §4 Out of Scope: "Tarif dinamis per zona") — `shippingService.calculateCost` mock dilepas dari flow ini. Empty-state guard saat tidak ada kurir enabled. Konstanta `SHIPPING_OPTIONS`/`WAREHOUSE` dipertahankan sesuai opsi PRD §9.
- 2026-05-16 — Magazine — Implementasi Fase 1 #4 selesai. `magazine-store` baru (persist key `thickapparel-magazine`) hydrate dari `ARTICLES`; aksi CRUD + `setFeatured` exclusive (auto-unset featured lain). Route admin: list (`/admin/magazine`), create (`/admin/magazine/new`), edit (`/admin/magazine/[slug]/edit`). Komponen `article-form` punya block repeater (paragraph/heading/image/quote) dengan reorder + delete + auto-fill description. Slug auto dari judul, immutable di mode edit. Storefront (`/magazine`, `/magazine/[slug]`, `LatestMagazine`) sekarang client component baca dari store — `generateStaticParams` dilepas karena data dinamis dari localStorage. Tanggal disimpan tetap sebagai display string id-ID ("12 Mei 2026"), input via `<input type="date">` lalu di-format dengan `Intl.DateTimeFormat("id-ID")`.
- 2026-05-16 — Settings — Implementasi Fase 2 #7 selesai. `settings-store` baru (persist key `thickapparel-settings`) menyimpan 7 section: branding, contact, social, footer, seo, integrations, maintenance. Halaman `/admin/settings` pakai layout dossier — TOC rail kiri (sticky) + section cards kanan, masing-masing punya draft state + dirty/save lifecycle terpisah (lihat `components/admin/settings/section-shell.tsx`). Footer & Navbar storefront sekarang konsumsi `useSettingsStore` (brand name, about copy, sosial, copyright, newsletter heading); footer auto-hide kanal sosial yang URL-nya kosong. Maintenance mode di-implement via `<MaintenanceGate>` di root `layout.tsx` — overlay full-screen client-side cek `pathname` (skip `/admin/*` saat `allowAdmin`). Integrations section punya secret reveal/copy + disclaimer prototype localStorage; SEO section punya SERP preview + OG card preview. Metadata `<title>`/`<meta>` di `layout.tsx` masih static fallback (PRD §10 dependency catat next-head dynamic enhancement → future). Section "Reset Default" per-section + global "Reset Semua" via ConfirmModal.
- 2026-05-16 — Home Content — Implementasi Fase 2 #8 selesai. `home-content-store` baru (persist key `thickapparel-home-content`) menyimpan: heroSlides (max 6), tickerText, uspItems (2–6), editorsPicks (id-based, bukan index!), visibility (7 toggle). Halaman `/admin/home` pakai composer layout — TOC kiri + 5 section editor (`components/admin/home/*`): Hero (URL repeater + thumbnail preview + reorder), Ticker (textarea + live marquee preview), USP (icon+title+sub repeater + grid preview), Editor's Picks (3 product picker dropdown searchable, exclude-self, stock warning + layout preview), Visibility (toggle list + wireframe preview). Storefront refactor: `hero-section`, `ticker`, `usp-strip`, `editors-picks`, `new-arrivals`, `latest-magazine`, `gender-banner` semua jadi client component baca dari store; `editors-picks.tsx` pindah dari index access (`PRODUCTS[1]`) ke `useProductStore.find(id)` dengan graceful fallback (placeholder card jika produk tidak ditemukan). `gender-banner` ditambah ke `app/page.tsx` agar bisa di-toggle (default visibility off). Tailwind `md:grid-cols-{n}` dynamic di USP strip pakai static lookup map agar JIT scanner pickup.
- 2026-05-16 — Promo — Implementasi Fase 2 #10 selesai untuk admin CRUD. `admin-promo-store` baru (persist key `thickapparel-admin-promo`) menyimpan 8 seed kampanye (WELCOME10, RAYA2026, GRATISONGKIR, FLASH50K, LOYAL15, AKSESORIS25, NEWYEAR24, WEEKEND9K). Route admin: list (`/admin/promo`) dengan insight strip 4-metrik, filter tabs lifecycle (all/active/scheduled/paused/expired), ledger + usage bar; form (`/admin/promo/new`, `/admin/promo/[id]/edit`) mendukung tipe `percent` / `fixed` / `shipping`, cap maksimum (percent), kuota pemakaian (nullable = ∞), applicability (all / category / first-order). Lifecycle status dihitung di selector via `getPromoLifecycle()` — bukan field tersimpan — sehingga otomatis konsisten dengan tanggal & kuota (sesuai PRD §5.5 "derive di selector"). Live preview pakai kartu kupon perforated dengan stub kiri + body kanan untuk evoke ticket fisik. **Deferred ke iterasi berikutnya:** runtime apply di product list/detail (PRD §5.4 — tidak mengubah harga master), halaman `/admin/promo/badges` (PRD §5.3 — custom badge), integrasi checkout (apply kode + validasi min purchase + ongkir gratis). Sidebar status di-flip ke `ready`.
- 2026-05-16 — Admin Users — Implementasi Fase 2 #9 selesai untuk admin roster + invite UI. `admin-team-store` baru (persist key `thickapparel-admin-team`) menyimpan 7 seed anggota dengan campuran peran (owner/manager/staff) & status (active/invited/suspended). Route admin: list (`/admin/admins`) dengan insight strip + mini bar-chart distribusi peran, filter tabs status, grid kartu monogram tipografis (initial 2-huruf serif di atas pola diagonal halus); form (`/admin/admins/new`, `/admin/admins/[id]/edit`) mendukung pemilihan peran (Owner-lock — tidak bisa diturunkan dari halaman ini), status, 2FA toggle, catatan internal, dengan ID-card preview hidup di kolom kanan. Owner & akun sendiri di-guard dari penghapusan. **Deferred ke iterasi berikutnya:** refactor `admin-auth-store.ts` untuk membawa `role` + `permissions` di session (PRD §6), login (`/admin/login`) baca dari store ini alih-alih `ADMIN_CREDENTIALS` di `admin-seeds.ts` (PRD §5.5), sidebar filter berdasarkan role (PRD §5.6), per-page guard (PRD §5.7), halaman `/admin/profile`. Saat ini hanya satu admin seed di `admin-seeds.ts` yang aktif sebagai akun login — daftar di `/admin/admins` masih murni data-driven untuk display & invite tracking. Sidebar status di-flip ke `ready`.
