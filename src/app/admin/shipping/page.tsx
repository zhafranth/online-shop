"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Building2,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  Pencil,
  Plus,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { useAdminShippingStore } from "@/stores/admin-shipping-store";
import { etdLabel, type ShippingCourier } from "@/types/shipping-admin";
import { formatPrice } from "@/lib/utils";

type Tab = "couriers" | "warehouse";

export default function AdminShippingPage() {
  const [tab, setTab] = useState<Tab>("couriers");

  const couriers = useAdminShippingStore((s) => s.couriers);
  const toggleEnabled = useAdminShippingStore((s) => s.toggleEnabled);
  const deleteCourier = useAdminShippingStore((s) => s.deleteCourier);
  const moveUp = useAdminShippingStore((s) => s.moveUp);
  const moveDown = useAdminShippingStore((s) => s.moveDown);
  const warehouse = useAdminShippingStore((s) => s.warehouse);
  const setWarehouse = useAdminShippingStore((s) => s.setWarehouse);

  const [toDelete, setToDelete] = useState<ShippingCourier | null>(null);

  const sorted = useMemo(
    () => [...couriers].sort((a, b) => a.order - b.order),
    [couriers],
  );

  const activeCount = sorted.filter((c) => c.enabled).length;
  const avgPrice =
    sorted.length === 0
      ? 0
      : Math.round(
          sorted.reduce((acc, c) => acc + c.price, 0) / sorted.length,
        );

  const confirmDelete = () => {
    if (toDelete) deleteCourier(toDelete.code);
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
            Pengiriman
          </h2>
          <p className="text-[13px] text-site-gray mt-1.5 max-w-xl leading-relaxed">
            Daftar kurir & ongkir yang aktif di checkout, plus alamat gudang
            asal untuk perhitungan pengiriman. Susun ulang prioritas tampilan
            atau matikan sementara saat audit.
          </p>
        </div>

        {tab === "couriers" && (
          <Link href="/admin/shipping/new">
            <Button variant="primary" className="flex items-center gap-2">
              <Plus size={15} strokeWidth={2} />
              Tambah Kurir
            </Button>
          </Link>
        )}
      </header>

      {/* ─── TABS ─── */}
      <div className="flex items-center gap-0 border-b border-site-border">
        {[
          { id: "couriers" as Tab, label: "Kurir", icon: Truck },
          { id: "warehouse" as Tab, label: "Gudang Asal", icon: Building2 },
        ].map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`relative inline-flex items-center gap-2 px-5 py-3 text-[12px] tracking-[0.12em] uppercase transition-colors ${
                active
                  ? "text-navy"
                  : "text-site-gray hover:text-site-text"
              }`}
            >
              <Icon size={14} strokeWidth={1.8} />
              {t.label}
              {active && (
                <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-navy" />
              )}
            </button>
          );
        })}
      </div>

      {tab === "couriers" ? (
        <CouriersTab
          sorted={sorted}
          activeCount={activeCount}
          avgPrice={avgPrice}
          toggleEnabled={toggleEnabled}
          moveUp={moveUp}
          moveDown={moveDown}
          onAskDelete={setToDelete}
        />
      ) : (
        <WarehouseTab warehouse={warehouse} onSave={setWarehouse} />
      )}

      <ConfirmModal
        open={toDelete !== null}
        title="Hapus Kurir"
        message={`Yakin ingin menghapus "${toDelete?.label}"? Pelanggan tidak akan bisa memilih kurir ini lagi.`}
        confirmLabel="Hapus"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}

/* ─────────────────────────── COURIERS TAB ─────────────────────────── */

interface CouriersTabProps {
  sorted: ShippingCourier[];
  activeCount: number;
  avgPrice: number;
  toggleEnabled: (code: string) => void;
  moveUp: (code: string) => void;
  moveDown: (code: string) => void;
  onAskDelete: (c: ShippingCourier) => void;
}

