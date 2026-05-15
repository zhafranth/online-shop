# PRD — Dashboard: Size Guide Management

| Status   | Draft v1.0                                  |
| -------- | ------------------------------------------- |
| Owner    | Admin / Merchandiser                        |
| Priority | P2 (Medium)                                 |
| Tanggal  | 2026-05-15                                  |

---

## 1. Ringkasan

Menambahkan menu **Size Guide** di dashboard admin untuk mengelola tabel panduan ukuran (dada, pinggang, panggul, tinggi) yang tampil di halaman detail produk. Saat ini hardcoded sebagai konstanta `SIZE_GUIDE` di `src/lib/constants.ts:36`.

## 2. Latar Belakang

- `SIZE_GUIDE` di `constants.ts` berisi 6 baris ukuran (XS – 2XL) dengan kolom `size`, `dada`, `pinggang`, `panggul`, `tinggi`.
- Tabel ditampilkan di product detail page (kemungkinan di modal "Size Guide" — perlu cek implementasi storefront).
- Brand bisa berekspansi ukuran (3XL, 4XL) atau menambah kolom (lengan, bahu) tanpa harus edit kode.

## 3. Pengguna & Use Case

| Peran          | Kebutuhan                                                         |
| -------------- | ----------------------------------------------------------------- |
| Merchandiser   | CRUD baris ukuran, edit angka centimeter.                         |
| Content Editor | Tambah catatan kaki di bawah tabel (cara ukur, disclaimer).       |
| Admin          | Reorder ukuran (dari kecil ke besar atau sebaliknya).             |

### User Stories

1. Sebagai merchandiser, saya ingin menambahkan ukuran 3XL & 4XL untuk koleksi plus size.
2. Sebagai merchandiser, saya ingin mengubah range cm pada ukuran M karena spesifikasi produksi berubah.
3. Sebagai content editor, saya ingin menambahkan catatan "Ukur dada di bagian terlebar saat berdiri tegak" di bawah tabel.
4. Sebagai admin, saya ingin reorder baris (kecil-ke-besar atau sebaliknya).

## 4. Scope

### In Scope
- Halaman `/admin/size-guide` — tabel editable inline (atau modal edit per baris).
- CRUD baris size dengan kolom: `size`, `dada`, `pinggang`, `panggul`, `tinggi`.
- Field `note` global (textarea) — catatan di bawah tabel.
- Reorder baris (drag-handle atau tombol naik/turun).
- Store baru `size-guide-store`.

### Out of Scope
- Multi-tabel per kategori (mis. tabel khusus celana vs atasan). Saat ini satu tabel global.
- Kolom dinamis (mis. tambah "Lengan"). Kolom tetap 5: size + 4 measurement.
- Konversi cm ↔ inch.
- Visual size chart (gambar manekin).

## 5. Functional Requirements

### 5.1 Halaman — `/admin/size-guide`

- Header: judul "Panduan Ukuran", tombol **+ Tambah Ukuran**.
- Tabel kolom: Order (drag handle), Size, Dada, Pinggang, Panggul, Tinggi, Aksi (Edit / Hapus).
- Edit inline atau modal — preferensi MVP: **modal edit** untuk konsistensi pola.
- Setelah tabel: section **Catatan** dengan textarea + tombol Simpan.

### 5.2 Form Tambah / Edit Size

| Field    | Type   | Validasi                          |
| -------- | ------ | --------------------------------- |
| Size     | string | unique, 1–6 karakter (XS, S, 3XL) |
| Dada     | string | format `min–max` cm (mis. "80–84")|
| Pinggang | string | format `min–max` cm               |
| Panggul  | string | format `min–max` cm               |
| Tinggi   | string | format `min–max` cm               |

Validasi format: pakai regex `^\d{2,3}–\d{2,3}$` (en-dash) ATAU loosened ke text bebas dengan hint format. **Rekomendasi MVP**: text bebas + helper text "Format: 80–84 atau 80-84".

### 5.3 Catatan Footer

- Textarea, maks 500 karakter.
- Render di storefront sebagai paragraf di bawah tabel.

### 5.4 Integrasi Storefront

- Komponen Size Guide di product detail baca dari `useSizeGuideStore`.
- Fallback ke seed default jika store kosong.

## 6. Data Model

### Type baru — `src/types/size-guide.ts`

```ts
export interface SizeRow {
  size: string;
  dada: string;
  pinggang: string;
  panggul: string;
  tinggi: string;
  order: number;
}
```

### Store baru — `src/stores/size-guide-store.ts`

```ts
interface SizeGuideStore {
  rows: SizeRow[];
  note: string;
  addRow: (row: SizeRow) => void;
  updateRow: (size: string, patch: Partial<SizeRow>) => void;
  deleteRow: (size: string) => void;
  reorder: (orderedSizes: string[]) => void;
  setNote: (note: string) => void;
}
```

- Persist key: `thickapparel-size-guide`.
- Seed initial: hydrate dari `SIZE_GUIDE` di `constants.ts` dengan `order` 0..n.

## 7. UX & Pola Desain

- Sidebar group **Configuration** → item **Size Guide** (icon `Ruler`).
- Pola konsisten dengan `/admin/products` & `/admin/shipping`.
- Modal edit ukuran: kecil, fokus pada 5 field.

## 8. Acceptance Criteria

- [ ] Menu Size Guide muncul di sidebar.
- [ ] Tambah/edit/hapus baris ukuran berfungsi.
- [ ] Reorder mengubah urutan tampilan di tabel.
- [ ] Edit catatan footer disimpan dan muncul di storefront.
- [ ] Konfirmasi hapus via `ConfirmModal`.
- [ ] Storefront product detail menampilkan size guide dari store.
- [ ] Reload persist.

## 9. Technical Notes

- File baru: `src/types/size-guide.ts`, `src/stores/size-guide-store.ts`, `src/app/admin/size-guide/page.tsx`, `src/components/admin/size-row-form.tsx`.
- `SIZE_GUIDE` di `constants.ts` tetap dipertahankan sebagai seed default.

## 10. Dependencies & Risks

- **Format string range:** validasi loose dapat membuat data tidak konsisten. Mitigasi: helper text + parsing display side untuk normalisasi tanda hubung.
- **Storefront wiring:** jika size guide muncul di multiple tempat (cart, product detail), pastikan semua membaca store yang sama.

## 11. Future Enhancements

- Multi-tabel per kategori produk (atasan, bawahan, sepatu, aksesoris).
- Kolom dinamis (lengan, bahu, paha).
- Toggle cm ↔ inch di storefront.
- Visual size chart dengan gambar manekin & label.
- Size recommendation based on user profile (tinggi/berat).
