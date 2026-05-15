# PRD — Dashboard: Settings (Site Configuration)

| Status   | Draft v1.0                                  |
| -------- | ------------------------------------------- |
| Owner    | Admin (Owner / Super Admin)                 |
| Priority | P2 (Medium)                                 |
| Tanggal  | 2026-05-15                                  |

---

## 1. Ringkasan

Menambahkan menu **Settings** di dashboard admin sebagai pusat konfigurasi situs: identitas brand (logo, tagline), kontak (alamat, telepon, email), sosial media, footer copy, SEO meta default, integrasi API key (RajaOngkir, payment gateway), dan opsi maintenance mode. Saat ini semua tersebar di komponen footer/navbar/metadata layout.

## 2. Latar Belakang

Lokasi konfigurasi yang tersebar:

| Aspek                | File                                          |
| -------------------- | --------------------------------------------- |
| Site name & metadata | `src/app/layout.tsx`                          |
| Footer copy & sosmed | `src/components/layout/footer.tsx`            |
| Navbar branding      | `src/components/layout/navbar.tsx`            |
| Warehouse origin     | `src/lib/constants.ts:46` (sudah di PRD Shipping) |

Tidak ada satu tempat untuk admin mengubah identitas brand atau kontak.

## 3. Pengguna & Use Case

| Peran          | Kebutuhan                                                          |
| -------------- | ------------------------------------------------------------------ |
| Owner          | Update kontak, alamat, sosmed, logo saat rebrand atau pindah lokasi.|
| Content Editor | Ubah footer copy, tagline, meta description SEO.                   |
| Operations     | Ubah API key integrasi (RajaOngkir, payment).                      |

### User Stories

1. Sebagai owner, saya ingin mengubah nomor WhatsApp customer service tanpa edit kode.
2. Sebagai content editor, saya ingin mengubah tagline brand & meta description untuk SEO.
3. Sebagai operations, saya ingin menyimpan API key RajaOngkir di Settings (saat fitur real RajaOngkir aktif).
4. Sebagai owner, saya ingin mengaktifkan maintenance mode saat update besar (semua halaman publik menampilkan placeholder).
5. Sebagai admin, saya ingin mengubah link sosmed (Instagram, TikTok, dll).

## 4. Scope

### In Scope
- Halaman `/admin/settings` dengan tab/section:
  - **Branding** — nama brand, tagline, logo URL, favicon URL.
  - **Contact** — alamat, kota, telepon, WhatsApp, email customer service.
  - **Social Media** — Instagram, TikTok, YouTube, Twitter/X, Facebook (URL).
  - **Footer** — copy footer (about + newsletter heading), copyright text.
  - **SEO** — default meta title, meta description, OG image.
  - **Integrations** — API key (raja-ongkir, payment gateway) — read-only / masked dengan fitur reveal.
  - **Maintenance Mode** — toggle + custom message.
- Store baru `settings-store`.

### Out of Scope
- Multi-language config (ID-only saat ini).
- Currency setting (Rp fixed).
- Email server config (SMTP).
- Webhook configuration.
- Backup / restore settings.
- Domain & DNS config.

## 5. Functional Requirements

### 5.1 Branding Section

| Field        | Type   | Validasi               |
| ------------ | ------ | ---------------------- |
| Brand Name   | string | 2–30 karakter          |
| Tagline      | string | maks 60 karakter       |
| Logo URL     | URL    | opsional, allowlist    |
| Favicon URL  | URL    | opsional, .ico atau png|

### 5.2 Contact Section

| Field          | Type   | Validasi                |
| -------------- | ------ | ----------------------- |
| Alamat         | textarea | maks 200 karakter      |
| Kota           | string | 2–30 karakter           |
| Telepon        | string | format Indonesia        |
| WhatsApp       | string | format Indonesia        |
| Email CS       | string | format email valid      |
| Jam Operasional| textarea | maks 100 karakter       |

### 5.3 Social Media Section

Repeater dengan icon (Instagram, TikTok, YouTube, Twitter/X, Facebook) + URL field. Hanya yang terisi tampil di footer.

### 5.4 Footer Section

| Field             | Type     | Validasi             |
| ----------------- | -------- | -------------------- |
| About Text        | textarea | 30–500 karakter      |
| Newsletter Heading| string   | maks 60 karakter     |
| Copyright Text    | string   | maks 100 karakter (default "© 2026 ThickApparel") |

### 5.5 SEO Section

| Field              | Type     | Validasi                  |
| ------------------ | -------- | ------------------------- |
| Default Meta Title | string   | 10–60 karakter            |
| Default Description| textarea | 50–160 karakter           |
| OG Image URL       | URL      | opsional, allowlist       |
| Site URL (canonical)| URL     | required jika OG aktif    |

### 5.6 Integrations Section

| Field                  | Type   | Validasi              |
| ---------------------- | ------ | --------------------- |
| RajaOngkir API Key     | password | opsional, masked    |
| RajaOngkir Mode        | radio  | `mock` / `live`       |
| Payment Gateway Key    | password | opsional, masked    |
| Payment Gateway Mode   | radio  | `mock` / `live`       |

