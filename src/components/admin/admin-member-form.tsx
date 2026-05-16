"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Crown,
  Fingerprint,
  Mail,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminTeamStore } from "@/stores/admin-team-store";
import {
  ADMIN_ROLE_DESCRIPTION,
  ADMIN_ROLE_LABEL,
  ADMIN_STATUS_LABEL,
  monogram,
  type AdminMember,
  type AdminMemberStatus,
  type AdminRole,
} from "@/types/admin-team";

interface AdminMemberFormProps {
  mode: "create" | "edit";
  member?: AdminMember;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function nameToSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function AdminMemberForm({ mode, member }: AdminMemberFormProps) {
  const router = useRouter();
  const members = useAdminTeamStore((s) => s.members);
  const addMember = useAdminTeamStore((s) => s.addMember);
  const updateMember = useAdminTeamStore((s) => s.updateMember);

  const isEdit = mode === "edit" && member;
  const isOwnerLock = isEdit && member.role === "owner";

  const [name, setName] = useState(member?.name ?? "");
  const [email, setEmail] = useState(member?.email ?? "");
  const [role, setRole] = useState<AdminRole>(member?.role ?? "staff");
  const [status, setStatus] = useState<AdminMemberStatus>(
    member?.status ?? "invited",
  );
  const [twoFactor, setTwoFactor] = useState(member?.twoFactor ?? false);
  const [note, setNote] = useState(member?.note ?? "");
  const [error, setError] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedNote = note.trim();

    if (trimmedName.length < 2 || trimmedName.length > 60) {
      return setError("Nama harus 2–60 karakter.");
    }
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      return setError("Format email tidak valid.");
    }
    if (
      mode === "create" &&
      members.some((m) => m.email.toLowerCase() === trimmedEmail)
    ) {
      return setError(`Email "${trimmedEmail}" sudah terdaftar.`);
    }
    if (trimmedNote.length > 160) {
      return setError("Catatan maksimum 160 karakter.");
    }
    if (isOwnerLock && role !== "owner") {
      return setError("Peran Owner tidak dapat diturunkan dari halaman ini.");
    }

    const id =
      isEdit
        ? member!.id
        : (() => {
            let base = nameToSlug(trimmedName) || "anggota";
            let candidate = base;
            let i = 2;
            while (members.some((m) => m.id === candidate)) {
              candidate = `${base}-${i++}`;
            }
            return candidate;
          })();

    const payload: AdminMember = {
      id,
      name: trimmedName,
      email: trimmedEmail,
      role,
      status,
      lastActiveAt: member?.lastActiveAt ?? null,
      createdAt: member?.createdAt ?? new Date().toISOString(),
      twoFactor,
      note: trimmedNote,
    };

    if (mode === "create") addMember(payload);
    else if (member) updateMember(member.id, payload);

