"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Plus,
  Ruler,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { SizeRowForm } from "@/components/admin/size-row-form";
import { useSizeGuideStore } from "@/stores/size-guide-store";
import { SIZE_GUIDE_COLUMNS, type SizeRow } from "@/types/size-guide";

export default function AdminSizeGuidePage() {
  const rows = useSizeGuideStore((s) => s.rows);
  const note = useSizeGuideStore((s) => s.note);
  const addRow = useSizeGuideStore((s) => s.addRow);
  const updateRow = useSizeGuideStore((s) => s.updateRow);
  const deleteRow = useSizeGuideStore((s) => s.deleteRow);
  const moveUp = useSizeGuideStore((s) => s.moveUp);
  const moveDown = useSizeGuideStore((s) => s.moveDown);
  const setNote = useSizeGuideStore((s) => s.setNote);

  const sorted = [...rows].sort((a, b) => a.order - b.order);

  const [editing, setEditing] = useState<SizeRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [toDelete, setToDelete] = useState<SizeRow | null>(null);

  const [noteDraft, setNoteDraft] = useState(note);
  const [noteSavedAt, setNoteSavedAt] = useState<number | null>(null);

  useEffect(() => {
    setNoteDraft(note);
  }, [note]);

  const noteDirty = noteDraft !== note;

  const handleCreate = (row: Omit<SizeRow, "order">) => {
    addRow(row);
    setCreating(false);
  };

  const handleUpdate = (row: Omit<SizeRow, "order">) => {
    if (!editing) return;
    updateRow(editing.size, row);
    setEditing(null);
  };

  const confirmDelete = () => {
    if (toDelete) deleteRow(toDelete.size);
    setToDelete(null);
  };

  const saveNote = () => {
    setNote(noteDraft.trim());
    setNoteSavedAt(Date.now());
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
              Chart 01–{String(sorted.length).padStart(2, "0")}
            </span>
          </div>
          <h2 className="font-serif text-[34px] leading-tight mt-2 text-navy">
            Panduan Ukuran
          </h2>
          <p className="text-[13px] text-site-gray mt-1.5 max-w-xl leading-relaxed">
            Tabel ukuran yang tampil pada halaman detail produk. Atur baris,
            ubah angka centimeter, dan tambahkan catatan footer.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setCreating(true)}
          className="flex items-center gap-2"
        >
          <Plus size={15} strokeWidth={2} />
          Tambah Ukuran
        </Button>
      </header>

      {/* ─── INSIGHT STRIP ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 bg-white border border-site-border">
        {[
          { k: "Total Baris", v: String(sorted.length).padStart(2, "0") },
          {
            k: "Range Terkecil",
            v: sorted[0]?.size ?? "—",
          },
          {
            k: "Range Terbesar",
            v: sorted[sorted.length - 1]?.size ?? "—",
          },
          { k: "Catatan", v: note ? "Aktif" : "Kosong" },
        ].map((s, i) => (
          <div
            key={s.k}
            className={`px-6 py-5 ${i > 0 ? "md:border-l border-site-border" : ""}`}
          >
            <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray">
              {s.k}
            </div>
            <div className="font-serif text-[28px] leading-none mt-2 text-navy">
              {s.v}
            </div>
          </div>
        ))}
      </div>

      {/* ─── TABLE ─── */}
      <div className="bg-white border border-site-border">
        <div className="grid grid-cols-[60px_100px_repeat(4,1fr)_88px] items-center gap-5 px-6 py-3 bg-cream border-b border-site-border text-[10px] font-semibold tracking-[0.16em] uppercase text-site-gray">
          <span>No.</span>
          <span>Size</span>
          {SIZE_GUIDE_COLUMNS.map((c) => (
            <span key={c.key}>{c.label} (cm)</span>
          ))}
          <span className="text-right">Aksi</span>
        </div>

        {sorted.length === 0 && (
          <div className="px-6 py-16 text-center">
            <div className="font-serif italic text-[22px] text-site-gray-light mb-1">
              No sizes on the chart.
            </div>
            <p className="text-[13px] text-site-gray mb-5">
              Tambahkan setidaknya satu baris agar tabel size guide tampil.
            </p>
            <Button variant="primary" size="sm" onClick={() => setCreating(true)}>
              + Tambah Ukuran
            </Button>
          </div>
        )}

        {sorted.map((row, i) => {
          const isFirst = i === 0;
          const isLast = i === sorted.length - 1;
          return (
            <div
              key={row.size}
              className="group grid grid-cols-[60px_100px_repeat(4,1fr)_88px] items-center gap-5 px-6 py-4 border-b border-site-border last:border-b-0 hover:bg-cream/40 transition-colors"
            >
              {/* No. + arrows */}
              <div className="flex items-center gap-1.5">
                <div className="flex flex-col text-site-gray-light">
                  <button
                    type="button"
                    onClick={() => moveUp(row.size)}
                    disabled={isFirst}
                    aria-label="Naikkan urutan"
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-navy disabled:hover:text-site-gray-light disabled:cursor-not-allowed leading-none"
                  >
                    <ChevronUp size={13} strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(row.size)}
                    disabled={isLast}
                    aria-label="Turunkan urutan"
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-navy disabled:hover:text-site-gray-light disabled:cursor-not-allowed leading-none"
                  >
                    <ChevronDown size={13} strokeWidth={2} />
                  </button>
                </div>
                <span className="font-serif italic text-[24px] leading-none tabular-nums text-site-gray-light">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Size */}
              <div className="font-serif text-[20px] font-semibold text-navy tracking-wide">
                {row.size}
              </div>

              {SIZE_GUIDE_COLUMNS.map((c) => (
                <div
                  key={c.key}
                  className="font-mono text-[13px] tabular-nums text-site-text"
                >
                  {row[c.key]}
                </div>
              ))}

              {/* Actions */}
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => setEditing(row)}
                  aria-label={`Edit ${row.size}`}
                  className="p-2 text-navy hover:bg-cream rounded-sm"
                >
                  <Pencil size={15} strokeWidth={1.8} />
                </button>
                <button
                  type="button"
                  onClick={() => setToDelete(row)}
                  aria-label={`Hapus ${row.size}`}
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

      {/* ─── NOTE ─── */}
      <div className="bg-white border border-site-border">
        <div className="px-7 pt-7 pb-5 border-b border-site-border flex items-start justify-between">
          <div>
            <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray mb-1">
              Footer Note
            </div>
            <h3 className="font-serif text-[22px] leading-tight">
              Catatan Tabel
            </h3>
            <p className="text-[12.5px] text-site-gray mt-2 leading-relaxed max-w-xl">
              Tampil sebagai paragraf di bawah tabel size guide pada halaman
              produk. Contoh: cara mengukur, disclaimer toleransi cm.
            </p>
          </div>
          <Ruler size={28} strokeWidth={1.6} className="text-site-gray-light" />
        </div>
        <div className="px-7 py-6 space-y-4">
          <textarea
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            rows={4}
            maxLength={500}
            placeholder="Ukur pada bagian terlebar saat berdiri tegak..."
            className="w-full px-3.5 py-3 border-[1.5px] border-site-border bg-white font-sans text-sm text-site-text outline-none focus:border-navy leading-relaxed resize-y"
          />
          <div className="flex items-center justify-between text-[11px] text-site-gray">
            <span>Maksimal 500 karakter.</span>
            <span className="tabular-nums">{noteDraft.length}/500</span>
          </div>
          {noteSavedAt && !noteDirty && (
            <div className="px-3.5 py-2.5 text-[13px] bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0]">
              Catatan tersimpan.
            </div>
          )}
          <div className="flex gap-3 pt-1">
            <Button type="button" disabled={!noteDirty} onClick={saveNote}>
              Simpan Catatan
            </Button>
            {noteDirty && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setNoteDraft(note)}
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {creating && (
        <SizeRowForm
          mode="create"
          existingSizes={rows.map((r) => r.size)}
          onCancel={() => setCreating(false)}
          onSubmit={handleCreate}
        />
      )}

      {editing && (
        <SizeRowForm
          mode="edit"
          existingSizes={rows.map((r) => r.size)}
          initial={editing}
          onCancel={() => setEditing(null)}
          onSubmit={handleUpdate}
        />
      )}

      <ConfirmModal
        open={toDelete !== null}
        title="Hapus Ukuran"
        message={`Yakin ingin menghapus ukuran "${toDelete?.size}"? Baris ini akan hilang dari size guide produk.`}
        confirmLabel="Hapus"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
