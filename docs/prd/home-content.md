# PRD — Dashboard: Home Content / Banner Management

| Status   | Draft v1.0                                  |
| -------- | ------------------------------------------- |
| Owner    | Admin / Content Editor                      |
| Priority | P2 (Medium)                                 |
| Tanggal  | 2026-05-15                                  |

---

## 1. Ringkasan

Menambahkan menu **Home Content** di dashboard admin untuk mengelola section dinamis di halaman utama (`/`): Hero slider, Ticker bar, USP strip, Editor's Picks, dan Latest Magazine. Saat ini semua hardcoded di komponen masing-masing — kalau brand ingin ganti banner kampanye atau pilihan produk featured, harus edit kode.

## 2. Latar Belakang

Section di home dan lokasi hardcoded-nya:

| Section          | File                                                  | Konten Hardcoded                                  |
| ---------------- | ----------------------------------------------------- | ------------------------------------------------- |
| Ticker bar       | `src/components/layout/ticker.tsx`                    | Teks marquee atas                                 |
| Hero slider      | `src/components/home/hero-section.tsx:7`              | Array 4 URL Unsplash                              |
| USP strip        | `src/components/home/usp-strip.tsx:1`                 | 4 USP (icon emoji + title + sub)                  |
| Editor's Picks   | `src/components/home/editors-picks.tsx:8`             | `[PRODUCTS[1], PRODUCTS[2], PRODUCTS[3]]` (index!) |
| Latest Magazine  | `src/components/home/latest-magazine.tsx`             | Auto-pull artikel terbaru                         |
| Gender Banner    | `src/components/home/gender-banner.tsx`               | 3 kategori utama                                  |
| New Arrivals     | `src/components/home/new-arrivals.tsx`                | Auto-pull produk badge "NEW"                      |

Editor's Picks paling rapuh: pakai **index** array, bukan id → kalau urutan `PRODUCTS` berubah / produk dihapus, featured slot rusak.

## 3. Pengguna & Use Case

| Peran           | Kebutuhan                                                                |
| --------------- | ------------------------------------------------------------------------ |
| Content Editor  | Ganti hero, edit ticker, ubah USP icon/teks tiap kampanye.               |
| Merchandiser    | Pilih 3 produk yang tampil di Editor's Picks; pilih artikel featured.    |
| Admin           | Toggle visibility section (mis. sembunyikan USP strip untuk A/B test).   |

### User Stories

1. Sebagai content editor, saya ingin ganti 4 slide hero dengan URL baru untuk kampanye Lebaran.
2. Sebagai content editor, saya ingin mengedit teks ticker bar (promo, free ongkir, dll).
3. Sebagai content editor, saya ingin menambah/menghapus/mengedit item USP.
4. Sebagai merchandiser, saya ingin memilih 3 produk Editor's Picks berdasarkan **id produk** (bukan index), dengan preview susunan grid.
5. Sebagai admin, saya ingin toggle on/off setiap section.

## 4. Scope

### In Scope
- Satu halaman `/admin/home-content` dengan tab atau section terpisah:
  - **Hero Slider** — repeater URL gambar (min 1, maks 6).
  - **Ticker Bar** — text + speed (opsional) + enabled.
  - **USP Strip** — repeater item {icon, title, sub} (min 2, maks 6) + enabled.
  - **Editor's Picks** — pick 3 produk by id (hero/big + 2 small) + enabled.
  - **Section Visibility** — toggle global: `showHero`, `showTicker`, `showUsp`, `showEditorsPicks`, `showLatestMagazine`, `showNewArrivals`, `showGenderBanner`.
- Store baru `home-content-store`.
- Storefront komponen baca dari store.

### Out of Scope
- Editor visual / drag-drop layout reorder.
- A/B testing & analytic per section.
- Schedule publish per section (mis. tampilkan banner X mulai tanggal Y).
- CRUD New Arrivals (tetap auto-pull badge "NEW").
- CRUD Gender Banner (tetap mapping ke kategori).
- CRUD Latest Magazine selection (auto-pull terbaru dari Magazine store).

## 5. Functional Requirements

### 5.1 Hero Slider Section

- Repeater list URL.
- Field per slide: `src` (URL), `alt` (opsional), `order`.
- Tombol **+ Tambah Slide**, drag-reorder, hapus.
- Preview thumb kecil per slide.
- Validasi: min 1 slide, hostname allowlist.

### 5.2 Ticker Bar Section

- Field tunggal `text` (textarea, separator otomatis dengan `✦` di antara fragmen — atau biarkan user input bebas).
- Toggle `enabled`.

### 5.3 USP Strip Section

