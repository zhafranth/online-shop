"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  Tag,
  ToggleLeft,
  ToggleRight,
  Truck,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminShippingStore } from "@/stores/admin-shipping-store";
import {
  etdLabel,
  type ShippingCourier,
} from "@/types/shipping-admin";
import { formatPrice } from "@/lib/utils";

interface CourierFormProps {
  mode: "create" | "edit";
  courier?: ShippingCourier;
}

const CODE_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function CourierForm({ mode, courier }: CourierFormProps) {
  const router = useRouter();
  const couriers = useAdminShippingStore((s) => s.couriers);
  const addCourier = useAdminShippingStore((s) => s.addCourier);
  const updateCourier = useAdminShippingStore((s) => s.updateCourier);

  const isEdit = mode === "edit" && courier;

  const [code, setCode] = useState(courier?.code ?? "");
  const [label, setLabel] = useState(courier?.label ?? "");
  const [description, setDescription] = useState(courier?.description ?? "");
  const [autoDescription, setAutoDescription] = useState(!isEdit);
  const [price, setPrice] = useState<number>(courier?.price ?? 0);
  const [etdMin, setEtdMin] = useState<number>(courier?.etdMin ?? 2);
  const [etdMax, setEtdMax] = useState<number>(courier?.etdMax ?? 3);
  const [enabled, setEnabled] = useState(courier?.enabled ?? true);
  const [error, setError] = useState("");

  const previewDescription = autoDescription
    ? etdLabel(etdMin, etdMax)
    : description;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedCode = code.trim();
    const trimmedLabel = label.trim();
    const finalDescription = autoDescription
      ? etdLabel(etdMin, etdMax)
      : description.trim();

    if (!trimmedCode) return setError("Code kurir wajib diisi.");
    if (trimmedCode.length < 2 || trimmedCode.length > 20) {
      return setError("Code harus 2–20 karakter.");
    }
    if (!CODE_PATTERN.test(trimmedCode)) {
      return setError(
        "Code hanya huruf kecil, angka, dan tanda hubung (kebab-case).",
      );
    }
    if (mode === "create" && couriers.some((c) => c.code === trimmedCode)) {
      return setError(`Code "${trimmedCode}" sudah dipakai.`);
    }
    if (trimmedLabel.length < 3 || trimmedLabel.length > 40) {
      return setError("Label harus 3–40 karakter.");
    }
    if (finalDescription.length < 5 || finalDescription.length > 80) {
      return setError("Deskripsi harus 5–80 karakter.");
    }
    if (!Number.isFinite(price) || price < 0) {
      return setError("Harga harus angka ≥ 0.");
    }
    if (!Number.isInteger(etdMin) || etdMin < 1 || etdMin > 30) {
      return setError("ETD Min harus bilangan bulat 1–30.");
    }
    if (!Number.isInteger(etdMax) || etdMax < etdMin || etdMax > 30) {
      return setError("ETD Max harus ≥ ETD Min dan ≤ 30.");
    }

    const payload: ShippingCourier = {
      code: trimmedCode,
      label: trimmedLabel,
      description: finalDescription,
      price,
      etdMin,
      etdMax,
      enabled,
      order:
        courier?.order ??
        (couriers.length > 0
          ? Math.max(...couriers.map((c) => c.order)) + 1
          : 1),
    };

    if (mode === "create") addCourier(payload);
    else if (courier) updateCourier(courier.code, payload);

    router.push("/admin/shipping");
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
            {mode === "create" ? "Kurir Baru" : "Edit Kurir"}
          </div>
          <h3 className="font-serif text-[26px] leading-tight">
            {label || (isEdit ? courier.label : "Kurir tanpa nama")}
          </h3>
        </div>

        <div className="px-7 py-7 space-y-7">
          {/* CODE + LABEL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                Code
                <span className="ml-1.5 normal-case tracking-normal font-normal text-site-gray-light">
                  (immutable)
                </span>
              </label>
              <input
                value={code}
                disabled={!!isEdit}
                onChange={(e) => setCode(slugify(e.target.value))}
                placeholder="jne, jnt, anteraja"
                className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-mono text-[13px] tracking-tight text-site-text outline-none focus:border-navy disabled:bg-cream disabled:text-site-gray"
              />
              <p className="mt-1.5 text-[11px] text-site-gray leading-relaxed">
                Kebab-case. Akan jadi key di order log.
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                Label Tampilan
              </label>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="JNE REG"
                maxLength={40}
                className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-sans text-sm text-site-text outline-none focus:border-navy"
              />
              <div className="mt-1.5 flex justify-between text-[11px] text-site-gray">
                <span>3–40 karakter</span>
                <span className="tabular-nums">{label.length}/40</span>
              </div>
            </div>
          </div>

          {/* PRICE + ETD */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                Harga
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[12px] font-mono text-site-gray-light pointer-events-none">
                  Rp
                </span>
                <input
                  type="number"
                  min={0}
                  step={500}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full pl-9 pr-3.5 py-3 border-[1.5px] border-site-border bg-white font-mono text-[13px] tracking-tight text-site-text outline-none focus:border-navy"
                />
              </div>
              <p className="mt-1.5 text-[11px] text-site-gray leading-relaxed">
                Tarif flat per service.
              </p>
            </div>
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                ETD Min (hari)
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={etdMin}
                onChange={(e) => setEtdMin(Number(e.target.value))}
                className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-mono text-[13px] tracking-tight text-site-text outline-none focus:border-navy"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                ETD Max (hari)
              </label>
              <input
                type="number"
                min={etdMin}
                max={30}
                value={etdMax}
                onChange={(e) => setEtdMax(Number(e.target.value))}
                className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-mono text-[13px] tracking-tight text-site-text outline-none focus:border-navy"
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase">
                Deskripsi
              </label>
              <label className="inline-flex items-center gap-1.5 text-[11px] text-site-gray cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoDescription}
                  onChange={(e) => setAutoDescription(e.target.checked)}
                  className="accent-[#0a0a0a]"
                />
                Auto dari ETD
              </label>
            </div>
            <input
              value={autoDescription ? etdLabel(etdMin, etdMax) : description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={autoDescription}
              placeholder="Estimasi 2–3 hari kerja"
              maxLength={80}
              className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-sans text-sm text-site-text outline-none focus:border-navy disabled:bg-cream disabled:text-site-gray"
            />
            <div className="mt-1.5 flex justify-between text-[11px] text-site-gray">
              <span>5–80 karakter — muncul di bawah label.</span>
              <span className="tabular-nums">
                {(autoDescription
                  ? etdLabel(etdMin, etdMax)
                  : description
                ).length}
                /80
              </span>
            </div>
          </div>

          {/* ENABLED */}
          <div className="flex items-center justify-between pt-2 border-t border-dashed border-site-border">
            <div>
              <div className="text-[13px] font-medium text-site-text">
                Status Aktif
              </div>
              <div className="text-[11px] text-site-gray mt-0.5">
                Saat dinonaktifkan, kurir tidak muncul di pilihan checkout.
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
                <ToggleLeft
                  size={32}
                  strokeWidth={1.5}
                  className="text-site-gray-light"
                />
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
              {mode === "create" ? "Tambah Kurir" : "Simpan Perubahan"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/shipping")}
            >
              Batal
            </Button>
          </div>
        </div>
      </div>

      {/* ─── PREVIEW COLUMN ─── */}
      <aside className="space-y-4 lg:sticky lg:top-8 self-start">
        <div className="bg-[#0e0e10] text-white p-5 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/[0.02]" />
          <div className="absolute bottom-3 right-4 text-white/10 select-none">
            <Truck size={96} strokeWidth={1} />
          </div>
          <div className="relative">
            <div className="text-[10px] tracking-[0.22em] uppercase text-white/45 mb-1">
              Live Preview
            </div>
            <div className="font-serif text-[22px] leading-tight">
              Checkout Card
            </div>
            <p className="text-[11.5px] text-white/55 mt-1.5 leading-relaxed">
              Tampilan opsi kurir di tahap pemilihan ongkir.
            </p>
          </div>
        </div>

        <div className="bg-white border-[1.5px] border-navy p-3.5 relative">
          <div className="absolute top-2 right-2 text-[9px] tracking-[0.18em] uppercase font-mono text-site-gray-light">
            Selected
          </div>
          <div className="flex items-center gap-3">
            <input
              type="radio"
              checked
              readOnly
              className="accent-[#0a0a0a] w-3.5 h-3.5"
            />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[13px] text-site-text truncate">
                {label || "Label kurir"}
              </div>
              <div className="text-[11.5px] text-site-gray truncate">
                {previewDescription || "Deskripsi kurir"}
              </div>
            </div>
            <div className="font-semibold text-[13px] text-navy shrink-0">
              {formatPrice(price)}
            </div>
            {!enabled && (
              <span className="ml-2 px-1.5 py-0.5 bg-[#fef2f2] text-[#991b1b] text-[9px] font-medium tracking-[0.16em] uppercase border border-[#fecaca]">
                Hidden
              </span>
            )}
          </div>
        </div>

        <div className="bg-cream border border-site-border p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-site-gray">
            <Clock size={12} strokeWidth={1.8} />
            <span>ETD</span>
          </div>
          <div className="font-serif text-[18px] text-navy leading-tight">
            {etdLabel(etdMin, etdMax)}
          </div>
          <div className="flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-site-gray pt-2 border-t border-site-border/60">
            <Wallet size={12} strokeWidth={1.8} />
            <span>Harga Flat</span>
          </div>
          <div className="font-mono text-[14px] text-site-text">
            {formatPrice(price)}
          </div>
          <div className="flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-site-gray pt-2 border-t border-site-border/60">
            <Tag size={12} strokeWidth={1.8} />
            <span>Code</span>
          </div>
          <div className="font-mono text-[12.5px] text-site-text">
            /{code || "—"}
          </div>
        </div>
      </aside>
    </form>
  );
}
