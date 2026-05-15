# PRD — Dashboard: Promo / Discount Management

| Status   | Draft v1.0                                          |
| -------- | --------------------------------------------------- |
| Owner    | Admin / Merchandiser                                |
| Priority | P2 (Medium)                                         |
| Tanggal  | 2026-05-15                                          |

---

## 1. Ringkasan

Menambahkan menu **Promo** di dashboard admin untuk mengelola promo terpusat: kampanye diskon yang menyentuh banyak produk sekaligus, dengan badge konsisten (`SALE`, `NEW`, `BEST SELLER`), serta opsi diskon persentase / nominal / harga coret manual. Saat ini diskon hanya dapat di-set per produk via field `originalPrice` + `badge` di product form — tidak ada cara menjalankan kampanye lintas produk.

## 2. Latar Belakang

- Field di `Product` (`src/types/index.ts:5-9`): `originalPrice: number | null`, `badge: "NEW" | "BEST SELLER" | "SALE" | null`.
- Saat ini diskon = isi `originalPrice` lebih tinggi dari `price` lewat product form (`src/components/admin/product-form.tsx:29`).
- Tidak ada konsep kampanye terpusat: kalau ingin "Diskon 20% semua kategori Women selama 1 minggu", admin harus edit puluhan produk satu per satu, lalu kembalikan setelah kampanye selesai.

## 3. Pengguna & Use Case

| Peran          | Kebutuhan                                                                          |
| -------------- | ---------------------------------------------------------------------------------- |
| Merchandiser   | Buat kampanye diskon massal dengan target kategori / produk pilihan.               |
| Admin          | Schedule kampanye (mulai/akhir), monitor produk yang ter-discount.                 |
| Content Editor | Buat badge khusus (mis. "RAMADAN SALE") sebagai tambahan ke 3 badge default.       |

### User Stories

1. Sebagai merchandiser, saya ingin membuat kampanye "Lebaran Sale 25%" yang otomatis menerapkan diskon 25% pada semua produk kategori "Men" & "Women" dari 2026-04-01 sampai 2026-04-15.
2. Sebagai merchandiser, saya ingin memilih produk spesifik (multi-select) untuk masuk ke kampanye.
3. Sebagai admin, saya ingin badge produk otomatis ter-set ke badge kampanye saat aktif, dan revert ke badge asli saat selesai.
4. Sebagai content editor, saya ingin menambah badge baru (mis. "FLASH SALE") untuk dipakai di kampanye.
5. Sebagai admin, saya ingin melihat list kampanye dengan status (Scheduled / Active / Ended) dan jumlah produk terpengaruh.

## 4. Scope

### In Scope
- Halaman list kampanye `/admin/promo`.
- Halaman create / edit `/admin/promo/new`, `/admin/promo/[id]/edit`.
- Tipe diskon: percentage (%) atau nominal (Rp).
- Target: by kategori (multi), by produk (multi), atau "all products".
- Schedule: `startAt` + `endAt` (ISO).
- Status otomatis berdasarkan tanggal: `scheduled` / `active` / `ended`. Toggle manual `paused` (override aktif → tidak aktif).
- Apply effect pada produk: hitung `effectivePrice` dan `displayBadge` di runtime — **tidak mengubah field `price`/`originalPrice` produk asli** (non-destructive).
- Badge custom: CRUD daftar badge label tambahan.

### Out of Scope
- Voucher / coupon code (input kode saat checkout) — lihat _Future_.
- Bundle / buy-X-get-Y.
- Diskon ongkir.
- Diskon stacking (1 produk hanya dapat 1 kampanye aktif; jika tumpang tindih → ambil yang `priority` tertinggi).
- Member-only / customer-segment discount.
- Limit penggunaan (mis. 100 transaksi pertama).

## 5. Functional Requirements

### 5.1 List Kampanye — `/admin/promo`

- Header: judul "Promo & Diskon", tombol **+ Buat Kampanye**.
- Tabel kolom: Status (badge berwarna), Nama Kampanye, Tipe Diskon, Target, Mulai, Berakhir, Jumlah Produk Terkena, Aksi.
- Filter status (All / Scheduled / Active / Ended / Paused).
- Sort default: `startAt` DESC.

### 5.2 Create / Edit Kampanye

#### Form fields utama
| Field         | Type                                | Validasi                              |
| ------------- | ----------------------------------- | ------------------------------------- |
| Nama          | string                              | 3–60 karakter, unique                  |
| Deskripsi     | textarea                            | maks 200 karakter (opsional)          |
| Tipe Diskon   | radio: `percentage` / `nominal`     | required                              |
| Nilai Diskon  | number                              | percentage: 1–90; nominal: > 0        |
| Badge Override| select (existing + custom)          | required jika ingin override badge    |
| Mulai (startAt)| datetime-local                     | required                              |
| Berakhir (endAt)| datetime-local                    | required, > startAt                   |
| Priority      | number                              | 0–100, default 0                      |
| Paused        | toggle                              | default false                         |

#### Target picker
- Radio: **All Products** / **By Category** / **By Specific Products**.
- Jika By Category: multi-select kategori (dari Category store).
- Jika By Specific Products: searchable multi-select produk (dari Product store).

#### Preview Section
- Live count: "Akan menerapkan kampanye ke X produk".
- Sample 3 produk (thumb + nama + harga asli + harga setelah diskon).