function CouriersTab({
  sorted,
  activeCount,
  avgPrice,
  toggleEnabled,
  moveUp,
  moveDown,
  onAskDelete,
}: CouriersTabProps) {
  return (
    <div className="space-y-6">
      {/* INSIGHT STRIP */}
      <div className="grid grid-cols-3 bg-white border border-site-border">
        {[
          { k: "Total Kurir", v: String(sorted.length).padStart(2, "0") },
          { k: "Aktif di Checkout", v: String(activeCount).padStart(2, "0") },
          { k: "Tarif Rata-rata", v: formatPrice(avgPrice) },
        ].map((s, i) => (
          <div
            key={s.k}
            className={`px-6 py-5 ${i > 0 ? "border-l border-site-border" : ""}`}
          >
            <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray">
              {s.k}
            </div>
            <div className="font-serif text-[34px] leading-none mt-2 text-navy tabular-nums">
              {s.v}
            </div>
          </div>
        ))}
      </div>

      {/* EDITORIAL LEDGER */}
      <div className="bg-white border border-site-border">
        <div className="grid grid-cols-[60px_1fr_140px_140px_120px_88px] items-center gap-5 px-6 py-3 bg-cream border-b border-site-border text-[10px] font-semibold tracking-[0.16em] uppercase text-site-gray">
          <span>No.</span>
          <span>Kurir</span>
          <span>ETD</span>
          <span>Harga</span>
          <span>Status</span>
          <span className="text-right">Aksi</span>
        </div>

        {sorted.length === 0 && (
          <div className="px-6 py-16 text-center">
            <div className="font-serif italic text-[22px] text-site-gray-light mb-1">
              No couriers on the ledger.
            </div>
            <p className="text-[13px] text-site-gray mb-5">
              Tambahkan setidaknya satu kurir agar checkout dapat digunakan.
            </p>
            <Link href="/admin/shipping/new">
              <Button variant="primary" size="sm">
                + Tambah Kurir
              </Button>
            </Link>
          </div>
        )}

        {sorted.map((c, i) => {
          const isFirst = i === 0;
          const isLast = i === sorted.length - 1;

          return (
            <div
              key={c.code}
              className="group grid grid-cols-[60px_1fr_140px_140px_120px_88px] items-center gap-5 px-6 py-5 border-b border-site-border last:border-b-0 hover:bg-cream/40 transition-colors"
            >
              {/* No. + arrows */}
              <div className="flex items-center gap-1.5">
                <div className="flex flex-col text-site-gray-light">
                  <button
                    type="button"
                    onClick={() => moveUp(c.code)}
                    disabled={isFirst}
                    aria-label="Naikkan urutan"
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-navy disabled:hover:text-site-gray-light disabled:cursor-not-allowed leading-none"
                  >
                    <ChevronUp size={13} strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(c.code)}
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

              {/* Label + code + description */}
              <div className="min-w-0">
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <h3 className="font-serif text-[19px] leading-tight text-navy">
                    {c.label}
                  </h3>
                  <span className="font-mono text-[11px] text-site-gray tracking-tight">
                    /{c.code}
                  </span>
                </div>
                <p className="text-[12.5px] text-site-gray mt-1 leading-snug line-clamp-1">
                  {c.description}
                </p>
              </div>

              {/* ETD */}
              <div className="flex items-center gap-1.5 text-site-text">
                <Clock size={12} strokeWidth={1.8} className="text-site-gray-light" />
                <span className="font-mono text-[12.5px] tabular-nums">
                  {c.etdMin === c.etdMax
                    ? `${c.etdMin}`
                    : `${c.etdMin}–${c.etdMax}`}
                </span>
                <span className="text-[11px] text-site-gray">hari</span>
              </div>

              {/* Price */}
              <div className="font-mono text-[13px] tabular-nums text-site-text">
                {formatPrice(c.price)}
              </div>

              {/* Status toggle */}
              <button
                type="button"
                onClick={() => toggleEnabled(c.code)}
                aria-pressed={c.enabled}
                className="flex items-center gap-2"
              >
                {c.enabled ? (
                  <ToggleRight size={28} strokeWidth={1.5} className="text-navy" />
                ) : (
                  <ToggleLeft size={28} strokeWidth={1.5} className="text-site-gray-light" />
                )}
                <span
                  className={`text-[10.5px] tracking-[0.14em] uppercase ${
                    c.enabled ? "text-site-text font-medium" : "text-site-gray"
                  }`}
                >
                  {c.enabled ? "Live" : "Off"}
                </span>
              </button>

              {/* Actions */}
              <div className="flex items-center justify-end gap-1">
                <Link
                  href={`/admin/shipping/${c.code}/edit`}
                  aria-label={`Edit ${c.label}`}
                  className="p-2 text-navy hover:bg-cream rounded-sm"
                >
                  <Pencil size={15} strokeWidth={1.8} />
                </Link>
                <button
                  type="button"
                  onClick={() => onAskDelete(c)}
                  aria-label={`Hapus ${c.label}`}
                  className="p-2 text-[#b91c1c] hover:bg-[#fee2e2] rounded-sm"
                >
                  <Trash2 size={15} strokeWidth={1.8} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

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
    </div>
  );
}

/* ─────────────────────────── WAREHOUSE TAB ─────────────────────────── */

interface WarehouseTabProps {
  warehouse: ReturnType<typeof useAdminShippingStore.getState>["warehouse"];
  onSave: (w: WarehouseTabProps["warehouse"]) => void;
}

function WarehouseTab({ warehouse, onSave }: WarehouseTabProps) {
  const [form, setForm] = useState(warehouse);
  const [error, setError] = useState("");
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const dirty =
    form.provinceId !== warehouse.provinceId ||
    form.provinceName !== warehouse.provinceName ||
    form.cityId !== warehouse.cityId ||
    form.cityName !== warehouse.cityName ||
    form.districtId !== warehouse.districtId ||
    form.districtName !== warehouse.districtName ||
    form.zipCode !== warehouse.zipCode;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.provinceName.trim()) return setError("Nama provinsi wajib.");
    if (!Number.isInteger(form.provinceId) || form.provinceId <= 0)
      return setError("Province ID harus angka > 0.");
    if (!form.cityName.trim()) return setError("Nama kota wajib.");
    if (!Number.isInteger(form.cityId) || form.cityId <= 0)
      return setError("City ID harus angka > 0.");
    if (!form.districtName.trim()) return setError("Nama kecamatan wajib.");
    if (!Number.isInteger(form.districtId) || form.districtId <= 0)
      return setError("District ID harus angka > 0.");
    if (!/^\d{5}$/.test(form.zipCode)) return setError("Kode pos harus 5 digit.");

    onSave({
      provinceId: form.provinceId,
      provinceName: form.provinceName.trim().toUpperCase(),
      cityId: form.cityId,
      cityName: form.cityName.trim().toUpperCase(),
      districtId: form.districtId,
      districtName: form.districtName.trim().toUpperCase(),
      zipCode: form.zipCode,
    });
    setSavedAt(Date.now());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6"
    >
      <div className="bg-white border border-site-border">
        <div className="px-7 pt-7 pb-5 border-b border-site-border">
          <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray mb-1">
            Origin Address
          </div>
          <h3 className="font-serif text-[26px] leading-tight">
            Alamat Gudang Asal
          </h3>
          <p className="text-[13px] text-site-gray mt-2 leading-relaxed">
            Titik asal untuk perhitungan ongkir. ID provinsi/kota/kecamatan
            mengikuti referensi mock RajaOngkir.
          </p>
        </div>

        <div className="px-7 py-7 space-y-6">
          {/* Province */}
          <FieldPair
            label="Provinsi"
            id="provinceId"
            idValue={form.provinceId}
            nameValue={form.provinceName}
            onIdChange={(v) => setForm((s) => ({ ...s, provinceId: v }))}
            onNameChange={(v) => setForm((s) => ({ ...s, provinceName: v }))}
            namePlaceholder="JAWA BARAT"
            idPlaceholder="9"
          />

          {/* City */}
          <FieldPair
            label="Kota / Kabupaten"
            id="cityId"
            idValue={form.cityId}
            nameValue={form.cityName}
            onIdChange={(v) => setForm((s) => ({ ...s, cityId: v }))}
            onNameChange={(v) => setForm((s) => ({ ...s, cityName: v }))}
            namePlaceholder="BANDUNG"
            idPlaceholder="22"
          />

          {/* District */}
          <FieldPair
            label="Kecamatan"
            id="districtId"
            idValue={form.districtId}
            nameValue={form.districtName}
            onIdChange={(v) => setForm((s) => ({ ...s, districtId: v }))}
            onNameChange={(v) => setForm((s) => ({ ...s, districtName: v }))}
            namePlaceholder="BANDUNG WETAN"
            idPlaceholder="1391"
          />

          {/* Zip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                Kode Pos
              </label>
              <input
                value={form.zipCode}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    zipCode: e.target.value.replace(/\D/g, "").slice(0, 5),
                  }))
                }
                placeholder="40115"
                inputMode="numeric"
                maxLength={5}
                className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-mono text-[13px] tracking-tight text-site-text outline-none focus:border-navy"
              />
              <p className="mt-1.5 text-[11px] text-site-gray">5 digit angka.</p>
            </div>
          </div>

          {error && (
            <div className="px-3.5 py-2.5 text-[13px] bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]">
              {error}
            </div>
          )}

          {savedAt && !dirty && (
            <div className="px-3.5 py-2.5 text-[13px] bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0]">
              Alamat gudang tersimpan.
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={!dirty}>
              Simpan Alamat Warehouse
            </Button>
            {dirty && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setForm(warehouse)}
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      <aside className="lg:sticky lg:top-8 self-start space-y-4">
        <div className="bg-[#0e0e10] text-white p-5 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/[0.02]" />
          <div className="absolute bottom-3 right-4 text-white/10 select-none">
            <MapPin size={96} strokeWidth={1} />
          </div>
          <div className="relative">
            <div className="text-[10px] tracking-[0.22em] uppercase text-white/45 mb-1">
              Origin Card
            </div>
            <div className="font-serif text-[22px] leading-tight">
              {form.districtName || "—"}
            </div>
            <p className="text-[11.5px] text-white/55 mt-1.5 leading-relaxed">
              {form.cityName}, {form.provinceName}
            </p>
            <p className="font-mono text-[11px] text-white/45 mt-2 tracking-tight">
              ZIP {form.zipCode || "—"}
            </p>
          </div>
        </div>

        <div className="bg-cream border border-site-border p-4 space-y-3">
          <div className="flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-site-gray">
            <Building2 size={12} strokeWidth={1.8} />
            <span>Reference IDs</span>
          </div>
          <dl className="grid grid-cols-2 gap-y-1.5 text-[12px] font-mono">
            <dt className="text-site-gray">Province</dt>
            <dd className="text-site-text tabular-nums text-right">
              {form.provinceId || "—"}
            </dd>
            <dt className="text-site-gray">City</dt>
            <dd className="text-site-text tabular-nums text-right">
              {form.cityId || "—"}
            </dd>
            <dt className="text-site-gray">District</dt>
            <dd className="text-site-text tabular-nums text-right">
              {form.districtId || "—"}
            </dd>
          </dl>
          <p className="pt-2 border-t border-site-border/60 text-[11px] text-site-gray leading-relaxed">
            ID dipakai untuk mock perhitungan ongkir RajaOngkir di checkout.
          </p>
        </div>
      </aside>
    </form>
  );
}

interface FieldPairProps {
  label: string;
  id: string;
  idValue: number;
  nameValue: string;
  onIdChange: (v: number) => void;
  onNameChange: (v: string) => void;
  namePlaceholder: string;
  idPlaceholder: string;
}

function FieldPair({
  label,
  id,
  idValue,
  nameValue,
  onIdChange,
  onNameChange,
  namePlaceholder,
  idPlaceholder,
}: FieldPairProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_140px] gap-5">
      <div>
        <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
          {label}
        </label>
        <input
          value={nameValue}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={namePlaceholder}
          className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-sans text-sm text-site-text outline-none focus:border-navy uppercase"
        />
      </div>
      <div>
        <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
          {label.split(" ")[0]} ID
        </label>
        <input
          id={id}
          type="number"
          min={1}
          value={idValue || ""}
          onChange={(e) => onIdChange(Number(e.target.value))}
          placeholder={idPlaceholder}
          className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-mono text-[13px] tracking-tight text-site-text outline-none focus:border-navy tabular-nums"
        />
      </div>
    </div>
  );
}
