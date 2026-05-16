"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BadgePercent,
  CalendarRange,
  Infinity as InfinityIcon,
  Scissors,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminPromoStore } from "@/stores/admin-promo-store";
import { useCategoryStore } from "@/stores/category-store";
import {
  PROMO_APPLICABILITY_LABEL,
  PROMO_TYPE_LABEL,
  formatPromoValue,
  type Promo,
  type PromoApplicability,
  type PromoType,
} from "@/types/promo";
import { formatPrice } from "@/lib/utils";

interface PromoFormProps {
  mode: "create" | "edit";
  promo?: Promo;
}

const CODE_PATTERN = /^[A-Z0-9](?:[A-Z0-9_-]*[A-Z0-9])?$/;
const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

function codeToSlug(s: string) {
  return s
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function isoToInput(iso: string) {
  // ISO -> "YYYY-MM-DDTHH:mm" (for datetime-local)
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function inputToIso(local: string) {
  if (!local) return "";
  const d = new Date(local);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString();
}

export function PromoForm({ mode, promo }: PromoFormProps) {
  const router = useRouter();
  const promos = useAdminPromoStore((s) => s.promos);
  const addPromo = useAdminPromoStore((s) => s.addPromo);
  const updatePromo = useAdminPromoStore((s) => s.updatePromo);
  const categories = useCategoryStore((s) => s.categories);

  const isEdit = mode === "edit" && promo;

  const [code, setCode] = useState(promo?.code ?? "");
  const [label, setLabel] = useState(promo?.label ?? "");
  const [description, setDescription] = useState(promo?.description ?? "");
  const [type, setType] = useState<PromoType>(promo?.type ?? "percent");
  const [value, setValue] = useState<number>(promo?.value ?? 10);
  const [maxDiscount, setMaxDiscount] = useState<number>(
    promo?.maxDiscount ?? 0,
  );
  const [hasCap, setHasCap] = useState<boolean>(
    promo ? promo.maxDiscount !== null : true,
  );
  const [minPurchase, setMinPurchase] = useState<number>(
    promo?.minPurchase ?? 250000,
  );
  const [startsAt, setStartsAt] = useState<string>(
    promo ? isoToInput(promo.startsAt) : isoToInput(new Date().toISOString()),
  );
  const [endsAt, setEndsAt] = useState<string>(
    promo
      ? isoToInput(promo.endsAt)
      : isoToInput(
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        ),
  );
  const [hasLimit, setHasLimit] = useState<boolean>(
    promo ? promo.usageLimit !== null : true,
  );
  const [usageLimit, setUsageLimit] = useState<number>(
    promo?.usageLimit ?? 500,
  );
  const [applicability, setApplicability] = useState<PromoApplicability>(
    promo?.applicability ?? "all",
  );
  const [categoryId, setCategoryId] = useState<string>(
    promo?.categoryId ?? categories[0]?.id ?? "",
  );
  const [enabled, setEnabled] = useState(promo?.enabled ?? true);
  const [error, setError] = useState("");

  const previewPromo: Promo = {
    id: promo?.id ?? (codeToSlug(code) || "preview"),
    code: code || "KODE",
    label: label || "Label promo",
    description: description || "Deskripsi promo akan tampil di sini.",
    type,
    value,
    maxDiscount: hasCap && type === "percent" ? maxDiscount : null,
    minPurchase,
    startsAt: inputToIso(startsAt) || new Date().toISOString(),
    endsAt: inputToIso(endsAt) || new Date().toISOString(),
    usageLimit: hasLimit ? usageLimit : null,
    usageCount: promo?.usageCount ?? 0,
    applicability,
    categoryId: applicability === "category" ? categoryId : null,
    enabled,
    createdAt: promo?.createdAt ?? new Date().toISOString(),
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedCode = code.trim().toUpperCase();
    const trimmedLabel = label.trim();
    const trimmedDescription = description.trim();
    const slug = codeToSlug(trimmedCode);

    if (!trimmedCode) return setError("Kode promo wajib diisi.");
    if (trimmedCode.length < 3 || trimmedCode.length > 20) {
      return setError("Kode harus 3–20 karakter.");
    }
    if (!CODE_PATTERN.test(trimmedCode)) {
      return setError(
        "Kode hanya boleh huruf besar, angka, dan tanda hubung/garis bawah.",
      );
    }
    if (!SLUG_PATTERN.test(slug)) {
      return setError("Kode menghasilkan slug tidak valid.");
    }
    if (mode === "create" && promos.some((p) => p.id === slug)) {
      return setError(`Kode "${trimmedCode}" sudah dipakai.`);
    }
    if (trimmedLabel.length < 3 || trimmedLabel.length > 60) {
      return setError("Label harus 3–60 karakter.");
    }
    if (trimmedDescription.length < 5 || trimmedDescription.length > 140) {
      return setError("Deskripsi harus 5–140 karakter.");
    }
    if (type === "percent") {
      if (!Number.isFinite(value) || value <= 0 || value > 90) {
        return setError("Persentase harus antara 1 dan 90.");
      }
      if (hasCap && (!Number.isFinite(maxDiscount) || maxDiscount <= 0)) {
        return setError("Maksimum potongan harus > 0 atau matikan batas.");
      }
    } else if (type === "fixed") {
      if (!Number.isFinite(value) || value <= 0) {
        return setError("Nominal potongan harus > 0.");
      }
    }
    if (!Number.isFinite(minPurchase) || minPurchase < 0) {
      return setError("Minimum belanja tidak valid.");
    }
    const startIso = inputToIso(startsAt);
    const endIso = inputToIso(endsAt);
    if (!startIso) return setError("Tanggal mulai wajib diisi.");
    if (!endIso) return setError("Tanggal berakhir wajib diisi.");
    if (new Date(endIso).getTime() <= new Date(startIso).getTime()) {
      return setError("Tanggal berakhir harus setelah tanggal mulai.");
    }
    if (hasLimit && (!Number.isInteger(usageLimit) || usageLimit <= 0)) {
      return setError("Kuota pemakaian harus bilangan bulat > 0.");
    }
    if (applicability === "category" && !categoryId) {
      return setError("Pilih kategori untuk promo kategori tertentu.");
    }

    const payload: Promo = {
      id: isEdit ? promo!.id : slug,
      code: trimmedCode,
      label: trimmedLabel,
      description: trimmedDescription,
      type,
      value: type === "shipping" ? 0 : value,
      maxDiscount: type === "percent" && hasCap ? maxDiscount : null,
      minPurchase,
      startsAt: startIso,
      endsAt: endIso,
      usageLimit: hasLimit ? usageLimit : null,
      usageCount: promo?.usageCount ?? 0,
      applicability,
      categoryId: applicability === "category" ? categoryId : null,
      enabled,
      createdAt: promo?.createdAt ?? new Date().toISOString(),
    };

    if (mode === "create") addPromo(payload);
    else if (promo) updatePromo(promo.id, payload);

    router.push("/admin/promo");
  };

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6"
    >
      {/* ─── FORM COLUMN ─── */}
      <div className="bg-white border border-site-border">
        <div className="px-7 pt-7 pb-5 border-b border-site-border">
          <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray mb-1">
            {mode === "create" ? "Promo Baru" : "Edit Promo"}
          </div>
          <h3 className="font-serif text-[26px] leading-tight">
            {label || (isEdit ? promo.label : "Promo tanpa nama")}
          </h3>
        </div>

        <div className="px-7 py-7 space-y-7">
          {/* CODE + LABEL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                Kode Promo
                {isEdit && (
                  <span className="ml-1.5 normal-case tracking-normal font-normal text-site-gray-light">
                    (immutable)
                  </span>
                )}
              </label>
              <input
                value={code}
                disabled={!!isEdit}
                onChange={(e) =>
                  setCode(e.target.value.toUpperCase().replace(/\s/g, ""))
                }
                placeholder="WELCOME10"
                maxLength={20}
                className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-mono text-[13px] tracking-[0.08em] font-semibold text-navy outline-none focus:border-navy disabled:bg-cream disabled:text-site-gray"
              />
              <p className="mt-1.5 text-[11px] text-site-gray leading-relaxed">
                Huruf besar, angka, garis hubung. Tampil di checkout.
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                Label Promo
              </label>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Diskon Selamat Datang"
                maxLength={60}
                className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-sans text-sm text-site-text outline-none focus:border-navy"
              />
              <div className="mt-1.5 flex justify-between text-[11px] text-site-gray">
                <span>3–60 karakter</span>
                <span className="tabular-nums">{label.length}/60</span>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
              Deskripsi
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Potongan 10% untuk pelanggan baru, berlaku untuk seluruh koleksi."
              maxLength={140}
              rows={2}
              className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-sans text-sm text-site-text outline-none focus:border-navy resize-none"
            />
            <div className="mt-1.5 flex justify-between text-[11px] text-site-gray">
              <span>5–140 karakter — muncul di kartu promo.</span>
              <span className="tabular-nums">{description.length}/140</span>
            </div>
          </div>

          {/* TYPE picker */}
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
              Tipe Promo
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["percent", "fixed", "shipping"] as PromoType[]).map((t) => {
                const isActive = type === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`px-3.5 py-3 border-[1.5px] text-left transition-colors ${
                      isActive
                        ? "border-navy bg-navy/[0.03] text-navy"
                        : "border-site-border hover:border-site-gray text-site-text"
                    }`}
                  >
                    <div className="font-serif text-[15px] leading-tight">
                      {PROMO_TYPE_LABEL[t]}
                    </div>
                    <div className="text-[10.5px] text-site-gray mt-0.5 tracking-tight">
                      {t === "percent" && "Diskon dalam %"}
                      {t === "fixed" && "Potongan rupiah"}
                      {t === "shipping" && "Bebas ongkir"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* VALUE + CAP / SHIPPING note */}
          {type === "shipping" ? (
            <div className="px-3.5 py-3 border border-dashed border-site-border bg-cream/60 text-[12.5px] text-site-gray leading-relaxed">
              Tipe <em>Gratis Ongkir</em> akan menutupi seluruh biaya pengiriman
              di checkout. Atur minimum belanja di bawah agar kuota tetap
              terkontrol.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                  {type === "percent" ? "Persentase" : "Nominal Potongan"}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[12px] font-mono text-site-gray-light pointer-events-none">
                    {type === "percent" ? "%" : "Rp"}
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={type === "percent" ? 90 : undefined}
                    step={type === "percent" ? 1 : 1000}
                    value={value || ""}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full pl-9 pr-3.5 py-3 border-[1.5px] border-site-border bg-white font-mono text-[13px] tracking-tight text-site-text outline-none focus:border-navy"
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-site-gray leading-relaxed">
                  {type === "percent"
                    ? "1–90% dari subtotal."
                    : "Potongan rupiah dari subtotal."}
                </p>
              </div>

              {type === "percent" && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase">
                      Maksimum Potongan
                    </label>
                    <label className="inline-flex items-center gap-1.5 text-[11px] text-site-gray cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasCap}
                        onChange={(e) => setHasCap(e.target.checked)}
                        className="accent-[#0a0a0a]"
                      />
                      Pakai batas
                    </label>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[12px] font-mono text-site-gray-light pointer-events-none">
                      Rp
                    </span>
                    <input
                      type="number"
                      min={0}
                      step={1000}
                      disabled={!hasCap}
                      value={hasCap ? maxDiscount || "" : ""}
                      onChange={(e) => setMaxDiscount(Number(e.target.value))}
                      placeholder={hasCap ? "100000" : "Tanpa batas"}
                      className="w-full pl-9 pr-3.5 py-3 border-[1.5px] border-site-border bg-white font-mono text-[13px] tracking-tight text-site-text outline-none focus:border-navy disabled:bg-cream disabled:text-site-gray-light"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MIN PURCHASE */}
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
              Minimum Belanja
            </label>
            <div className="relative max-w-[260px]">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[12px] font-mono text-site-gray-light pointer-events-none">
                Rp
              </span>
              <input
                type="number"
                min={0}
                step={10000}
                value={minPurchase}
                onChange={(e) => setMinPurchase(Number(e.target.value))}
                className="w-full pl-9 pr-3.5 py-3 border-[1.5px] border-site-border bg-white font-mono text-[13px] tracking-tight text-site-text outline-none focus:border-navy"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-site-gray">
              Subtotal pelanggan harus mencapai jumlah ini agar promo dapat
              dipakai.
            </p>
          </div>

          {/* PERIOD */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                Mulai
              </label>
              <input
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-mono text-[12.5px] tracking-tight text-site-text outline-none focus:border-navy"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                Berakhir
              </label>
              <input
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-mono text-[12.5px] tracking-tight text-site-text outline-none focus:border-navy"
              />
            </div>
          </div>

          {/* QUOTA */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase">
                Kuota Pemakaian
              </label>
              <label className="inline-flex items-center gap-1.5 text-[11px] text-site-gray cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasLimit}
                  onChange={(e) => setHasLimit(e.target.checked)}
                  className="accent-[#0a0a0a]"
                />
                Batasi
              </label>
            </div>
            <div className="max-w-[260px]">
              <input
                type="number"
                min={1}
                step={50}
                disabled={!hasLimit}
                value={hasLimit ? usageLimit || "" : ""}
                onChange={(e) => setUsageLimit(Number(e.target.value))}
                placeholder={hasLimit ? "500" : "Tanpa batas"}
                className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-mono text-[13px] tracking-tight text-site-text outline-none focus:border-navy disabled:bg-cream disabled:text-site-gray-light"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-site-gray flex items-center gap-1.5">
              {!hasLimit && <InfinityIcon size={11} strokeWidth={2} />}
              {hasLimit
                ? "Promo otomatis berakhir saat kuota tercapai."
                : "Tidak ada batas — pakai dengan hati-hati."}
            </p>
          </div>

          {/* APPLICABILITY */}
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
              Berlaku Untuk
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["all", "category", "first-order"] as PromoApplicability[]).map(
                (a) => {
                  const isActive = applicability === a;
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setApplicability(a)}
                      className={`px-3 py-2.5 border-[1.5px] text-[12px] tracking-tight transition-colors ${
                        isActive
                          ? "border-navy bg-navy/[0.03] text-navy font-medium"
                          : "border-site-border hover:border-site-gray text-site-text"
                      }`}
                    >
                      {PROMO_APPLICABILITY_LABEL[a]}
                    </button>
                  );
                },
              )}
            </div>
            {applicability === "category" && (
              <div className="mt-3 max-w-[260px]">
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-sans text-sm text-site-text outline-none focus:border-navy"
                >
                  {categories.length === 0 && <option value="">— Pilih —</option>}
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* ENABLED */}
          <div className="flex items-center justify-between pt-2 border-t border-dashed border-site-border">
            <div>
              <div className="text-[13px] font-medium text-site-text">
                Status Aktif
              </div>
              <div className="text-[11px] text-site-gray mt-0.5">
                Saat dijeda, promo tidak dapat dipakai meski masih dalam periode.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEnabled((v) => !v)}
              className="shrink-0 flex items-center gap-2 text-site-text"
              aria-pressed={enabled}
            >
              {enabled ? (
                <ToggleRight size={32} strokeWidth={1.5} className="text-navy" />
              ) : (
                <ToggleLeft size={32} strokeWidth={1.5} className="text-site-gray-light" />
              )}
              <span className="text-[11px] tracking-[0.12em] uppercase text-site-gray w-12">
                {enabled ? "Live" : "Off"}
              </span>
            </button>
          </div>

          {error && (
            <div className="px-3.5 py-2.5 text-[13px] bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="submit">
              {mode === "create" ? "Tambah Promo" : "Simpan Perubahan"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/promo")}
            >
              Batal
            </Button>
          </div>
        </div>
      </div>

      {/* ─── PREVIEW COLUMN: ticket stub ─── */}
      <aside className="space-y-4 lg:sticky lg:top-8 self-start">
        <div className="bg-[#0e0e10] text-white p-5 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/[0.02]" />
          <div className="absolute bottom-3 right-4 text-white/10 select-none">
            <BadgePercent size={96} strokeWidth={1} />
          </div>
          <div className="relative">
            <div className="text-[10px] tracking-[0.22em] uppercase text-white/45 mb-1">
              Voucher Preview
            </div>
            <div className="font-serif text-[22px] leading-tight">
              Customer Ticket
            </div>
            <p className="text-[11.5px] text-white/55 mt-1.5 leading-relaxed">
              Tampilan kupon di akun &amp; checkout.
            </p>
          </div>
        </div>

        {/* TICKET STUB */}
        <TicketStub
          promo={previewPromo}
          categoryLabel={
            applicability === "category"
              ? categories.find((c) => c.id === categoryId)?.label ?? "—"
              : null
          }
        />

        <div className="bg-cream border border-site-border p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-site-gray">
            <CalendarRange size={12} strokeWidth={1.8} />
            <span>Ringkasan</span>
          </div>
          <dl className="grid grid-cols-2 gap-y-1.5 text-[12px] font-mono">
            <dt className="text-site-gray">Tipe</dt>
            <dd className="text-site-text text-right tabular-nums">
              {PROMO_TYPE_LABEL[type]}
            </dd>
            <dt className="text-site-gray">Nilai</dt>
            <dd className="text-site-text text-right tabular-nums">
              {formatPromoValue(previewPromo)}
            </dd>
            <dt className="text-site-gray">Min. belanja</dt>
            <dd className="text-site-text text-right tabular-nums">
              {formatPrice(minPurchase)}
            </dd>
            <dt className="text-site-gray">Kuota</dt>
            <dd className="text-site-text text-right tabular-nums">
              {hasLimit ? usageLimit.toLocaleString("id-ID") : "∞"}
            </dd>
          </dl>
        </div>
      </aside>
    </form>
  );
}

/* ─────────────────────────── TICKET STUB ─────────────────────────── */

function TicketStub({
  promo,
  categoryLabel,
}: {
  promo: Promo;
  categoryLabel: string | null;
}) {
  const start = new Date(promo.startsAt);
  const end = new Date(promo.endsAt);
  const fmt = (d: Date) =>
    d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const headlineValue =
    promo.type === "shipping"
      ? "FREE"
      : promo.type === "percent"
        ? `${promo.value}%`
        : `Rp${(promo.value / 1000).toFixed(0)}K`;

  return (
    <div
      className="relative bg-white border-[1.5px] border-navy"
      style={{
        // perforation cut-outs on the seam between stub & body
        backgroundImage:
          "radial-gradient(circle at left 50%, transparent 5px, transparent 6px)",
      }}
    >
      {/* perforation dots between left stub and right body */}
      <div className="absolute top-0 bottom-0 left-[112px] w-px flex flex-col items-center justify-evenly pointer-events-none">
        {Array.from({ length: 9 }).map((_, i) => (
          <span
            key={i}
            className="block w-1 h-1 rounded-full bg-site-border"
          />
        ))}
      </div>
      {/* semicircle notches at the seam */}
      <div
        className="absolute -top-[7px] w-3 h-3 rounded-full bg-cream border border-site-border"
        style={{ left: "106px" }}
      />
      <div
        className="absolute -bottom-[7px] w-3 h-3 rounded-full bg-cream border border-site-border"
        style={{ left: "106px" }}
      />

      <div className="flex">
        {/* STUB (left) */}
        <div className="w-[112px] shrink-0 bg-navy text-white px-4 py-5 flex flex-col items-center justify-center text-center">
          <div className="text-[8.5px] tracking-[0.22em] uppercase text-white/55">
            Voucher
          </div>
          <div className="font-serif text-[28px] leading-none mt-1.5">
            {headlineValue}
          </div>
          <div className="mt-2 text-[8.5px] tracking-[0.22em] uppercase text-white/55 flex items-center gap-1.5">
            <Scissors size={9} strokeWidth={1.8} />
            <span>Tear</span>
          </div>
        </div>

        {/* BODY (right) */}
        <div className="flex-1 min-w-0 px-5 py-5">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-[11.5px] tracking-[0.08em] font-semibold text-navy bg-cream px-2 py-0.5 border border-site-border">
              {promo.code}
            </span>
            {!promo.enabled && (
              <span className="text-[9px] tracking-[0.16em] uppercase font-medium bg-[#fef2f2] text-[#991b1b] border border-[#fecaca] px-1.5 py-0.5">
                Off
              </span>
            )}
          </div>
          <h4 className="font-serif text-[17px] leading-tight text-navy">
            {promo.label}
          </h4>
          <p className="text-[11.5px] text-site-gray mt-1 leading-snug line-clamp-2">
            {promo.description}
          </p>
          <div className="mt-3 pt-3 border-t border-dashed border-site-border text-[10.5px] text-site-gray font-mono tabular-nums leading-snug">
            <div>
              Min. belanja {formatPrice(promo.minPurchase)}
            </div>
            <div>
              {fmt(start)} → {fmt(end)}
            </div>
            {categoryLabel && (
              <div className="mt-0.5">
                Kategori: <span className="text-site-text">{categoryLabel}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
