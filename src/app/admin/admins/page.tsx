"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Crown,
  KeyRound,
  Mail,
  Pencil,
  Plus,
  ShieldCheck,
  ShieldOff,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { useAdminTeamStore } from "@/stores/admin-team-store";
import { useAdminAuthStore } from "@/stores/admin-auth-store";
import {
  ADMIN_ROLE_LABEL,
  ADMIN_STATUS_LABEL,
  monogram,
  relativeFromNow,
  type AdminMember,
  type AdminMemberStatus,
  type AdminRole,
} from "@/types/admin-team";

type Filter = "all" | AdminMemberStatus;

const STATUS_TONE: Record<AdminMemberStatus, string> = {
  active: "border-[#166534] text-[#166534] bg-[#f0fdf4]",
  invited: "border-[#854d0e] text-[#854d0e] bg-[#fefce8]",
  suspended: "border-[#991b1b] text-[#991b1b] bg-[#fef2f2]",
};

const ROLE_TONE: Record<AdminRole, string> = {
  owner: "bg-navy text-white",
  manager: "bg-cream text-navy border border-site-border",
  staff: "bg-white text-site-gray-dark border border-site-border",
};

export default function AdminAdminsPage() {
  const members = useAdminTeamStore((s) => s.members);
  const setStatus = useAdminTeamStore((s) => s.setStatus);
  const deleteMember = useAdminTeamStore((s) => s.deleteMember);
  const currentEmail = useAdminAuthStore((s) => s.admin?.email);

  const [filter, setFilter] = useState<Filter>("all");
  const [toDelete, setToDelete] = useState<AdminMember | null>(null);

  const counts = useMemo(() => {
    const base: Record<AdminMemberStatus, number> = {
      active: 0,
      invited: 0,
      suspended: 0,
    };
    for (const m of members) base[m.status] += 1;
    return base;
  }, [members]);

  const roleCounts = useMemo(() => {
    const base: Record<AdminRole, number> = { owner: 0, manager: 0, staff: 0 };
    for (const m of members) base[m.role] += 1;
    return base;
  }, [members]);

  const maxRoleCount = Math.max(1, ...Object.values(roleCounts));

  const filtered = useMemo(
    () => (filter === "all" ? members : members.filter((m) => m.status === filter)),
    [members, filter],
  );

  return (
    <div className="space-y-6">
      {/* ─── HEADER ─── */}
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3 text-[10px] tracking-[0.22em] uppercase text-site-gray">
            <span>People</span>
            <span className="h-px w-6 bg-site-border" />
            <span className="font-mono normal-case tracking-tight">
              Roster 01–{String(members.length).padStart(2, "0")}
            </span>
          </div>
          <h2 className="font-serif text-[34px] leading-tight mt-2 text-navy">
            Tim Admin
          </h2>
          <p className="text-[13px] text-site-gray mt-1.5 max-w-xl leading-relaxed">
            Daftar admin yang memiliki akses ke konsol ThickApparel. Atur peran,
            tangguhkan akses, atau kirim ulang undangan tanpa meninggalkan
            halaman ini.
          </p>
        </div>

        <Link href="/admin/admins/new">
          <Button variant="primary" className="flex items-center gap-2">
            <Plus size={15} strokeWidth={2} />
            Undang Admin
          </Button>
        </Link>
      </header>

      {/* ─── INSIGHT STRIP ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_380px] bg-white border border-site-border">
        {[
          { k: "Total Anggota", v: String(members.length).padStart(2, "0") },
          { k: "Aktif", v: String(counts.active).padStart(2, "0") },
          { k: "Undangan Pending", v: String(counts.invited).padStart(2, "0") },
        ].map((s, i) => (
          <div
            key={s.k}
            className={`px-6 py-5 ${i > 0 ? "lg:border-l border-site-border" : ""}`}
          >
            <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray">
              {s.k}
            </div>
            <div className="font-serif text-[30px] leading-none mt-2 text-navy tabular-nums">
              {s.v}
            </div>
          </div>
        ))}

        {/* role distribution micro-chart */}
        <div className="px-6 py-5 lg:border-l border-site-border">
          <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray mb-3">
            Distribusi Peran
          </div>
          <div className="space-y-2">
            {(["owner", "manager", "staff"] as AdminRole[]).map((r) => {
              const n = roleCounts[r];
              const pct = (n / maxRoleCount) * 100;
              return (
                <div
                  key={r}
                  className="grid grid-cols-[64px_1fr_28px] items-center gap-3 text-[11px]"
                >
                  <span className="font-mono uppercase tracking-[0.12em] text-site-gray">
                    {ADMIN_ROLE_LABEL[r]}
                  </span>
                  <span className="h-[3px] bg-site-border/60 relative overflow-hidden">
                    <span
                      className="absolute inset-y-0 left-0 bg-navy"
                      style={{ width: `${pct}%` }}
                    />
                  </span>
                  <span className="font-mono text-site-text tabular-nums text-right">
                    {String(n).padStart(2, "0")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── FILTER TABS ─── */}
      <div className="flex items-center gap-0 border-b border-site-border flex-wrap">
        {(
          [
            { id: "all" as Filter, label: "Semua", n: members.length },
            { id: "active" as Filter, label: "Aktif", n: counts.active },
            { id: "invited" as Filter, label: "Diundang", n: counts.invited },
            { id: "suspended" as Filter, label: "Ditangguhkan", n: counts.suspended },
          ]
        ).map((t) => {
          const active = filter === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setFilter(t.id)}
              className={`relative inline-flex items-center gap-2 px-5 py-3 text-[12px] tracking-[0.12em] uppercase transition-colors ${
                active ? "text-navy" : "text-site-gray hover:text-site-text"
              }`}
            >
              <span>{t.label}</span>
              <span className="font-mono tabular-nums normal-case tracking-tight text-[10.5px] text-site-gray-light">
                {String(t.n).padStart(2, "0")}
              </span>
              {active && (
                <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-navy" />
              )}
            </button>
          );
        })}
      </div>

      {/* ─── ROSTER ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.length === 0 && (
          <div className="col-span-full bg-white border border-site-border px-6 py-16 text-center">
            <div className="font-serif italic text-[22px] text-site-gray-light mb-1">
              Tidak ada anggota pada filter ini.
            </div>
            <p className="text-[13px] text-site-gray mb-5">
              Ubah filter atau undang anggota baru.
            </p>
            <Link href="/admin/admins/new">
              <Button variant="primary" size="sm">
                + Undang Admin
              </Button>
            </Link>
          </div>
        )}

        {filtered.map((m) => {
          const isSelf = m.email === currentEmail;
          const isOwner = m.role === "owner";

          return (
            <article
              key={m.id}
              className="group bg-white border border-site-border flex flex-col"
            >
              {/* Header — monogram + role tag */}
              <div className="relative border-b border-site-border">
                {/* monogram block */}
                <div className="aspect-[16/9] relative overflow-hidden bg-cream">
                  {/* faint pattern */}
                  <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(45deg, #0a0a0a 0 1px, transparent 1px 9px)",
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className={`font-serif tracking-tight ${isOwner ? "text-navy" : "text-navy/85"} text-[120px] leading-none select-none`}
                    >
                      {monogram(m.name)}
                    </span>
                  </div>
                  {/* corner role chip */}
                  <span
                    className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-1 text-[9.5px] font-semibold tracking-[0.16em] uppercase ${ROLE_TONE[m.role]}`}
                  >
                    {isOwner && <Crown size={10} strokeWidth={2} />}
                    {ADMIN_ROLE_LABEL[m.role]}
                  </span>
                  {isSelf && (
                    <span className="absolute top-3 right-3 font-mono text-[9.5px] tracking-[0.16em] uppercase text-site-gray bg-white/95 px-1.5 py-1 border border-site-border">
                      You
                    </span>
                  )}
                  {/* status chip */}
                  <span
                    className={`absolute bottom-3 left-3 inline-flex items-center px-2 py-1 border-[1.5px] text-[9.5px] tracking-[0.14em] uppercase font-medium ${STATUS_TONE[m.status]}`}
                  >
                    {ADMIN_STATUS_LABEL[m.status]}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="px-5 py-5 flex-1 flex flex-col">
                <h3 className="font-serif text-[20px] leading-tight text-navy">
                  {m.name}
                </h3>
                <div className="mt-1.5 flex items-center gap-1.5 text-[12px] text-site-gray">
                  <Mail size={12} strokeWidth={1.8} />
                  <span className="truncate font-mono tracking-tight">
                    {m.email}
                  </span>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-y-2 text-[11.5px]">
                  <dt className="text-site-gray font-mono uppercase tracking-[0.12em] text-[9.5px]">
                    Aktivitas
                  </dt>
                  <dd className="text-site-text text-right font-mono tabular-nums">
                    {relativeFromNow(m.lastActiveAt)}
                  </dd>
                  <dt className="text-site-gray font-mono uppercase tracking-[0.12em] text-[9.5px]">
                    2FA
                  </dt>
                  <dd className="text-site-text text-right inline-flex items-center justify-end gap-1.5">
                    {m.twoFactor ? (
                      <>
                        <ShieldCheck size={12} strokeWidth={1.8} className="text-[#166534]" />
                        <span>Aktif</span>
                      </>
                    ) : (
                      <>
                        <ShieldOff size={12} strokeWidth={1.8} className="text-site-gray-light" />
                        <span className="text-site-gray">Off</span>
                      </>
                    )}
                  </dd>
                </dl>

                {m.note && (
                  <p className="mt-4 pt-3 border-t border-dashed border-site-border text-[12px] text-site-gray leading-relaxed line-clamp-2">
                    “{m.note}”
                  </p>
                )}

                <div className="mt-auto pt-5 flex items-center justify-between gap-2">
                  {m.status === "invited" ? (
                    <button
                      type="button"
                      onClick={() => setStatus(m.id, "active")}
                      className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.12em] uppercase text-navy hover:underline"
                    >
                      <KeyRound size={12} strokeWidth={1.8} />
                      Tandai aktif
                    </button>
                  ) : m.status === "suspended" ? (
                    <button
                      type="button"
                      onClick={() => setStatus(m.id, "active")}
                      className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.12em] uppercase text-navy hover:underline"
                    >
                      <ShieldCheck size={12} strokeWidth={1.8} />
                      Cabut suspend
                    </button>
                  ) : isOwner ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.12em] uppercase text-site-gray-light">
                      <Crown size={12} strokeWidth={1.8} />
                      Owner
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setStatus(m.id, "suspended")}
                      className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.12em] uppercase text-site-gray hover:text-[#991b1b]"
                    >
                      <ShieldOff size={12} strokeWidth={1.8} />
                      Tangguhkan
                    </button>
                  )}

                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/admins/${m.id}/edit`}
                      aria-label={`Edit ${m.name}`}
                      className="p-2 text-navy hover:bg-cream rounded-sm"
                    >
                      <Pencil size={14} strokeWidth={1.8} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setToDelete(m)}
                      disabled={isOwner || isSelf}
                      title={
                        isOwner
                          ? "Owner tidak dapat dihapus."
                          : isSelf
                            ? "Tidak dapat menghapus akun Anda sendiri."
                            : `Hapus ${m.name}`
                      }
                      aria-label={`Hapus ${m.name}`}
                      className="p-2 text-[#b91c1c] hover:bg-[#fee2e2] rounded-sm disabled:text-site-gray-light disabled:cursor-not-allowed disabled:hover:bg-transparent"
                    >
                      <Trash2 size={14} strokeWidth={1.8} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-5 px-1 pt-2 text-[11px] text-site-gray">
        <div className="flex items-center gap-2 font-mono">
          <Users size={12} strokeWidth={1.8} />
          <span>
            Owner dan akun Anda sendiri tidak dapat dihapus dari halaman ini.
          </span>
        </div>
        <div className="font-mono tracking-tight">
          EOF · {String(filtered.length).padStart(2, "0")} entri
        </div>
      </div>

      <ConfirmModal
        open={toDelete !== null}
        title="Hapus Admin"
        message={`Yakin ingin menghapus akses "${toDelete?.name}"? Tindakan ini langsung mencabut hak masuk ke konsol.`}
        confirmLabel="Hapus"
        variant="danger"
        onConfirm={() => {
          if (toDelete) deleteMember(toDelete.id);
          setToDelete(null);
        }}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
