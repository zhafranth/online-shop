# PRD — Dashboard: Admin Users & Roles

| Status   | Draft v1.0                                          |
| -------- | --------------------------------------------------- |
| Owner    | Admin (Owner / Super Admin)                         |
| Priority | P2 (Medium)                                         |
| Tanggal  | 2026-05-15                                          |

---

## 1. Ringkasan

Menambahkan menu **Admins** di dashboard untuk mengelola multiple admin user dengan **role-based access control (RBAC)** sederhana. Saat ini hanya ada 1 akun admin hardcoded di `src/lib/admin-seeds.ts:3` — tidak ada cara menambah staff lain atau membatasi akses per modul.

## 2. Latar Belakang

- `ADMIN_CREDENTIALS` di `admin-seeds.ts` berisi satu akun: `admin@thickapparel.com / admin123`.
- `useAdminAuthStore` (`src/stores/admin-auth-store.ts`) menyimpan flag login admin (1 user implicit).
- `AdminGuard` (`src/components/admin/admin-guard.tsx`) hanya cek `isAuthenticated`, tidak ada cek per modul.
- Bila tim membesar (content editor, finance, operations), butuh akun terpisah dengan permission berbeda.

**Catatan keamanan**: ini tetap prototype frontend-only. Password di-hash sederhana (atau plaintext) di localStorage — **tidak untuk produksi**. PRD ini menyiapkan struktur agar mudah migrasi ke real auth nantinya.

## 3. Pengguna & Use Case

| Peran          | Kebutuhan                                                                |
| -------------- | ------------------------------------------------------------------------ |
| Owner (Super)  | Tambah/hapus admin lain, atur role, reset password.                      |
| Admin staff    | Login dengan akun sendiri, akses modul sesuai role.                      |
| Owner          | Audit aktivitas (lihat siapa pernah login terakhir kapan).               |

### User Stories

1. Sebagai owner, saya ingin menambah akun untuk Anita (Content Editor) dengan akses hanya ke Magazine + Home Content.
2. Sebagai owner, saya ingin reset password admin yang lupa.
3. Sebagai owner, saya ingin menonaktifkan akun staff yang sudah resign tanpa menghapus history.
4. Sebagai admin staff, saya ingin mengubah password saya sendiri di halaman profile.
5. Sebagai owner, saya ingin melihat tanggal terakhir setiap admin login.

## 4. Scope

### In Scope
- Halaman list admin `/admin/admins`.
- Halaman create / edit `/admin/admins/new`, `/admin/admins/[id]/edit`.
- Profile sendiri `/admin/profile` (ubah nama, password).
- Role fixed (predefined): `super_admin`, `content_editor`, `merchandiser`, `operations`, `finance`.
- Permission matrix per role (lihat 5.4).
- Mekanisme hash password sederhana (mis. `bcryptjs` atau base64 obfuscation untuk prototype) + disclaimer.
- Status akun: `active` / `disabled`.
- `lastLoginAt` tracking.

### Out of Scope
- Custom roles / custom permission matrix (role fixed).
- 2FA / OTP.
- SSO (Google, GitHub).
- Permission per-row (object-level).
- Forgot password flow via email (no SMTP).
- Session management (multi-device logout).
- Audit trail aktivitas (siapa ubah apa) — masuk Future.

## 5. Functional Requirements

### 5.1 List Admin — `/admin/admins`

- Hanya `super_admin` boleh akses; admin lain → 403 atau redirect.
- Tabel kolom: Avatar, Nama, Email, Role (Badge), Status, Last Login, Aksi (Edit / Reset Password / Disable / Hapus).
- Tombol **+ Tambah Admin**.
- Filter role & status.

### 5.2 Create / Edit Admin

| Field        | Type     | Validasi                                  |
| ------------ | -------- | ----------------------------------------- |
| Nama         | string   | 2–60 karakter                             |
| Email        | string   | format email, unique                      |
| Role         | select   | salah satu predefined role                |
| Password     | password | min 8 char, alphanumeric (saat create)    |
| Status       | radio    | `active` / `disabled` (default active)    |

Edit mode: password optional (kosongkan untuk tidak ubah).

### 5.3 Profile Sendiri — `/admin/profile`

- Field: Nama, Email (read-only), Current Password, New Password, Confirm Password.
- Tombol **Simpan**.

### 5.4 Permission Matrix

| Modul / Aksi      | super_admin | content_editor | merchandiser | operations | finance |
| ----------------- | ----------- | -------------- | ------------ | ---------- | ------- |
| Dashboard         | ✅          | ✅              | ✅            | ✅          | ✅       |
| Products          | ✅          | —              | ✅            | —          | —       |
| Categories        | ✅          | —              | ✅            | —          | —       |
| Orders            | ✅          | —              | —            | ✅          | ✅       |
| Users (customer)  | ✅          | —              | —            | ✅          | ✅       |
| Magazine          | ✅          | ✅              | —            | —          | —       |
| Membership        | ✅          | ✅              | —            | —          | —       |
| Home Content      | ✅          | ✅              | —            | —          | —       |
| Size Guide        | ✅          | —              | ✅            | —          | —       |
| Promo             | ✅          | —              | ✅            | —          | —       |
| Shipping          | ✅          | —              | —            | ✅          | —       |
| Payment           | ✅          | —              | —            | —          | ✅       |
| Settings          | ✅          | —              | —            | —          | —       |
| Admins            | ✅          | —              | —            | —          | —       |

Permission disimpan sebagai const di kode (`src/lib/rbac.ts`); tidak editable via UI di MVP.

### 5.5 Login Update

