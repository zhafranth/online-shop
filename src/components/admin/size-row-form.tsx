"use client";

import { FormEvent, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SizeRow } from "@/types/size-guide";

interface SizeRowFormProps {
  mode: "create" | "edit";
  existingSizes: string[];
  initial?: SizeRow;
  onCancel: () => void;
  onSubmit: (row: Omit<SizeRow, "order">) => void;
}

const SIZE_PATTERN = /^[A-Z0-9]{1,6}$/i;
const RANGE_HINT = "Format bebas, contoh: 80–84 atau 80-84";

export function SizeRowForm({
  mode,
  existingSizes,
  initial,
  onCancel,
  onSubmit,
}: SizeRowFormProps) {
  const [size, setSize] = useState(initial?.size ?? "");
  const [dada, setDada] = useState(initial?.dada ?? "");
  const [pinggang, setPinggang] = useState(initial?.pinggang ?? "");
  const [panggul, setPanggul] = useState(initial?.panggul ?? "");
  const [tinggi, setTinggi] = useState(initial?.tinggi ?? "");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedSize = size.trim().toUpperCase();
    const trimmedDada = dada.trim();
    const trimmedPinggang = pinggang.trim();
    const trimmedPanggul = panggul.trim();
    const trimmedTinggi = tinggi.trim();

    if (!SIZE_PATTERN.test(trimmedSize))
      return setError("Size harus 1–6 karakter (huruf/angka).");
    if (
      mode === "create" &&
      existingSizes.some((s) => s.toUpperCase() === trimmedSize)
    )
      return setError(`Ukuran "${trimmedSize}" sudah ada.`);
    if (
      mode === "edit" &&
      initial &&
      initial.size.toUpperCase() !== trimmedSize &&
      existingSizes.some((s) => s.toUpperCase() === trimmedSize)
    )
      return setError(`Ukuran "${trimmedSize}" sudah ada.`);
    for (const [label, val] of [
      ["Dada", trimmedDada],
      ["Pinggang", trimmedPinggang],
      ["Panggul", trimmedPanggul],
      ["Tinggi", trimmedTinggi],
    ] as const) {
      if (!val) return setError(`${label} wajib diisi.`);
      if (val.length > 20) return setError(`${label} terlalu panjang.`);
    }

    onSubmit({
      size: trimmedSize,
      dada: trimmedDada,
      pinggang: trimmedPinggang,
      panggul: trimmedPanggul,
      tinggi: trimmedTinggi,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-navy-dark/60 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-lg border border-site-border shadow-xl"
      >
        <div className="flex items-start justify-between px-7 pt-7 pb-5 border-b border-site-border">
          <div>
            <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray mb-1">
              {mode === "create" ? "Tambah Ukuran" : `Edit · ${initial?.size}`}
            </div>
            <h3 className="font-serif text-[24px] leading-tight text-navy">
              {mode === "create" ? "Baris Ukuran Baru" : "Sunting Ukuran"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Tutup"
            className="p-1.5 text-site-gray hover:text-navy"
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        </div>

        <div className="px-7 py-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4">
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                Size
              </label>
              <input
                value={size}
                onChange={(e) =>
                  setSize(e.target.value.toUpperCase().slice(0, 6))
                }
                placeholder="XS"
                maxLength={6}
                autoFocus
                className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-serif text-[18px] font-semibold text-site-text outline-none focus:border-navy uppercase tracking-wide"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                Dada (cm)
              </label>
              <input
                value={dada}
                onChange={(e) => setDada(e.target.value)}
                placeholder="80–84"
                maxLength={20}
                className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-mono text-[13px] tracking-tight text-site-text outline-none focus:border-navy"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                Pinggang (cm)
              </label>
              <input
                value={pinggang}
                onChange={(e) => setPinggang(e.target.value)}
                placeholder="62–66"
                maxLength={20}
                className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-mono text-[13px] tracking-tight text-site-text outline-none focus:border-navy"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                Panggul (cm)
              </label>
              <input
                value={panggul}
                onChange={(e) => setPanggul(e.target.value)}
                placeholder="88–92"
                maxLength={20}
                className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-mono text-[13px] tracking-tight text-site-text outline-none focus:border-navy"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2">
                Tinggi (cm)
              </label>
              <input
                value={tinggi}
                onChange={(e) => setTinggi(e.target.value)}
                placeholder="155–160"
                maxLength={20}
                className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-mono text-[13px] tracking-tight text-site-text outline-none focus:border-navy"
              />
            </div>
          </div>

          <p className="text-[11px] text-site-gray leading-relaxed">
            {RANGE_HINT}. Tanda hubung otomatis ditampilkan apa adanya.
          </p>

          {error && (
            <div className="px-3.5 py-2.5 text-[13px] bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 px-7 pb-6">
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Batal
          </Button>
          <Button type="submit" size="sm">
            {mode === "create" ? "Tambah Ukuran" : "Simpan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