    router.push("/admin/admins");
  };

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6"
    >
      {/* ─── FORM COLUMN ─── */}
      <div className="bg-white border border-site-border">
        <div className="px-7 pt-7 pb-5 border-b border-site-border">
          <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray mb-1">
            {mode === "create" ? "Undangan Baru" : "Edit Anggota"}
          </div>
          <h3 className="font-serif text-[26px] leading-tight">
            {name || (isEdit ? member.name : "Anggota tanpa nama")}
          </h3>
        </div>

        <div className="px-7 py-7 space-y-7">
          {/* NAME + EMAIL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                Nama Lengkap
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Syifa Anindita"
                maxLength={60}
                className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-sans text-sm text-site-text outline-none focus:border-navy"
              />
              <div className="mt-1.5 flex justify-between text-[11px] text-site-gray">
                <span>Tampil di header dashboard.</span>
                <span className="tabular-nums">{name.length}/60</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                Email
                {isEdit && (
                  <span className="ml-1.5 normal-case tracking-normal font-normal text-site-gray-light">
                    (immutable)
                  </span>
                )}
              </label>
              <input
                type="email"
                value={email}
                disabled={!!isEdit}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="syifa@thickapparel.com"
                className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-mono text-[13px] tracking-tight text-site-text outline-none focus:border-navy disabled:bg-cream disabled:text-site-gray"
              />
              <p className="mt-1.5 text-[11px] text-site-gray">
                Login admin menggunakan alamat email ini.
              </p>
            </div>
          </div>

          {/* ROLE */}
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
              Peran
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {(["owner", "manager", "staff"] as AdminRole[]).map((r) => {
                const isActive = role === r;
                const isLocked = isOwnerLock && r !== "owner";
                const isOwnerOption = r === "owner";
                const disabled = isLocked || (!isOwnerLock && isOwnerOption);
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => !disabled && setRole(r)}
                    disabled={disabled}
                    className={`px-3.5 py-3 border-[1.5px] text-left transition-colors ${
                      isActive
                        ? "border-navy bg-navy/[0.03] text-navy"
                        : "border-site-border hover:border-site-gray text-site-text"
                    } ${disabled ? "opacity-60 cursor-not-allowed hover:border-site-border" : ""}`}
                    title={
                      !isOwnerLock && isOwnerOption
                        ? "Hanya satu Owner per akun. Hubungi support untuk memindahkan kepemilikan."
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-1.5">
                      {isOwnerOption && <Crown size={12} strokeWidth={1.8} />}
                      <span className="font-serif text-[15px] leading-tight">
                        {ADMIN_ROLE_LABEL[r]}
                      </span>
                    </div>
                    <div className="text-[10.5px] text-site-gray mt-1 tracking-tight leading-snug">
                      {ADMIN_ROLE_DESCRIPTION[r]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STATUS */}
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
              Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["active", "invited", "suspended"] as AdminMemberStatus[]).map(
                (s) => {
                  const isActive = status === s;
                  const lock = isOwnerLock && s !== "active";
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => !lock && setStatus(s)}
                      disabled={lock}
                      className={`px-3 py-2.5 border-[1.5px] text-[12px] tracking-tight transition-colors ${
                        isActive
                          ? "border-navy bg-navy/[0.03] text-navy font-medium"
                          : "border-site-border hover:border-site-gray text-site-text"
                      } ${lock ? "opacity-60 cursor-not-allowed hover:border-site-border" : ""}`}
                      title={
                        lock
                          ? "Owner harus selalu berstatus Aktif."
                          : undefined
                      }
                    >
                      {ADMIN_STATUS_LABEL[s]}
                    </button>
                  );
                },
              )}
            </div>
            <p className="mt-1.5 text-[11px] text-site-gray">
              <em>Diundang</em> belum bisa login hingga undangan dikonfirmasi.
            </p>
          </div>

          {/* 2FA */}
          <div className="flex items-center justify-between pt-2 border-t border-dashed border-site-border">
            <div>
              <div className="text-[13px] font-medium text-site-text inline-flex items-center gap-2">
                {twoFactor ? (
                  <ShieldCheck size={14} strokeWidth={1.8} />
                ) : (
                  <ShieldOff size={14} strokeWidth={1.8} />
                )}
                Two-Factor Authentication
              </div>
              <div className="text-[11px] text-site-gray mt-0.5">
                Wajibkan kode otentikasi tambahan saat login admin.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setTwoFactor((v) => !v)}
              aria-pressed={twoFactor}
              className={`shrink-0 px-3 py-1.5 border-[1.5px] text-[10.5px] tracking-[0.14em] uppercase font-medium transition-colors ${
                twoFactor
                  ? "border-[#166534] text-[#166534] bg-[#f0fdf4]"
                  : "border-site-border text-site-gray hover:text-site-text"
              }`}
            >
              {twoFactor ? "Wajib" : "Off"}
            </button>
          </div>

          {/* NOTE */}
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
              Catatan Internal
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Tanggung jawab, jam kerja, atau konteks lain — hanya admin yang dapat melihat."
              maxLength={160}
              rows={2}
              className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-sans text-sm text-site-text outline-none focus:border-navy resize-none"
            />
            <div className="mt-1.5 flex justify-end text-[11px] text-site-gray">
              <span className="tabular-nums">{note.length}/160</span>
            </div>
          </div>

          {error && (
            <div className="px-3.5 py-2.5 text-[13px] bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="submit">
              {mode === "create" ? "Kirim Undangan" : "Simpan Perubahan"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/admins")}
            >
              Batal
            </Button>
          </div>
        </div>
      </div>

      {/* ─── PREVIEW COLUMN: ID Card ─── */}
      <aside className="space-y-4 lg:sticky lg:top-8 self-start">
        <div className="bg-[#0e0e10] text-white p-5 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/[0.02]" />
          <div className="absolute bottom-3 right-4 text-white/10 select-none">
            <Fingerprint size={96} strokeWidth={1} />
          </div>
          <div className="relative">
            <div className="text-[10px] tracking-[0.22em] uppercase text-white/45 mb-1">
              Console Pass
            </div>
            <div className="font-serif text-[22px] leading-tight">
              ID Card Preview
            </div>
            <p className="text-[11.5px] text-white/55 mt-1.5 leading-relaxed">
              Tampilan kartu anggota di roster admin.
            </p>
          </div>
        </div>

        {/* ID CARD */}
        <div className="bg-white border-[1.5px] border-navy">
          <div className="aspect-[16/10] relative overflow-hidden bg-cream">
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, #0a0a0a 0 1px, transparent 1px 9px)",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-serif tracking-tight text-navy text-[112px] leading-none select-none">
                {monogram(name || (member?.name ?? "AT"))}
              </span>
            </div>
            <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-1 text-[9.5px] font-semibold tracking-[0.16em] uppercase bg-navy text-white">
              {role === "owner" && <Crown size={10} strokeWidth={2} />}
              {ADMIN_ROLE_LABEL[role]}
            </span>
            <span className="absolute bottom-3 right-3 font-mono text-[9.5px] tracking-[0.16em] uppercase text-site-gray bg-white/95 px-1.5 py-1 border border-site-border">
              {ADMIN_STATUS_LABEL[status]}
            </span>
          </div>
          <div className="px-5 py-4">
            <div className="font-serif text-[18px] leading-tight text-navy">
              {name || "Nama anggota"}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11.5px] text-site-gray font-mono tracking-tight">
              <Mail size={11} strokeWidth={1.8} />
              <span className="truncate">{email || "email@thickapparel.com"}</span>
            </div>
            <div className="mt-3 pt-3 border-t border-dashed border-site-border flex items-center justify-between text-[11px] text-site-gray">
              <span className="font-mono uppercase tracking-[0.12em]">
                2FA · {twoFactor ? "Aktif" : "Off"}
              </span>
              <span className="font-mono tabular-nums tracking-tight">
                /{nameToSlug(name) || "—"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-cream border border-site-border p-4 text-[11.5px] text-site-gray leading-relaxed">
          Undangan dikirim sebagai catatan internal — autentikasi nyata belum
          tersedia di prototipe ini.
        </div>
      </aside>
    </form>
  );
}