- Repeater item:
  | Field | Type    | Validasi                |
  | ----- | ------- | ----------------------- |
  | Icon  | string  | emoji 1–4 char ATAU URL |
  | Title | string  | 3–30 karakter           |
  | Sub   | string  | 5–60 karakter           |
- Toggle `enabled`. Min 2 item, maks 6.

### 5.4 Editor's Picks Section

- Pick 3 produk by id:
  - **Hero slot** (big card kiri) — 1 produk.
  - **Small slot 1** & **Small slot 2** — 2 produk.
- UI: 3 select / search dropdown, masing-masing menampilkan thumb + nama + harga.
- Validasi: id harus ada di product store; produk dengan `stock = 0` boleh dipilih tapi tampilkan warning.
- Toggle `enabled`.

### 5.5 Section Visibility

- Daftar toggle untuk semua section home, termasuk yang tidak punya CRUD (Latest Magazine, New Arrivals, Gender Banner).
- Disimpan sebagai object boolean di store.

## 6. Data Model

### Type baru — `src/types/home-content.ts`

```ts
export interface HeroSlide {
  src: string;
  alt?: string;
  order: number;
}

export interface UspItem {
  icon: string;
  title: string;
  sub: string;
  order: number;
}

export interface HomeContent {
  heroSlides: HeroSlide[];
  tickerText: string;
  uspItems: UspItem[];
  editorsPicks: {
    heroProductId: number;
    smallProductIds: [number, number];
  };
  visibility: {
    showHero: boolean;
    showTicker: boolean;
    showUsp: boolean;
    showEditorsPicks: boolean;
    showLatestMagazine: boolean;
    showNewArrivals: boolean;
    showGenderBanner: boolean;
  };
}
```

### Store baru — `src/stores/home-content-store.ts`

```ts
interface HomeContentStore {
  content: HomeContent;
  setHeroSlides: (slides: HeroSlide[]) => void;
  setTickerText: (text: string) => void;
  setUspItems: (items: UspItem[]) => void;
  setEditorsPicks: (picks: HomeContent["editorsPicks"]) => void;
  setVisibility: (patch: Partial<HomeContent["visibility"]>) => void;
  reset: () => void;     // restore ke seed default
}
```

- Persist key: `thickapparel-home-content`.
- Seed initial: extract dari komponen existing.

## 7. UX & Pola Desain

- Sidebar group **Content** → item **Home / Banner** (icon `LayoutTemplate` atau `Image`).
- Tabs di dalam halaman (atau accordion section): Hero · Ticker · USP · Editor's Picks · Visibility.
- Preview live di sidebar kanan (mis. mini-frame menampilkan section yang sedang diedit).
- Tombol global **Reset ke Default** di footer halaman + konfirmasi modal.

## 8. Acceptance Criteria

- [ ] Menu Home Content muncul di sidebar group **Content**.
- [ ] CRUD hero slides → home page menampilkan slide baru.
- [ ] Edit ticker text → ticker bar update.
- [ ] CRUD USP item → strip update.
- [ ] Pilih Editor's Picks by id → 3 slot terisi sesuai pilihan.
- [ ] Toggle visibility section → section hilang dari home tapi data tidak terhapus.
- [ ] Reset ke default mengembalikan ke seed.
- [ ] Reload persist.

## 9. Technical Notes

- File baru: `src/types/home-content.ts`, `src/stores/home-content-store.ts`, `src/app/admin/home-content/page.tsx`, dan komponen form-form section di `src/components/admin/home/*`.
- Konversi semua komponen home jadi konsumen `useHomeContentStore` (mungkin lewat client wrapper agar SSR aman).
- Editor's Picks: refactor `editors-picks.tsx:8` dari index access ke `useProductStore.getById(id)` + fallback (skip jika produk tidak ada).
- New Arrivals & Gender Banner & Latest Magazine: tetap auto, hanya toggle visibility.

## 10. Dependencies & Risks

- **Hydration mismatch:** komponen home semula static, jadi dynamic. Mitigasi: gunakan suspense + skeleton, atau snapshot first paint dari seed.
- **Image hostname:** validasi URL hero/USP icon harus dalam `next.config.ts` allowlist.
- **Dependency ke Product store:** kalau produk Editor's Picks dihapus dari Products admin, harus graceful fallback (tampilkan slot kosong + warning di admin).

## 11. Future Enhancements

- Drag-drop reorder section di home.
- Schedule publish per section (mis. banner kampanye Lebaran mulai 2026-04-01).
- Multi-language content (ID/EN).
- A/B testing variant per section.
- Analytics per section (CTR Editor's Picks, slide views, dll).
- Manual override Latest Magazine selection (pin artikel tertentu).