- Halaman `/admin/login` validasi email + password terhadap **store admin** (bukan konstanta hardcoded).
- Jika status `disabled` → tampilkan pesan error.
- Set `lastLoginAt` ke ISO saat login berhasil.
- `useAdminAuthStore` simpan: id admin, nama, role.

### 5.6 Sidebar Filter

- `admin-sidebar.tsx` ambil daftar menu dari config + filter berdasarkan role current admin.
- Item tidak terlihat = tidak bisa akses (juga divalidasi server / di guard halaman).

### 5.7 Page Guard per Modul

- Tambahkan helper `canAccess(role, module)` di `src/lib/rbac.ts`.
- Setiap layout/page admin di-check; jika tidak boleh → redirect ke `/admin/dashboard` atau tampilkan empty state "Tidak ada akses".

## 6. Data Model

### Type baru — `src/types/admin-user.ts`

```ts
export type AdminRole =
  | "super_admin"
  | "content_editor"
  | "merchandiser"
  | "operations"
  | "finance";

export type AdminStatus = "active" | "disabled";

export interface AdminUserAccount {
  id: string;                  // UUID
  name: string;
  email: string;
  passwordHash: string;        // bcrypt atau base64 obfuscated (prototype)
  role: AdminRole;
  status: AdminStatus;
  lastLoginAt?: string;        // ISO
  createdAt: string;
  createdBy?: string;          // id admin pembuat
}
```

### Store update — `src/stores/admin-auth-store.ts`

Sebelum: cuma menyimpan `isAuthenticated`.
Sesudah:
```ts
interface AdminAuthStore {
  currentAdmin: { id: string; name: string; email: string; role: AdminRole } | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  changePassword: (currentPwd: string, newPwd: string) => Promise<boolean>;
}
```

### Store baru — `src/stores/admin-users-store.ts`

```ts
interface AdminUsersStore {
  admins: AdminUserAccount[];
  addAdmin: (admin: Omit<AdminUserAccount, "id" | "createdAt">, plainPassword: string) => void;
  updateAdmin: (id: string, patch: Partial<AdminUserAccount>) => void;
  resetPassword: (id: string, newPlainPassword: string) => void;
  toggleStatus: (id: string) => void;
  deleteAdmin: (id: string) => void;
  findByEmail: (email: string) => AdminUserAccount | undefined;
  verifyPassword: (email: string, plainPassword: string) => boolean;
  setLastLogin: (id: string, iso: string) => void;
}
```

- Persist key: `thickapparel-admin-users` & `thickapparel-admin-auth`.
- Seed initial: 1 super_admin dari `ADMIN_CREDENTIALS` (`admin@thickapparel.com / admin123`).

## 7. UX & Pola Desain

- Sidebar group **People** → item **Admins** (icon `Shield` atau `UserCog`) — hanya tampil untuk super_admin.
- Avatar default: inisial di bg color.
- Role badge dengan warna berbeda per role.
- Reset password: modal dengan generate password random + tombol Copy.

## 8. Acceptance Criteria

- [ ] Menu Admins muncul di sidebar HANYA untuk super_admin.
- [ ] Super admin bisa CRUD admin lain.
- [ ] Login dengan akun baru berhasil + `lastLoginAt` terupdate.
- [ ] Login dengan akun disabled → error message.
- [ ] Permission filter sidebar berfungsi (content_editor hanya lihat Magazine, Membership, Home Content).
- [ ] Akses langsung URL modul tanpa permission → redirect / blocked.
- [ ] Super admin tidak bisa menghapus dirinya sendiri (validasi).
- [ ] Minimal harus ada 1 super_admin aktif (validasi sebelum delete / disable).
- [ ] Profile sendiri bisa ubah password.
- [ ] Reload persist; tetap login bila session valid.

## 9. Technical Notes

- File baru:
  - `src/types/admin-user.ts`
  - `src/stores/admin-users-store.ts`
  - `src/lib/rbac.ts` — permission matrix + `canAccess()` helper.
  - `src/app/admin/admins/page.tsx`, `.../new/page.tsx`, `.../[id]/edit/page.tsx`
  - `src/app/admin/profile/page.tsx`
  - `src/components/admin/admin-user-form.tsx`
- File diubah:
  - `src/stores/admin-auth-store.ts` — store user current + login real.
  - `src/components/admin/admin-guard.tsx` — pakai `currentAdmin` dan check role per route.
  - `src/components/admin/admin-sidebar.tsx` — filter NAV_ITEMS berdasarkan role.
  - `src/app/admin/login/page.tsx` — pakai `login()` dari store.
- Password: pakai `bcryptjs` (paket ringan, browser-friendly). Disclaimer: tetap tidak aman karena hash di-storage; hanya prototype.
- Default seed bila localStorage kosong: 1 super_admin (`admin@thickapparel.com`, password `admin123`).

## 10. Dependencies & Risks

- **Breaking auth flow**: existing user yang sudah login dengan store lama bisa tertendang. Mitigasi: hard logout pada deploy + redirect ke login.
- **Password reset email**: tidak ada SMTP di prototype; super admin yang reset password user lain harus share manual.
- **Akun terkunci**: minimal 1 super_admin aktif harus selalu ada — validasi sebelum disable/delete agar tidak ada deadlock.
- **Migrasi ke real auth**: struktur store + RBAC sudah bersiap; saat backend siap, ganti `verifyPassword` ke API call.

## 11. Future Enhancements

- Custom roles (role builder + permission picker).
- 2FA / OTP via authenticator app.
- SSO (Google / GitHub OAuth).
- Audit trail (siapa ubah apa, kapan).
- Session management (lihat & revoke device aktif).
- Forgot password flow via email (memerlukan SMTP).
- Permission per-row (mis. content_editor A cuma boleh edit artikel kategori X).
- Activity log per admin (last 50 actions).
