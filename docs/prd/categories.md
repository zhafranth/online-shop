# PRD — Dashboard: Product Categories Management

| Status   | Draft v1.0                                  |
| -------- | ------------------------------------------- |
| Owner    | Admin / Merchandiser                        |
| Priority | P1 (High)                                   |
| Tanggal  | 2026-05-15                                  |

---

## 1. Ringkasan

Mengubah kategori produk dari **literal type union** (`"Men" | "Women" | "Unisex" | "Aksesoris"`) menjadi **data dinamis** yang dikelola di dashboard. Tambahan menu **Categories** untuk CRUD kategori, termasuk metadata tampilan (label, slug, gender filter mapping, urutan).

## 2. Latar Belakang

- Kategori saat ini di `src/types/index.ts:6` adalah union literal — tidak bisa ditambah dari admin.
- Filter katalog di `/catalog` dan komponen `GenderBanner` di home memetakan kategori → tampilan (lihat `src/components/home/gender-banner.tsx`).
- Penambahan kategori (mis. "Anak", "Sport") saat ini = ubah kode di banyak tempat (type, filter sidebar, banner, form produk).

## 3. Pengguna & Use Case

| Peran           | Kebutuhan                                                                |
| --------------- | ------------------------------------------------------------------------ |
| Merchandiser    | Tambah / hapus kategori sesuai strategi koleksi.                         |
| Content Editor  | Atur label tampilan, deskripsi singkat, dan cover image kategori.        |
| Admin           | Reorder kategori untuk prioritas tampilan.                               |

### User Stories

1. Sebagai merchandiser, saya ingin menambahkan kategori "Anak" supaya produk baru bisa di-tag.
2. Sebagai content editor, saya ingin mengubah label "Aksesoris" menjadi "Accessories" tanpa edit kode.
3. Sebagai admin, saya ingin menonaktifkan kategori sementara (hide dari filter & navigasi) tanpa menghapus produknya.
4. Sebagai admin, saya ingin reorder kategori sesuai prioritas brand.
5. Sebagai admin, saya ingin mencegah hapus kategori yang masih punya produk aktif.

## 4. Scope

### In Scope
- Halaman `/admin/categories` — CRUD kategori produk.
- Field per kategori: id, label, slug, description (opsional), coverImage (opsional), enabled, order.
- Form produk (`product-form.tsx`) ambil daftar kategori dari store.
- Filter katalog & gender banner di home baca dari store.
- Constraint: hapus kategori → blok jika ada produk yang masih memakai; tampilkan pesan error.
- Migrasi: `Product.category` berubah dari union literal jadi `string` (id kategori), nilai existing tetap.

### Out of Scope
- Subkategori / hierarki nested.
- Kategori per-collection (musim, kampanye).
- Kategori untuk magazine (lihat PRD Magazine — masih hardcoded).
- Bulk reassign produk antar kategori (manual edit per produk).

## 5. Functional Requirements

### 5.1 List — `/admin/categories`

- Header: judul "Kategori Produk", tombol **+ Tambah Kategori**.
- Tabel kolom: Order (drag handle), Cover (thumb opsional), Label, Slug, Jumlah Produk (count dari product store), Status (Enabled toggle), Aksi (Edit / Hapus).
- Hapus disabled (tooltip) bila count > 0; sebagai gantinya tampilkan instruksi "Pindahkan produk dulu".

### 5.2 Create / Edit Kategori

#### Form fields
| Field         | Type        | Validasi                                                       |
| ------------- | ----------- | -------------------------------------------------------------- |
| ID            | string      | unique, slug kebab-case, immutable saat edit                   |
| Label         | string      | 2–30 karakter                                                  |
| Slug          | string      | auto dari ID, editable, unique                                 |
| Description   | textarea    | maks 200 karakter (opsional)                                   |
| Cover Image   | URL         | opsional; hostname allowlist                                   |
| Enabled       | toggle      | default true                                                   |

CTA: **Simpan**, **Batal**.

### 5.3 Integrasi Storefront & Admin Lain

- **Catalog filter** (`/catalog`): sidebar filter kategori → baca store.
- **Gender banner home**: mapping ke kategori utama (Men / Women / Unisex) — fallback tetap hardcoded jika kategori tidak ditemukan.
- **Product form** (`src/components/admin/product-form.tsx`): dropdown kategori dari store (bukan konstanta `CATEGORIES`).
- **Product type**: `Product.category` berubah jadi `string` (id), bukan literal union. Lihat _Migration_.

