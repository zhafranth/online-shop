"use client";
import { PAYMENT_OPTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";

interface PaymentSectionProps { isOpen: boolean; isDone: boolean; selected: string; onToggle: () => void; onSelect: (id: string) => void; onSave: () => void; }

export function PaymentSection({ isOpen, isDone, selected, onToggle, onSelect, onSave }: PaymentSectionProps) {
  return (
    <div className="border-[1.5px] border-site-border mb-4">
      <div className={`flex items-center justify-between px-4 sm:px-5 py-4 cursor-pointer border-b border-site-border transition-colors gap-3 ${isOpen ? "bg-navy text-white" : "bg-white hover:bg-cream"}`} onClick={onToggle}>
        <div className="flex items-center gap-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold border-2 ${isDone ? "bg-gold text-white border-gold" : isOpen ? "bg-navy text-white border-white" : "bg-white text-site-gray border-site-border"}`}>{isDone ? "✓" : "3"}</div>
          <span className="font-semibold text-sm">Metode Pembayaran</span>
        </div>
        <span>{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && (
        <div className="p-4 sm:p-5 border-b border-site-border bg-site-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PAYMENT_OPTIONS.map((opt) => (
              <label key={opt.id} className={`flex items-start gap-2.5 p-3 sm:p-3.5 border-[1.5px] cursor-pointer ${selected === opt.id ? "border-navy bg-cream" : "border-site-border bg-white"}`}>
                <input type="radio" name="payment" value={opt.id} checked={selected === opt.id} onChange={() => onSelect(opt.id)} className="accent-[#1a2744] mt-0.5" />
                <div>
                  <div className="flex gap-1.5 items-center font-semibold text-[13px] mb-0.5"><span>{opt.icon}</span>{opt.label}</div>
                  <div className="text-[11px] text-site-gray">{opt.description}</div>
                </div>
              </label>
            ))}
          </div>
          <Button variant="primary" className="mt-4 w-full sm:w-auto" onClick={onSave}>Konfirmasi Pembayaran</Button>
        </div>
      )}
    </div>
  );
}