### 5.3 Custom Badge — `/admin/promo/badges` (sub-page)

- List badge (default 3 + custom).
- CRUD custom badge: `label`, `color` (hex atau token), `order`.
- Default 3 badge (`NEW`, `BEST SELLER`, `SALE`) tidak bisa dihapus tapi bisa di-edit warna.

### 5.4 Runtime Apply

- Pada read product di storefront, evaluasi setiap kampanye `active` yang menarget produk tsb.
- Jika ada match: hitung `effectivePrice`; tampilkan `originalPrice = product.price`, `price = effectivePrice`; override `badge` jika kampanye punya `badgeOverride`.
- Jika beberapa kampanye match: ambil `priority` tertinggi.

### 5.5 Status Otomatis

Selector helper di store:
```ts
function getCampaignStatus(campaign: PromoCampaign, now = new Date()): CampaignStatus {
  if (campaign.paused) return "paused";
  if (now < new Date(campaign.startAt)) return "scheduled";
  if (now > new Date(campaign.endAt)) return "ended";
  return "active";
}
```

## 6. Data Model

### Type baru — `src/types/promo.ts`

```ts
export type DiscountType = "percentage" | "nominal";
export type CampaignTarget = "all" | "category" | "product";
export type CampaignStatus = "scheduled" | "active" | "ended" | "paused";

export interface PromoCampaign {
  id: string;                  // UUID
  name: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  badgeOverride?: string;      // label badge atau null
  target: CampaignTarget;
  categoryIds?: string[];      // jika target = "category"
  productIds?: number[];       // jika target = "product"
  startAt: string;             // ISO
  endAt: string;
  paused: boolean;
  priority: number;
  createdAt: string;
}

export interface CustomBadge {
  label: string;
  color: string;               // hex atau token
  order: number;
  isDefault: boolean;          // true untuk NEW/BEST SELLER/SALE
}
```

### Store baru — `src/stores/promo-store.ts`

```ts
interface PromoStore {
  campaigns: PromoCampaign[];
  badges: CustomBadge[];
  addCampaign: (campaign: PromoCampaign) => void;
  updateCampaign: (id: string, patch: Partial<PromoCampaign>) => void;
  deleteCampaign: (id: string) => void;
  togglePause: (id: string) => void;
  addBadge: (badge: CustomBadge) => void;
  updateBadge: (label: string, patch: Partial<CustomBadge>) => void;
  deleteBadge: (label: string) => void;       // blok jika isDefault
  getEffectiveForProduct: (productId: number, categoryId: string) => {
    price: number;
    originalPrice: number | null;
    badge: string | null;
  };
}
```

- Persist key: `thickapparel-promo`.

## 7. UX & Pola Desain

- Sidebar group **Sales** → item **Promo** (icon `Tag` atau `Percent`).
- Sub-route badge: tab atau link "Kelola Badge" di header `/admin/promo`.
- Status badge berwarna (Scheduled = abu, Active = hijau, Ended = abu tua, Paused = kuning).
- Live preview wajib untuk feedback cepat ke merchandiser.

## 8. Acceptance Criteria

- [ ] Menu Promo muncul di sidebar.
- [ ] CRUD kampanye berfungsi.
- [ ] Status otomatis sesuai tanggal saat ini.
- [ ] Toggle paused override status active → paused.
- [ ] Target "By Category" / "By Product" / "All" mempengaruhi jumlah produk preview.
- [ ] Storefront menampilkan harga setelah diskon + badge override.
- [ ] CRUD badge custom berfungsi; badge default tidak bisa dihapus.
- [ ] Multiple campaign overlap → priority tertinggi yang menang.
- [ ] Reload persist; status hitung ulang setelah reload.

## 9. Technical Notes

- File baru: `src/types/promo.ts`, `src/stores/promo-store.ts`, `src/app/admin/promo/page.tsx`, `.../new/page.tsx`, `.../[id]/edit/page.tsx`, `.../badges/page.tsx`, `src/components/admin/campaign-form.tsx`.
- Refactor: ProductCard & ProductDetail pakai helper `getEffectiveForProduct` (atau hook `useEffectivePrice(productId)`).
- Produk `originalPrice` lama tidak diutak-atik; kampanye non-destructive. Kalau produk sudah punya `originalPrice` manual DAN sedang ada kampanye, **kampanye menang** (override).
- Status realtime: pertimbangkan re-render hourly dengan `useEffect` interval, atau hitung saat read (lebih simple).

## 10. Dependencies & Risks

- **Tergantung Category store:** kalau Categories belum diimplementasi, target "By Category" tidak bisa dipakai. Mitigasi: Phase implementation **setelah** PRD Categories selesai.
- **Konflik dengan `originalPrice` manual produk:** dokumentasikan aturan menang (kampanye > manual).
- **Performance:** evaluasi `getEffectiveForProduct` di setiap render Product Card. Untuk MVP dengan 12+ produk masih fine; kalau katalog membesar, butuh memoization.
- **Time zone:** simpan ISO UTC, render dalam timezone Jakarta (Asia/Jakarta).

## 11. Future Enhancements

- Voucher / coupon code (input kode saat checkout).
- Bundle (buy 2 get 1) & buy-X-get-Y.
- Diskon ongkir / free shipping kampanye.
- Customer segment (member-only).
- Usage limit per kampanye.
- A/B testing diskon.
- Report sales lift per kampanye.
