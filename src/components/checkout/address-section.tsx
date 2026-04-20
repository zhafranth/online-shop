"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddressForm { nama: string; telp: string; alamat: string; provinsi: string; kota: string; kodepos: string; }
interface AddressSectionProps { isOpen: boolean; isDone: boolean; form: AddressForm; onToggle: () => void; onUpdate: (key: keyof AddressForm, value: string) => void; onSave: () => void; }

export function AddressSection({ isOpen, isDone, form, onToggle, onUpdate, onSave }: AddressSectionProps) {
  return (
    <div className="border-[1.5px] border-site-border mb-4">
      <div className={`flex items-center justify-between px-4 sm:px-5 py-4 cursor-pointer border-b border-site-border transition-colors gap-3 ${isOpen ? "bg-navy text-white" : "bg-white hover:bg-cream"}`} onClick={onToggle}>
        <div className="flex items-center gap-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold border-2 ${isDone ? "bg-gold text-white border-gold" : isOpen ? "bg-navy text-white border-white" : "bg-white text-site-gray border-site-border"}`}>{isDone ? "✓" : "1"}</div>
          <span className="font-semibold text-sm">Alamat Pengiriman</span>
        </div>
        {isDone && !isOpen ? <div className="text-xs text-gold">{form.kota || "Sudah diisi ✓"}</div> : <span>{isOpen ? "▲" : "▼"}</span>}
      </div>
      {isOpen && (
        <div className="p-4 sm:p-5 border-b border-site-border bg-site-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {([
              { k: "nama" as const, label: "Nama Lengkap", ph: "Ahmad Fauzi", full: true },
              { k: "telp" as const, label: "No. Telepon", ph: "08xx-xxxx-xxxx", full: false },
              { k: "alamat" as const, label: "Alamat Lengkap", ph: "Jl. Merdeka No. 1, RT 01/RW 02", full: true },
              { k: "provinsi" as const, label: "Provinsi", ph: "DKI Jakarta", full: false },
              { k: "kota" as const, label: "Kota / Kabupaten", ph: "Jakarta Selatan", full: false },
              { k: "kodepos" as const, label: "Kode Pos", ph: "12345", full: false },
            ]).map((f) => (
              <div key={f.k} className={f.full ? "sm:col-span-2" : ""}><Input label={f.label} placeholder={f.ph} value={form[f.k]} onChange={(e) => onUpdate(f.k, e.target.value)} /></div>
            ))}
          </div>
          <Button variant="primary" className="mt-4 w-full sm:w-auto" onClick={onSave}>Simpan & Lanjutkan →</Button>
        </div>
      )}
    </div>
  );
}
