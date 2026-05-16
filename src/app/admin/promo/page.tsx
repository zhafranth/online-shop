"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BadgePercent,
  CalendarRange,
  Pencil,
  Plus,
  Tag,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { useAdminPromoStore } from "@/stores/admin-promo-store";
import {
  PROMO_LIFECYCLE_LABEL,
  PROMO_TYPE_BADGE,
  formatPromoValue,
  getPromoLifecycle,
  type Promo,
  type PromoLifecycle,
} from "@/types/promo";
import { formatPrice } from "@/lib/utils";

type Filter = "all" | PromoLifecycle;

const LIFECYCLE_TONE: Record<PromoLifecycle, string> = {
  active: "border-[#166534] text-[#166534] bg-[#f0fdf4]",
  scheduled: "border-[#854d0e] text-[#854d0e] bg-[#fefce8]",
  expired: "border-[#525252] text-[#525252] bg-[#f5f5f5]",
  paused: "border-[#991b1b] text-[#991b1b] bg-[#fef2f2]",
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  });
}

export default function AdminPromoPage() {
  const promos = useAdminPromoStore((s) => s.promos);
  const toggleEnabled = useAdminPromoStore((s) => s.toggleEnabled);
  const deletePromo = useAdminPromoStore((s) => s.deletePromo);

  const [filter, setFilter] = useState<Filter>("all");
  const [toDelete, setToDelete] = useState<Promo | null>(null);

  const enriched = useMemo(
    () => promos.map((p) => ({ ...p, lifecycle: getPromoLifecycle(p) })),
    [promos],
  );

  const counts = useMemo(() => {
    const base: Record<PromoLifecycle, number> = {
      active: 0,
      scheduled: 0,
      expired: 0,
      paused: 0,
    };
    for (const p of enriched) base[p.lifecycle] += 1;
    return base;
  }, [enriched]);

  const filtered = useMemo(
    () =>
      filter === "all"
        ? enriched
        : enriched.filter((p) => p.lifecycle === filter),
    [enriched, filter],
  );

  const totalRedemptions = enriched.reduce((acc, p) => acc + p.usageCount, 0);

  return (
    <div className="space-y-6">
      {/* ─── HEADER ─── */}
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3 text-[10px] tracking-[0.22em] uppercase text-site-gray">
            <span>Sales</span>
            <span className="h-px w-6 bg-site-border" />
            <span className="font-mono normal-case tracking-tight">
              Ledger 01–{String(enriched.length).padStart(2, "0")}
            </span>
          </div>
          <h2 className="font-serif text-[34px] leading-tight mt-2 text-navy">
            Promo & Voucher
          </h2>
          <p className="text-[13px] text-site-gray mt-1.5 max-w-xl leading-relaxed">
            Kelola kode promo, periode kampanye, dan kuota pemakaian. Status
            dihitung otomatis dari tanggal mulai/berakhir — gunakan toggle untuk
            menjeda secara manual.
          </p>
        </div>

        <Link href="/admin/promo/new">
          <Button variant="primary" className="flex items-center gap-2">
            <Plus size={15} strokeWidth={2} />
            Tambah Promo
          </Button>
        </Link>
      </header>

      {/* ─── INSIGHT STRIP ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 bg-white border border-site-border">
        {[
          {
            k: "Total Promo",
            v: String(enriched.length).padStart(2, "0"),
          },
          {
            k: "Aktif",
            v: String(counts.active).padStart(2, "0"),
          },
          {
            k: "Terjadwal",
            v: String(counts.scheduled).padStart(2, "0"),
          },
          {
            k: "Total Penukaran",
            v: totalRedemptions.toLocaleString("id-ID"),
          },
        ].map((s, i) => (
          <div
            key={s.k}
            className={`px-6 py-5 ${i > 0 ? "md:border-l border-site-border" : ""}`}
          >
            <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray">
              {s.k}
            </div>
            <div className="font-serif text-[30px] leading-none mt-2 text-navy tabular-nums">
              {s.v}
            </div>
          </div>
        ))}
      </div>

      {/* ─── FILTER TABS ─── */}
      <div className="flex items-center gap-0 border-b border-site-border flex-wrap">
        {(
          [
            { id: "all" as Filter, label: "Semua", n: enriched.length },
            { id: "active" as Filter, label: "Aktif", n: counts.active },
            { id: "scheduled" as Filter, label: "Terjadwal", n: counts.scheduled },
            { id: "paused" as Filter, label: "Dijeda", n: counts.paused },
            { id: "expired" as Filter, label: "Berakhir", n: counts.expired },
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

      {/* ─── LEDGER ─── */}
      <div className="bg-white border border-site-border">
        <div className="hidden md:grid grid-cols-[64px_1fr_120px_180px_180px_120px_80px] items-center gap-5 px-6 py-3 bg-cream border-b border-site-border text-[10px] font-semibold tracking-[0.16em] uppercase text-site-gray">
          <span>No.</span>
          <span>Kode &amp; Label</span>
          <span>Tipe</span>
          <span>Periode</span>
          <span>Penukaran</span>
          <span>Status</span>
          <span className="text-right">Aksi</span>
        </div>

        {filtered.length === 0 && (
          <div className="px-6 py-16 text-center">
            <div className="font-serif italic text-[22px] text-site-gray-light mb-1">
              Tidak ada promo pada filter ini.
            </div>
            <p className="text-[13px] text-site-gray mb-5">
              Ubah filter atau tambah kampanye promo baru.
            </p>
            <Link href="/admin/promo/new">
              <Button variant="primary" size="sm">
                + Tambah Promo
              </Button>
            </Link>
          </div>
        )}

        {filtered.map((p, i) => {
          const usagePct =
            p.usageLimit && p.usageLimit > 0
              ? Math.min(100, Math.round((p.usageCount / p.usageLimit) * 100))
              : null;

          return (
            <div
              key={p.id}
              className="group grid grid-cols-1 md:grid-cols-[64px_1fr_120px_180px_180px_120px_80px] items-start md:items-center gap-3 md:gap-5 px-6 py-5 border-b border-site-border last:border-b-0 hover:bg-cream/40 transition-colors"
            >
              {/* No */}
              <div className="font-serif italic text-[28px] leading-none tabular-nums text-site-gray-light hidden md:block">
                {String(i + 1).padStart(2, "0")}
              </div>

              {/* Code + label */}
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 mb-1.5">
                  <span className="font-mono text-[12.5px] tracking-[0.08em] font-semibold text-navy bg-cream px-2 py-1 border border-site-border">
                    {p.code}
                  </span>
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-site-gray border border-site-border px-1.5 py-0.5">
                    {PROMO_TYPE_BADGE[p.type]}
                  </span>
                </div>
                <h3 className="font-serif text-[18px] leading-tight text-navy">
                  {p.label}
                </h3>
                <p className="text-[12px] text-site-gray mt-0.5 leading-snug line-clamp-1">
                  {p.description}
                </p>
              </div>

              {/* Type / value */}
              <div className="min-w-0">
                <div className="font-mono text-[13.5px] text-site-text tabular-nums">
                  {formatPromoValue(p)}
                </div>
                <div className="text-[11px] text-site-gray mt-0.5">
                  Min. {formatPrice(p.minPurchase)}
                </div>
              </div>

              {/* Period */}
              <div className="font-mono text-[12px] text-site-text tabular-nums leading-snug">
                <div className="flex items-center gap-1.5 text-site-gray text-[10px] tracking-[0.14em] uppercase mb-0.5">
                  <CalendarRange size={11} strokeWidth={1.8} />
                  <span>Periode</span>
                </div>
                <span>{fmtDate(p.startsAt)}</span>
                <span className="text-site-gray-light"> → </span>
                <span>{fmtDate(p.endsAt)}</span>
              </div>

              {/* Usage */}
              <div className="min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono text-[13.5px] text-site-text tabular-nums">
                    {p.usageCount.toLocaleString("id-ID")}
                  </span>
                  <span className="text-[11px] text-site-gray font-mono">
                    /{" "}
                    {p.usageLimit === null
                      ? "∞"
                      : p.usageLimit.toLocaleString("id-ID")}
                  </span>
                </div>
                {usagePct !== null ? (
                  <div className="mt-1.5 h-[3px] w-full bg-site-border/60 relative overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-navy"
                      style={{ width: `${usagePct}%` }}
                    />
                  </div>
                ) : (
                  <div className="mt-1.5 text-[10.5px] text-site-gray-light font-mono tracking-tight">
                    Tanpa batas
                  </div>
                )}
              </div>

              {/* Status */}
              <div>
                <span
                  className={`inline-flex items-center px-2 py-1 border-[1.5px] text-[10px] tracking-[0.14em] uppercase font-medium ${LIFECYCLE_TONE[p.lifecycle]}`}
                >
                  {PROMO_LIFECYCLE_LABEL[p.lifecycle]}
                </span>
                <button
                  type="button"
                  onClick={() => toggleEnabled(p.id)}
                  aria-pressed={p.enabled}
                  className="mt-1.5 flex items-center gap-1.5"
                  title={p.enabled ? "Jeda promo" : "Aktifkan promo"}
                >
                  {p.enabled ? (
                    <ToggleRight size={22} strokeWidth={1.5} className="text-navy" />
                  ) : (
                    <ToggleLeft size={22} strokeWidth={1.5} className="text-site-gray-light" />
                  )}
                  <span className="text-[10px] tracking-[0.14em] uppercase text-site-gray">
                    {p.enabled ? "On" : "Off"}
                  </span>
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-1">
                <Link
                  href={`/admin/promo/${p.id}/edit`}
                  aria-label={`Edit ${p.code}`}
                  className="p-2 text-navy hover:bg-cream rounded-sm"
                >
                  <Pencil size={15} strokeWidth={1.8} />
                </Link>
                <button
                  type="button"
                  onClick={() => setToDelete(p)}
                  aria-label={`Hapus ${p.code}`}
                  className="p-2 text-[#b91c1c] hover:bg-[#fee2e2] rounded-sm"
                >
                  <Trash2 size={15} strokeWidth={1.8} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length > 0 && (
        <div className="flex items-center justify-between gap-5 px-1 pt-2 text-[11px] text-site-gray">
          <div className="flex items-center gap-2 font-mono">
            <BadgePercent size={12} strokeWidth={1.8} />
            <span>
              Status <em>Berakhir</em> &amp; <em>Dijeda</em> tidak muncul di
              checkout.
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono tracking-tight">
            <Tag size={12} strokeWidth={1.8} />
            EOF · {String(filtered.length).padStart(2, "0")} entri
          </div>
        </div>
      )}

      <ConfirmModal
        open={toDelete !== null}
        title="Hapus Promo"
        message={`Yakin ingin menghapus kode "${toDelete?.code}"? Pelanggan tidak akan bisa menggunakan kode ini lagi.`}
        confirmLabel="Hapus"
        variant="danger"
        onConfirm={() => {
          if (toDelete) deletePromo(toDelete.id);
          setToDelete(null);
        }}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
