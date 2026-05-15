# PRD — Dashboard: Magazine Management

| Status   | Draft v1.0                |
| -------- | ------------------------- |
| Owner    | Admin / Content Editor    |
| Priority | P1 (High)                 |
| Tanggal  | 2026-05-15                |

---

## 1. Ringkasan

Menambahkan menu **Magazine** di dashboard admin agar tim konten dapat mengelola artikel (CRUD) dan kategori magazine tanpa menyentuh kode. Saat ini artikel sudah tampil di `/magazine`, `/magazine/[slug]`, dan section `latest-magazine` di home, namun datanya hardcoded di `src/lib/magazine-seeds.ts`.

## 2. Latar Belakang

- Storefront sudah memiliki halaman `/magazine` (list + filter kategori) dan `/magazine/[slug]` (detail artikel).
- Home page menampilkan section `LatestMagazine` (`src/components/home/latest-magazine.tsx`) yang menarik artikel terbaru.
- Type & seed: `src/types/magazine.ts`, `src/lib/magazine-seeds.ts`.
- 3 kategori aktif: `Tips Mix & Match`, `Fashion News`, `Education`.
- Belum ada cara untuk admin menambah / mengedit / menghapus artikel.

## 3. Pengguna & Use Case

| Peran            | Kebutuhan                                                                |
| ---------------- | ------------------------------------------------------------------------ |
| Content Editor   | Menulis artikel baru, edit, hapus, atur featured, atur kategori.         |
| Admin (Owner)    | Melihat performa konten (jumlah artikel per kategori), kontrol publikasi.|

### User Stories

1. Sebagai content editor, saya ingin membuat artikel baru dengan judul, cover, excerpt, body (paragraf/heading/image/quote), dan kategori — sehingga artikel langsung tampil di `/magazine`.
2. Sebagai content editor, saya ingin menandai 1 artikel sebagai `featured` agar tampil di hero `/magazine` dan `LatestMagazine`.
3. Sebagai content editor, saya ingin mengedit/menghapus artikel yang sudah ada.
4. Sebagai admin, saya ingin daftar artikel terurut (terbaru/terlama) dengan filter kategori dan pencarian judul.
5. Sebagai admin, saya ingin slug otomatis di-generate dari judul tapi dapat di-override manual sebelum simpan.

## 4. Scope

### In Scope
- Halaman list artikel di `/admin/magazine` (tabel + filter).
- Halaman create di `/admin/magazine/new`.
- Halaman edit di `/admin/magazine/[slug]/edit`.
- CRUD via `magazine-store` baru (Zustand + persist).
- Migrasi seed `ARTICLES` ke store; storefront baca dari store.
- Slug otomatis (slugify dari judul, cek unik) + override manual.
- Block editor sederhana untuk `body` (form repeater untuk paragraph/heading/image/quote).
- Flag `featured` exclusive — hanya 1 artikel boleh featured per saat (auto-unset yang lama saat set baru).

### Out of Scope (future)
- Manajemen kategori dinamis (saat ini tetap 3 kategori hardcoded di type). Lihat _Future Enhancements_.
- WYSIWYG rich text editor (cukup form blocks).
- Schedule publish / draft state.
- Multi-author management; field `author` & `authorBio` cukup free-text.
- SEO meta (title/description) terpisah dari excerpt.
- Komentar / reaksi pembaca.

## 5. Functional Requirements

### 5.1 Halaman List — `/admin/magazine`

- Header: judul "Magazine", deskripsi singkat, tombol **+ Tambah Artikel**.
- Table kolom: Cover (thumb), Judul, Kategori (Badge), Author, Tanggal, Featured (icon star), Aksi (Edit / Hapus).
- Filter: dropdown kategori (All + 3 kategori).
- Search: input pencarian by judul (client-side, debounced 250ms).
- Sort: default `date` DESC.
- Empty state: "Belum ada artikel" + CTA tambah.
- Konfirmasi hapus via `ConfirmModal` (pola sama dengan `/admin/products`).

### 5.2 Halaman Create — `/admin/magazine/new`

Form fields (semua required kecuali ditandai):
| Field          | Type                              | Validasi                                            |
| -------------- | --------------------------------- | --------------------------------------------------- |
| Cover          | URL string (Unsplash atau remote) | Required; hostname harus di-allowlist `next.config` |
| Cover Caption  | string (opsional)                 | —                                                   |
| Judul          | string                            | 5–120 karakter                                      |
| Slug           | string (auto, editable)           | Unik di store; pola `kebab-case`                    |
| Excerpt        | string                            | 30–280 karakter                                     |
| Kategori       | select                            | salah satu `MagazineCategory`                       |
| Author         | string                            | 2–60 karakter                                       |
| Author Bio     | string (textarea)                 | maks 200 karakter                                   |
| Tanggal        | date                              | format input ISO, ditampilkan `dd MMMM yyyy` id-ID  |
| Read Time      | number (menit)                    | 1–60                                                |
| Featured       | toggle                            | jika true, unset featured artikel lain              |
| Body Blocks    | repeater                          | min 1 block                                         |

