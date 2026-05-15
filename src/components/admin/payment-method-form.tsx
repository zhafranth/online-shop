"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  CreditCard,
  HandCoins,
  Landmark,
  Plus,
  Smartphone,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminPaymentStore } from "@/stores/admin-payment-store";
import {
  PAYMENT_TYPE_LABEL,
  type BankAccount,
  type PaymentMethod,
  type PaymentMethodType,
} from "@/types/payment-admin";

interface PaymentMethodFormProps {
  mode: "create" | "edit";
  method?: PaymentMethod;
}

const TYPE_META: Record<
  PaymentMethodType,
  { icon: typeof CreditCard; hint: string }
> = {
  transfer: { icon: Landmark, hint: "Transfer ke rekening bank tujuan." },
  ewallet: { icon: Smartphone, hint: "GoPay, OVO, ShopeePay, DANA, dll." },
  cc: { icon: CreditCard, hint: "Visa, Mastercard, JCB." },
  cod: { icon: HandCoins, hint: "Bayar tunai saat barang tiba." },
  paylater: { icon: Wallet, hint: "Kredivo, Akulaku, Atome, dll." },
};

const ID_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function isUrl(s: string) {
  return /^https?:\/\//i.test(s);
}

const TYPE_OPTIONS: PaymentMethodType[] = [
  "transfer",
  "ewallet",
  "cc",
  "cod",
  "paylater",
];

