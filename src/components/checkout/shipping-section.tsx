"use client";
import { SHIPPING_OPTIONS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ShippingSectionProps { isOpen: boolean; isDone: boolean; selected: string; isFreeShipping: boolean; onToggle: () => void; onSelect: (id: string) => void; onSave: () => void; }

export function ShippingSection({ isOpen, isDone, selected, isFreeShipping, onToggle, onSelect, onSave }: ShippingSectionProps) {
  return (
    <div className="border-[1.5px] border-site-border mb-4">
      <div className={`flex items-center justify-between px-5 py-4 cursor-pointer border-b border-site-border transition-colors ${isOpen ? "bg-navy text-white" : "bg-white hover:bg-cream"}`} onClick={onToggle}>
        <div className="flex items-center gap-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold border-2 ${isDone ? "bg-gold text-white border-gold" : isOpen ? "bg-navy text-white border-white" : "bg-white text-site-gray border-site-border"}`}>{isDone ? "✓" : "2"}</div>
          <span className="font-semibold text-sm">Metode Pengiriman</span>
        </div>
        {isDone && !isOpen ? <span className="text-xs text-gold">{SHIPPING_OPTIONS.find((o) => o.id === selected)?.label} ✓</span> : <span>{isOpen ? "▲" : "▼"}</span>}
      </div>
      {isOpen && (
        <div className="p-5 border-b border-site-border bg-site-white">
          <div className="flex flex-col gap-2.5">
            {SHIPPING_OPTIONS.map((opt) => (
              <label key={opt.id} className={`flex items-center gap-3.5 p-3.5 border-[1.5px] cursor-pointer ${selected === opt.id ? "border-navy bg-cream" : "border-site-border bg-white"}`}>
                <input type="radio" name="shipping" value={opt.id} checked={selected === opt.id} onChange={() => onSelect(opt.id)} className="accent-[#1a2744]" />
                <div className="flex-1">
                  <div className="font-semibold text-sm">{opt.label}</div>
                  <div className="text-xs text-site-gray">{opt.description}</div>
                </div>
                <div className={`font-semibold text-sm ${isFreeShipping ? "text-gold" : "text-navy"}`}>{isFreeShipping ? "FREE" : formatPrice(opt.price)}</div>
              </label>
            ))}
          </div>
          <Button variant="primary" className="mt-4" onClick={onSave}>Simpan & Lanjutkan →</Button>
        </div>
      )}
    </div>
  );
}