#### Body Blocks (repeater)
Setiap block punya field:
- `type` — select: `paragraph` / `heading` / `image` / `quote`
- `text` — textarea (untuk paragraph/heading/quote)
- `src` — input (untuk image)
- `caption` — input (untuk image)
- `attribution` — input (untuk quote)

Aksi: Tambah block, hapus block, reorder (drag handle atau tombol naik/turun).

CTA: **Simpan** (redirect ke list), **Batal**.

### 5.3 Halaman Edit — `/admin/magazine/[slug]/edit`

Sama dengan create, terisi data existing. Slug **read-only** di mode edit (karena dipakai sebagai URL `/magazine/[slug]`); ubah slug = artikel baru.

### 5.4 Integrasi Storefront

- `/magazine`, `/magazine/[slug]`, `latest-magazine`, dan home cards harus baca dari `useMagazineStore` (bukan import langsung `ARTICLES`).
- Server Component yang baca data → konversi ke Client Component yang hydrate dari store, atau pakai pola "read seed di server + override dari client store" jika SSR penting.

## 6. Data Model

Tidak ada perubahan type — gunakan `Article` & `MagazineBlock` yang sudah ada di `src/types/magazine.ts`.

### Store baru — `src/stores/magazine-store.ts`

```ts
interface MagazineStore {
  articles: Article[];
  addArticle: (article: Article) => void;
  updateArticle: (slug: string, patch: Partial<Article>) => void;
  deleteArticle: (slug: string) => void;
  setFeatured: (slug: string) => void;   // auto-unset featured lain
  getBySlug: (slug: string) => Article | undefined;
}
```

- Persist key: `thickapparel-magazine`
- Partialize: hanya `articles`.
- Hydrate awal: `ARTICLES` dari `magazine-seeds.ts`.

## 7. UX & Pola Desain

- Konsisten dengan `/admin/products` (table header style, Button, Badge, DataTable, ConfirmModal).
- Sidebar: tambah item **Magazine** dengan icon `Newspaper` (Lucide) di `src/components/admin/admin-sidebar.tsx`.
- Halaman form mengikuti layout `product-form.tsx` (2 kolom desktop, 1 kolom mobile).
- Toast feedback: "Artikel disimpan", "Artikel dihapus" — gunakan `cart-store` toast queue atau toast pattern existing.

## 8. Acceptance Criteria

- [ ] Menu **Magazine** muncul di sidebar admin dengan icon dan highlight aktif.
- [ ] `/admin/magazine` menampilkan tabel artikel dari store; filter & search berfungsi.
- [ ] `/admin/magazine/new` dapat membuat artikel; slug otomatis dari judul.
- [ ] `/admin/magazine/[slug]/edit` mengisi form dan menyimpan perubahan.
- [ ] Set featured artikel A meng-unset featured artikel B sebelumnya.
- [ ] Hapus artikel menampilkan `ConfirmModal`; setelah konfirmasi artikel hilang dari list & storefront.
- [ ] Artikel yang dibuat tampil di `/magazine`, halaman `/magazine/[slug]`, dan `LatestMagazine`.
- [ ] Reload browser tidak menghilangkan data (persist berjalan).

## 9. Technical Notes

- File baru: `src/stores/magazine-store.ts`, `src/components/admin/article-form.tsx`, `src/app/admin/magazine/page.tsx`, `.../new/page.tsx`, `.../[slug]/edit/page.tsx`.
- Storefront integration: ubah `src/app/magazine/page.tsx`, `src/app/magazine/[slug]/page.tsx`, `src/components/home/latest-magazine.tsx` agar baca dari store. Pertahankan SSR jika memungkinkan dengan fallback ke seed.
- Konsisten kebab-case untuk nama file.
- Image: tetap gunakan Unsplash URL yang sudah di-allowlist.

## 10. Dependencies & Risks

- **Hostname remote image:** kalau editor input host baru (bukan `images.unsplash.com`), Next.js Image akan error. Mitigasi: validasi URL & dokumentasikan di field hint.
- **Storefront SSR vs persisted client store:** rendering artikel mungkin flicker setelah hydrate. Mitigasi: pakai pola initial state dari seed lalu replace setelah hydration.

## 11. Future Enhancements

- Kategori magazine dinamis (CRUD kategori sendiri, lihat PRD Categories sebagai referensi pola).
- Draft / published / scheduled.
- Rich text editor (Tiptap/Lexical).
- SEO fields (meta title, meta description, OG image).
- Tag / topik per artikel + filter di storefront.
- Statistik view per artikel di dashboard.