Tombol **Reveal** + **Copy** per field. **Catatan keamanan**: prototype frontend-only, secret tersimpan di localStorage — tidak aman untuk production. Sertakan disclaimer di UI.

### 5.7 Maintenance Mode

| Field          | Type     | Validasi                       |
| -------------- | -------- | ------------------------------ |
| Enabled        | toggle   | default false                  |
| Message        | textarea | maks 300 karakter              |
| ETA            | datetime-local | opsional                 |
| Allow Admin    | checkbox | default true                   |

Saat enabled = true:
- Semua route publik (`/`, `/catalog`, `/product/*`, dll) → render placeholder maintenance page dengan pesan & ETA.
- Route `/admin/*` tetap diakses bila `Allow Admin = true`.

## 6. Data Model

### Type baru — `src/types/settings.ts`

```ts
export interface SocialLink {
  platform: "instagram" | "tiktok" | "youtube" | "twitter" | "facebook";
  url: string;
}

export interface Settings {
  branding: {
    brandName: string;
    tagline: string;
    logoUrl?: string;
    faviconUrl?: string;
  };
  contact: {
    address: string;
    city: string;
    phone: string;
    whatsapp: string;
    emailCs: string;
    operationalHours: string;
  };
  social: SocialLink[];
  footer: {
    aboutText: string;
    newsletterHeading: string;
    copyright: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImage?: string;
    siteUrl?: string;
  };
  integrations: {
    rajaOngkirKey?: string;
    rajaOngkirMode: "mock" | "live";
    paymentGatewayKey?: string;
    paymentGatewayMode: "mock" | "live";
  };
  maintenance: {
    enabled: boolean;
    message: string;
    eta?: string;
    allowAdmin: boolean;
  };
}
```

### Store baru — `src/stores/settings-store.ts`

```ts
interface SettingsStore {
  settings: Settings;
  updateBranding: (patch: Partial<Settings["branding"]>) => void;
  updateContact: (patch: Partial<Settings["contact"]>) => void;
  updateSocial: (links: SocialLink[]) => void;
  updateFooter: (patch: Partial<Settings["footer"]>) => void;
  updateSeo: (patch: Partial<Settings["seo"]>) => void;
  updateIntegrations: (patch: Partial<Settings["integrations"]>) => void;
  setMaintenance: (patch: Partial<Settings["maintenance"]>) => void;
  reset: () => void;
}
```

- Persist key: `thickapparel-settings`.
- Seed initial: extract dari komponen existing (footer, navbar, layout).

## 7. UX & Pola Desain

- Sidebar bawah (sebelum Logout) → item **Settings** dengan icon `Settings`.
- Layout: vertical tab nav kiri (7 section) + content kanan, atau accordion section.
- Tombol **Simpan** sticky di bawah setiap section (atau di footer halaman).
- Disclaimer card di section Integrations: "Prototype mode — kunci tersimpan di localStorage browser, tidak aman untuk produksi."

## 8. Acceptance Criteria

- [ ] Menu Settings muncul di sidebar bawah.
- [ ] Setiap section dapat di-save independen.
- [ ] Footer & Navbar baca dari store; perubahan langsung tampil.
- [ ] Metadata layout (title, description, OG) ambil dari Settings SEO.
- [ ] Sosial media yang URL-nya kosong tidak tampil di footer.
- [ ] Maintenance mode `enabled = true` mengganti tampilan storefront ke placeholder.
- [ ] Reload persist; secret integrations tetap masked sampai user klik Reveal.
- [ ] Reset ke default berfungsi dengan modal konfirmasi.

## 9. Technical Notes

- File baru: `src/types/settings.ts`, `src/stores/settings-store.ts`, `src/app/admin/settings/page.tsx`, dan komponen section di `src/components/admin/settings/*`.
- Refactor Footer & Navbar: baca dari `useSettingsStore`.
- `layout.tsx`: metadata bisa di-set static (default) sebagai fallback, lalu Client Component memodifikasi DOM head bila perlu (next/head atau dynamic metadata API).
- Maintenance mode: tambah middleware atau wrapper di root layout untuk cek `maintenance.enabled`.

## 10. Dependencies & Risks

- **Secret di localStorage** = ketidakamanan inherent. Sertakan disclaimer tegas; saat backend dibangun, migrasikan ke server-side env.
- **SSR & next/font** — perubahan favicon / logo di runtime mungkin tidak ter-prefetch oleh head static. Mitigasi: dokumentasikan bahwa beberapa metadata butuh hard reload.
- **Maintenance Allow Admin**: pastikan admin login route tetap accessible bahkan saat maintenance enabled.

## 11. Future Enhancements

- Multi-language (ID/EN) toggle.
- Multi-currency.
- SMTP / email server config.
- Webhook config (Slack, Discord notif).
- Audit trail Settings (siapa ubah apa kapan).
- Versioning Settings + rollback.
- A/B variant Settings (mis. tagline A vs B).