export function PaymentMethodForm({ mode, method }: PaymentMethodFormProps) {
  const router = useRouter();
  const methods = useAdminPaymentStore((s) => s.methods);
  const addMethod = useAdminPaymentStore((s) => s.addMethod);
  const updateMethod = useAdminPaymentStore((s) => s.updateMethod);

  const isEdit = mode === "edit" && method;

  const [id, setId] = useState(method?.id ?? "");
  const [type, setType] = useState<PaymentMethodType>(method?.type ?? "transfer");
  const [label, setLabel] = useState(method?.label ?? "");
  const [description, setDescription] = useState(method?.description ?? "");
  const [icon, setIcon] = useState(method?.icon ?? "🏦");
  const [enabled, setEnabled] = useState(method?.enabled ?? true);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(
    method?.bankAccounts ?? [],
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode === "create" && !id) {
      // pre-fill ID from label slug if empty
    }
  }, [mode, id]);

  const TypeIcon = TYPE_META[type].icon;

  const addAccount = () =>
    setBankAccounts((prev) => [
      ...prev,
      { bankName: "", accountNo: "", accountHolder: "" },
    ]);

  const updateAccount = (idx: number, patch: Partial<BankAccount>) =>
    setBankAccounts((prev) =>
      prev.map((a, i) => (i === idx ? { ...a, ...patch } : a)),
    );

  const removeAccount = (idx: number) =>
    setBankAccounts((prev) => prev.filter((_, i) => i !== idx));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedId = id.trim();
    const trimmedLabel = label.trim();
    const trimmedDescription = description.trim();
    const trimmedIcon = icon.trim();

    if (!trimmedId) return setError("ID metode wajib diisi.");
    if (!ID_PATTERN.test(trimmedId)) {
      return setError("ID hanya boleh huruf kecil, angka, dan tanda hubung (kebab-case).");
    }
    if (mode === "create" && methods.some((m) => m.id === trimmedId)) {
      return setError(`ID "${trimmedId}" sudah dipakai.`);
    }
    if (trimmedLabel.length < 3 || trimmedLabel.length > 40) {
      return setError("Label harus 3–40 karakter.");
    }
    if (trimmedDescription.length < 5 || trimmedDescription.length > 80) {
      return setError("Deskripsi harus 5–80 karakter.");
    }
    if (!trimmedIcon) return setError("Icon wajib diisi (emoji atau URL).");
    if (!isUrl(trimmedIcon) && trimmedIcon.length > 4) {
      return setError("Icon harus 1–4 karakter emoji atau URL gambar (http/https).");
    }

    if (type === "transfer" && enabled) {
      if (bankAccounts.length === 0) {
        return setError("Metode transfer aktif minimal harus punya 1 rekening.");
      }
      for (const [i, a] of bankAccounts.entries()) {
        if (a.bankName.trim().length < 2 || a.bankName.trim().length > 30) {
          return setError(`Rekening #${i + 1}: nama bank harus 2–30 karakter.`);
        }
        if (!/^\d{8,20}$/.test(a.accountNo.trim())) {
          return setError(`Rekening #${i + 1}: nomor rekening harus 8–20 digit angka.`);
        }
        if (a.accountHolder.trim().length < 3 || a.accountHolder.trim().length > 60) {
          return setError(`Rekening #${i + 1}: atas nama harus 3–60 karakter.`);
        }
      }
    }

    const cleanedAccounts =
      type === "transfer"
        ? bankAccounts.map((a) => ({
            bankName: a.bankName.trim(),
            accountNo: a.accountNo.trim(),
            accountHolder: a.accountHolder.trim(),
          }))
        : undefined;

    const payload: PaymentMethod = {
      id: trimmedId,
      type,
      label: trimmedLabel,
      description: trimmedDescription,
      icon: trimmedIcon,
      enabled,
      order:
        method?.order ??
        (methods.length > 0 ? Math.max(...methods.map((m) => m.order)) + 1 : 1),
      bankAccounts: cleanedAccounts,
    };

    if (mode === "create") addMethod(payload);
    else if (method) updateMethod(method.id, payload);

    router.push("/admin/payment");
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
            {mode === "create" ? "Metode Baru" : "Edit Metode"}
          </div>
          <h3 className="font-serif text-[26px] leading-tight">
            {label || (isEdit ? method.label : "Metode tanpa nama")}
          </h3>
        </div>

        <div className="px-7 py-7 space-y-7">
          {/* TYPE SELECTOR */}
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-3">
              Tipe Metode
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {TYPE_OPTIONS.map((t) => {
                const Icon = TYPE_META[t].icon;
                const active = type === t;
                return (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setType(t)}
                    className={`flex flex-col items-center gap-1.5 px-2 py-3 border-[1.5px] transition-colors ${
                      active
                        ? "border-navy bg-navy text-white"
                        : "border-site-border bg-white text-site-gray-dark hover:border-navy"
                    }`}
                  >
                    <Icon size={18} strokeWidth={1.5} />
                    <span className="text-[10px] tracking-[0.12em] uppercase text-center leading-tight">
                      {PAYMENT_TYPE_LABEL[t]}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2.5 text-[11.5px] text-site-gray leading-relaxed">
              {TYPE_META[type].hint}
            </p>
          </div>

          {/* ID + Label */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                Identifier
                <span className="ml-1.5 normal-case tracking-normal font-normal text-site-gray-light">
                  (immutable)
                </span>
              </label>
              <input
                value={id}
                disabled={!!isEdit}
                onChange={(e) => setId(slugify(e.target.value))}
                placeholder="bca, gopay, qris-shopee"
                className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-mono text-[13px] tracking-tight text-site-text outline-none focus:border-navy disabled:bg-cream disabled:text-site-gray"
              />
              <p className="mt-1.5 text-[11px] text-site-gray leading-relaxed">
                Kebab-case. Akan jadi key di checkout & order log.
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                Label Tampilan
              </label>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Transfer Bank"
                maxLength={40}
                className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-sans text-sm text-site-text outline-none focus:border-navy"
              />
              <div className="mt-1.5 flex justify-between text-[11px] text-site-gray">
                <span>3–40 karakter</span>
                <span className="tabular-nums">{label.length}/40</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
              Deskripsi
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="BCA, Mandiri, BNI, BRI"
              maxLength={80}
              className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-sans text-sm text-site-text outline-none focus:border-navy"
            />
            <div className="mt-1.5 flex justify-between text-[11px] text-site-gray">
              <span>5–80 karakter — muncul di bawah label di checkout.</span>
              <span className="tabular-nums">{description.length}/80</span>
            </div>
          </div>

          {/* Icon */}
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
              Icon
              <span className="ml-1.5 normal-case tracking-normal font-normal text-site-gray-light">
                emoji atau URL
              </span>
            </label>
            <div className="flex items-stretch gap-3">
              <div className="shrink-0 w-[60px] h-[60px] bg-cream border border-site-border flex items-center justify-center overflow-hidden relative">
                {isUrl(icon) ? (
                  <Image
                    src={icon}
                    alt="icon"
                    fill
                    sizes="60px"
                    className="object-contain p-2"
                    unoptimized
                  />
                ) : (
                  <span className="text-[28px] leading-none select-none">
                    {icon || "?"}
                  </span>
                )}
              </div>
              <input
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="🏦 atau https://..."
                className="flex-1 px-3.5 py-3 border-[1.5px] border-site-border bg-white font-mono text-[13px] text-site-text outline-none focus:border-navy"
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["🏦", "💳", "📱", "🤝", "📋", "💰", "💵"].map((e) => (
                <button
                  type="button"
                  key={e}
                  onClick={() => setIcon(e)}
                  className={`w-8 h-8 border text-[18px] leading-none flex items-center justify-center transition-colors ${
                    icon === e
                      ? "border-navy bg-cream"
                      : "border-site-border hover:border-navy"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Bank Accounts repeater (transfer only) */}
          {type === "transfer" && (
            <div className="border-t border-dashed border-site-border pt-6">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-1">
                    Daftar Rekening
                  </label>
                  <p className="text-[11.5px] text-site-gray leading-relaxed">
                    Rekening tujuan yang akan ditampilkan setelah checkout.
                    Minimal satu jika metode aktif.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addAccount}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border-[1.5px] border-navy text-navy text-[11px] tracking-[0.12em] uppercase hover:bg-navy hover:text-white transition-colors"
                >
                  <Plus size={12} strokeWidth={2.4} />
                  Rekening
                </button>
              </div>

              {bankAccounts.length === 0 && (
                <div className="bg-cream border border-dashed border-site-border px-5 py-8 text-center">
                  <div className="font-serif italic text-[18px] text-site-gray-light mb-1">
                    No accounts yet.
                  </div>
                  <p className="text-[12px] text-site-gray">
                    Klik "+ Rekening" untuk menambah.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {bankAccounts.map((acc, idx) => (
                  <div
                    key={idx}
                    className="relative bg-cream border border-site-border"
                  >
                    <div className="flex items-center justify-between px-4 py-2 border-b border-site-border">
                      <div className="flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase text-site-gray">
                        <span className="font-serif italic text-[16px] not-italic font-normal text-navy normal-case tracking-tight">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="h-px w-4 bg-site-border" />
                        <span>Rekening</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAccount(idx)}
                        aria-label="Hapus rekening"
                        className="p-1.5 text-[#b91c1c] hover:bg-[#fee2e2] rounded-sm"
                      >
                        <Trash2 size={13} strokeWidth={1.8} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-[140px_1fr_1fr] gap-0 divide-y md:divide-y-0 md:divide-x divide-site-border">
                      <input
                        value={acc.bankName}
                        onChange={(e) =>
                          updateAccount(idx, { bankName: e.target.value })
                        }
                        placeholder="BCA"
                        maxLength={30}
                        className="px-3.5 py-2.5 bg-transparent font-sans text-[13px] font-semibold text-navy outline-none focus:bg-white"
                      />
                      <input
                        value={acc.accountNo}
                        onChange={(e) =>
                          updateAccount(idx, {
                            accountNo: e.target.value.replace(/[^0-9]/g, ""),
                          })
                        }
                        placeholder="1234567890"
                        maxLength={20}
                        inputMode="numeric"
                        className="px-3.5 py-2.5 bg-transparent font-mono text-[13px] tracking-tight text-site-text outline-none focus:bg-white"
                      />
                      <input
                        value={acc.accountHolder}
                        onChange={(e) =>
                          updateAccount(idx, { accountHolder: e.target.value })
                        }
                        placeholder="Atas nama"
                        maxLength={60}
                        className="px-3.5 py-2.5 bg-transparent font-sans text-[13px] text-site-text outline-none focus:bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enabled */}
          <div className="flex items-center justify-between pt-2 border-t border-dashed border-site-border">
            <div>
              <div className="text-[13px] font-medium text-site-text">
                Status Aktif
              </div>
              <div className="text-[11px] text-site-gray mt-0.5">
                Saat dinonaktifkan, metode tidak muncul di pilihan checkout.
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
              {mode === "create" ? "Tambah Metode" : "Simpan Perubahan"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/payment")}
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
          <div className="absolute bottom-3 right-4 text-white/10 font-serif text-[80px] leading-none select-none">
            Rp
          </div>
          <div className="relative">
            <div className="text-[10px] tracking-[0.22em] uppercase text-white/45 mb-1">
              Live Preview
            </div>
            <div className="font-serif text-[22px] leading-tight">
              Checkout Card
            </div>
            <p className="text-[11.5px] text-white/55 mt-1.5 leading-relaxed">
              Tampilan saat pelanggan memilih metode pembayaran.
            </p>
          </div>
        </div>

        {/* Method radio card preview */}
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
            <div className="shrink-0 w-9 h-9 bg-cream border border-site-border flex items-center justify-center overflow-hidden relative">
              {isUrl(icon) ? (
                <Image
                  src={icon}
                  alt="icon"
                  fill
                  sizes="36px"
                  className="object-contain p-1"
                  unoptimized
                />
              ) : (
                <span className="text-[18px] leading-none">{icon || "?"}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[13px] text-site-text truncate">
                {label || "Label metode"}
              </div>
              <div className="text-[11.5px] text-site-gray truncate">
                {description || "Deskripsi metode"}
              </div>
            </div>
            {!enabled && (
              <span className="ml-2 px-1.5 py-0.5 bg-[#fef2f2] text-[#991b1b] text-[9px] font-medium tracking-[0.16em] uppercase border border-[#fecaca]">
                Hidden
              </span>
            )}
          </div>
        </div>

        {/* Bank accounts preview (if transfer) */}
        {type === "transfer" && (
          <div className="bg-white border border-site-border">
            <div className="px-4 py-2.5 bg-cream border-b border-site-border flex items-center justify-between text-[10px] tracking-[0.18em] uppercase text-site-gray">
              <span>Rekening Tujuan</span>
              <span className="font-mono normal-case tracking-tight tabular-nums">
                {String(bankAccounts.length).padStart(2, "0")}
              </span>
            </div>
            {bankAccounts.length === 0 && (
              <div className="px-4 py-6 text-center text-[11.5px] text-site-gray-light italic">
                Belum ada rekening
              </div>
            )}
            <ul className="divide-y divide-site-border">
              {bankAccounts.slice(0, 4).map((a, i) => (
                <li key={i} className="px-4 py-3">
                  <div className="flex items-center justify-between gap-3 mb-0.5">
                    <span className="font-serif text-[15px] text-navy">
                      {a.bankName || "—"}
                    </span>
                    <span className="text-[9.5px] tracking-[0.16em] uppercase text-site-gray font-mono">
                      Bank
                    </span>
                  </div>
                  <div className="font-mono text-[12.5px] tracking-tight text-site-text tabular-nums">
                    {a.accountNo || "•••• •••• ••••"}
                  </div>
                  <div className="text-[11px] text-site-gray mt-0.5">
                    a/n {a.accountHolder || "—"}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Type summary */}
        <div className="bg-cream border border-site-border p-4">
          <div className="flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-site-gray mb-2">
            <TypeIcon size={12} strokeWidth={1.8} />
            <span>{PAYMENT_TYPE_LABEL[type]}</span>
          </div>
          <p className="text-[11.5px] text-site-gray-dark leading-relaxed">
            {TYPE_META[type].hint}
          </p>
        </div>
      </aside>
    </form>
  );
}