### 5.4 Hapus dengan Constraint

- Sebelum hapus: hitung produk dengan `product.category === category.id`.
- Bila count > 0: tampilkan modal "Tidak bisa hapus" + list 5 produk teratas + saran "Ubah kategori produk dulu".
- Bila count = 0: konfirmasi standar `ConfirmModal`.

## 6. Data Model

### Type baru — `src/types/category.ts`

```ts
export interface ProductCategory {
  id: string;                // "men", "women", "unisex", "aksesoris", "anak", ...
  label: string;             // "Men", "Women", ...
  slug: string;              // sama dengan id default; bisa berbeda untuk URL friendly
  description?: string;
  coverImage?: string;
  enabled: boolean;
  order: number;
}
```

### Perubahan Type Existing — `src/types/index.ts`

```ts
// Sebelum:
category: "Men" | "Women" | "Unisex" | "Aksesoris";

// Sesudah:
category: string;            // = ProductCategory.id
```

### Store baru — `src/stores/category-store.ts`

```ts
interface CategoryStore {
  categories: ProductCategory[];
  addCategory: (cat: ProductCategory) => void;
  updateCategory: (id: string, patch: Partial<ProductCategory>) => void;
  deleteCategory: (id: string) => boolean;       // false jika dipakai produk
  reorder: (orderedIds: string[]) => void;
  getById: (id: string) => ProductCategory | undefined;
}
```

- Persist key: `thickapparel-categories`.
- Seed initial:
  ```ts
  [
    { id: "men",        label: "Men",        slug: "men",        enabled: true, order: 1 },
    { id: "women",      label: "Women",      slug: "women",      enabled: true, order: 2 },
    { id: "unisex",     label: "Unisex",     slug: "unisex",     enabled: true, order: 3 },
    { id: "aksesoris",  label: "Aksesoris",  slug: "aksesoris",  enabled: true, order: 4 },
  ]
  ```

## 7. UX & Pola Desain

- Sidebar group **Catalog** → item **Categories** (icon `Tag` atau `FolderTree`).
- Form pakai layout 2 kolom (form kiri, preview card kanan).
- Drag-handle reorder konsisten dengan PRD Shipping & Payment.

## 8. Acceptance Criteria

- [ ] Menu **Categories** muncul di sidebar admin.
- [ ] CRUD kategori berfungsi; reload persist.
- [ ] Form produk menampilkan dropdown kategori dari store.
- [ ] Catalog filter `/catalog` & gender banner home baca dari store.
- [ ] Toggle `enabled = false` menyembunyikan kategori dari filter & navigasi tapi produk tetap ada (hanya tidak terfilter).
- [ ] Hapus kategori dengan produk aktif → diblokir dengan pesan jelas.
- [ ] Hapus kategori kosong → konfirmasi modal → hilang.
- [ ] Existing produk dengan kategori lama tetap valid (tidak orphan) selama id sama.

## 9. Technical Notes

- File baru: `src/types/category.ts`, `src/stores/category-store.ts`, `src/app/admin/categories/page.tsx`, `src/components/admin/category-form.tsx`.
- Migrasi type `Product.category`: melonggarkan dari union ke `string` adalah breaking type-wise — TypeScript akan menemukan setiap usage. Tangani semua dengan loop test build (`npm run build` & `lint`).
- Pertahankan backward compatibility: id seed = lowercase versi nilai literal sebelumnya, sehingga produk existing tetap match.
- `product-form.tsx` mengganti konstanta `CATEGORIES` dengan `useCategoryStore`.

## 10. Dependencies & Risks

- **Breaking change pada Product type** — perlu sweep TypeScript ke seluruh repo (`grep "category:"`).
- **Filter `/catalog`** sudah hardcode opsi kategori; harus dirombak baca dari store.
- **Orphan products** jika user hapus kategori dengan force; mitigasi: blok hapus jika masih ada produk (sudah di-cover Acceptance Criteria).
- **Migrasi data persisted** — user yang sudah punya `thickapparel-products` di localStorage tidak terpengaruh karena `category` masih string. Tapi kalau ada validasi runtime di store hydrate, perlu di-loosen.

## 11. Future Enhancements

- Kategori hierarkis (Men → Atasan → Kemeja).
- Mapping kategori ke gender filter agar `GenderBanner` & navbar otomatis di-generate.
- SEO per kategori (meta title, description, cover, OG image).
- Kategori untuk magazine (sekali pola siap, replikasi ke PRD Magazine kategori).
- Bulk reassign produk via admin (multi-select + change category).
