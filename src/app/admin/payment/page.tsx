"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  Landmark,
  Pencil,
  Plus,
  Smartphone,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Wallet,
  HandCoins,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { useAdminPaymentStore } from "@/stores/admin-payment-store";
import {
  PAYMENT_TYPE_LABEL,
  type PaymentMethod,
  type PaymentMethodType,
} from "@/types/payment-admin";

const TYPE_META: Record<
  PaymentMethodType,
  { icon: typeof CreditCard; tone: string }
> = {
  transfer: { icon: Landmark, tone: "border-navy text-navy" },
  ewallet: { icon: Smartphone, tone: "border-[#1a1a1a] text-[#1a1a1a]" },
  cc: { icon: CreditCard, tone: "border-[#2a2a2a] text-[#2a2a2a]" },
  cod: { icon: HandCoins, tone: "border-site-gray text-site-gray-dark" },
  paylater: { icon: Wallet, tone: "border-site-gray-dark text-site-gray-dark" },
};

function isUrl(s: string) {
  return /^https?:\/\//i.test(s);
}

export default function AdminPaymentPage() {
  const methods = useAdminPaymentStore((s) => s.methods);
  const toggleEnabled = useAdminPaymentStore((s) => s.toggleEnabled);
  const deleteMethod = useAdminPaymentStore((s) => s.deleteMethod);
  const moveUp = useAdminPaymentStore((s) => s.moveUp);
  const moveDown = useAdminPaymentStore((s) => s.moveDown);

  const [toDelete, setToDelete] = useState<PaymentMethod | null>(null);

  const sorted = useMemo(
    () => [...methods].sort((a, b) => a.order - b.order),
    [methods],
  );

  const activeCount = sorted.filter((m) => m.enabled).length;
  const transferAccounts = sorted.reduce(
    (acc, m) => acc + (m.bankAccounts?.length ?? 0),
    0,
  );

  const confirmDelete = () => {
    if (toDelete) deleteMethod(toDelete.id);
    setToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* ─── HEADER ─── */}
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3 text-[10px] tracking-[0.22em] uppercase text-site-gray">
            <span>Configuration</span>
            <span className="h-px w-6 bg-site-border" />
            <span className="font-mono normal-case tracking-tight">
              Ledger 01–{String(sorted.length).padStart(2, "0")}
            </span>
          </div>
          <h2 className="font-serif text-[34px] leading-tight mt-2 text-navy">
            Metode Pembayaran
          </h2>
          <p className="text-[13px] text-site-gray mt-1.5 max-w-xl leading-relaxed">
            Kanal pembayaran yang aktif di checkout. Atur ulang urutan untuk
            memprioritaskan saluran tertentu, atau nonaktifkan sementara saat
            audit/maintenance.
          </p>
        </div>

        <Link href="/admin/payment/new">
          <Button variant="primary" className="flex items-center gap-2">
            <Plus size={15} strokeWidth={2} />
            Tambah Metode
          </Button>
        </Link>
      </header>

      {/* ─── INSIGHT STRIP ─── */}
      <div className="grid grid-cols-3 bg-white border border-site-border">
        {[
          { k: "Total Metode", v: sorted.length },
          { k: "Aktif di Checkout", v: activeCount },
          { k: "Rekening Bank", v: transferAccounts },
        ].map((s, i) => (
          <div
            key={s.k}
            className={`px-6 py-5 ${i > 0 ? "border-l border-site-border" : ""}`}
          >
            <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray">
              {s.k}
            </div>
            <div className="font-serif text-[34px] leading-none mt-2 text-navy tabular-nums">
              {String(s.v).padStart(2, "0")}
            </div>
          </div>
        ))}
      </div>

      {/* ─── EDITORIAL LEDGER ─── */}
      <div className="bg-white border border-site-border">
        <div className="grid grid-cols-[60px_72px_1fr_140px_120px_88px] items-center gap-5 px-6 py-3 bg-cream border-b border-site-border text-[10px] font-semibold tracking-[0.16em] uppercase text-site-gray">
          <span>No.</span>
          <span>Mark</span>
          <span>Metode</span>
          <span>Tipe</span>
          <span>Status</span>
          <span className="text-right">Aksi</span>
        </div>

        {sorted.length === 0 && (
          <div className="px-6 py-16 text-center">
            <div className="font-serif italic text-[22px] text-site-gray-light mb-1">
              No methods on the ledger.
            </div>
            <p className="text-[13px] text-site-gray mb-5">
              Tambahkan setidaknya satu metode pembayaran agar checkout dapat
              digunakan.
            </p>
            <Link href="/admin/payment/new">
              <Button variant="primary" size="sm">
                + Tambah Metode
              </Button>
            </Link>
          </div>
        )}

        {sorted.map((m, i) => {
          const Type = TYPE_META[m.type];
          const TypeIcon = Type.icon;
          const isFirst = i === 0;
          const isLast = i === sorted.length - 1;

          return (
            <div
              key={m.id}
              className="group grid grid-cols-[60px_72px_1fr_140px_120px_88px] items-center gap-5 px-6 py-5 border-b border-site-border last:border-b-0 hover:bg-cream/40 transition-colors"
            >
              {/* No. + arrows */}
              <div className="flex items-center gap-1.5">
                <div className="flex flex-col text-site-gray-light">
                  <button
                    type="button"
                    onClick={() => moveUp(m.id)}
                    disabled={isFirst}
                    aria-label="Naikkan urutan"
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-navy disabled:hover:text-site-gray-light disabled:cursor-not-allowed leading-none"
                  >
                    <ChevronUp size={13} strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(m.id)}
                    disabled={isLast}
                    aria-label="Turunkan urutan"
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-navy disabled:hover:text-site-gray-light disabled:cursor-not-allowed leading-none"
                  >
                    <ChevronDown size={13} strokeWidth={2} />
                  </button>
                </div>
                <span className="font-serif italic text-[28px] leading-none tabular-nums text-site-gray-light">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Mark (icon stamp) */}
              <div className="relative w-[56px] h-[56px] bg-cream border border-site-border flex items-center justify-center overflow-hidden">
                {isUrl(m.icon) ? (
                  <Image
                    src={m.icon}
                    alt={m.label}
                    fill
                    sizes="56px"
                    className="object-contain p-2"
                    unoptimized
                  />
                ) : (
                  <span className="text-[26px] leading-none select-none">
                    {m.icon}
                  </span>
                )}
              </div>

              {/* Label */}
              <div className="min-w-0">
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <h3 className="font-serif text-[19px] leading-tight text-navy">
                    {m.label}
                  </h3>
                  <span className="font-mono text-[11px] text-site-gray tracking-tight">
                    /{m.id}
                  </span>
                </div>
                <p className="text-[12.5px] text-site-gray mt-1 leading-snug line-clamp-1">
                  {m.description}
                </p>
                {m.type === "transfer" && (
                  <div className="mt-2 flex items-center gap-1.5 text-[10.5px] tracking-[0.14em] uppercase text-site-gray-dark">
                    <span className="inline-block w-1 h-1 rounded-full bg-navy" />
                    <span>
                      {(m.bankAccounts?.length ?? 0).toString().padStart(2, "0")}{" "}
                      rekening
                    </span>
                  </div>
                )}
              </div>

              {/* Type chip */}
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-1 border-[1.5px] ${Type.tone} text-[10px] tracking-[0.14em] uppercase font-medium`}
                >
                  <TypeIcon size={11} strokeWidth={2} />
                  {PAYMENT_TYPE_LABEL[m.type]}
                </span>
              </div>

              {/* Status toggle */}
              <button
                type="button"
                onClick={() => toggleEnabled(m.id)}
                aria-pressed={m.enabled}
                className="flex items-center gap-2"
              >
                {m.enabled ? (
                  <ToggleRight size={28} strokeWidth={1.5} className="text-navy" />
                ) : (
                  <ToggleLeft size={28} strokeWidth={1.5} className="text-site-gray-light" />
                )}
                <span
                  className={`text-[10.5px] tracking-[0.14em] uppercase ${
                    m.enabled ? "text-site-text font-medium" : "text-site-gray"
                  }`}
                >
                  {m.enabled ? "Live" : "Off"}
                </span>
              </button>

              {/* Actions */}
              <div className="flex items-center justify-end gap-1">
                <Link
                  href={`/admin/payment/${m.id}/edit`}
                  aria-label={`Edit ${m.label}`}
                  className="p-2 text-navy hover:bg-cream rounded-sm"
                >
                  <Pencil size={15} strokeWidth={1.8} />
                </Link>
                <button
                  type="button"
                  onClick={() => setToDelete(m)}
                  aria-label={`Hapus ${m.label}`}
                  className="p-2 text-[#b91c1c] hover:bg-[#fee2e2] rounded-sm"
                >
                  <Trash2 size={15} strokeWidth={1.8} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── FOOTER NOTE ─── */}
      {sorted.length > 0 && (
        <div className="flex items-center justify-between gap-5 px-1 pt-2 text-[11px] text-site-gray">
          <div className="flex items-center gap-2 font-mono">
            <span className="inline-block w-2 h-2 rounded-full bg-navy/40" />
            Hover baris untuk mengubah urutan.
          </div>
          <div className="font-mono tracking-tight">
            EOF · {String(sorted.length).padStart(2, "0")} entri
          </div>
        </div>
      )}

      <ConfirmModal
        open={toDelete !== null}
        title="Hapus Metode Pembayaran"
        message={`Yakin ingin menghapus "${toDelete?.label}"? Pelanggan tidak akan bisa memilih metode ini lagi.`}
        confirmLabel="Hapus"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
