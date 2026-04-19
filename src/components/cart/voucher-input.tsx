"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface VoucherInputProps { subtotal: number; onApplyDiscount: (discount: number) => void; }

export function VoucherInput({ subtotal, onApplyDiscount }: VoucherInputProps) {
  const [voucher, setVoucher] = useState("");
  const [msg, setMsg] = useState("");

  const applyVoucher = () => {
    if (voucher.toUpperCase() === "VESTIRE10") {
      onApplyDiscount(Math.round(subtotal * 0.1));
      setMsg("✓ Voucher berhasil! Diskon 10%");
    } else {
      onApplyDiscount(0);
      setMsg("✗ Kode voucher tidak valid");
    }
  };

  return (
    <div className="p-5 border-[1.5px] border-dashed border-site-border mb-8">
      <div className="text-[13px] font-semibold mb-2.5">🎫 Kode Voucher</div>
      <div className="flex gap-2">
        <input type="text" placeholder="Masukkan kode voucher..." value={voucher} onChange={(e) => setVoucher(e.target.value)} className="flex-1 px-4 py-3 border-[1.5px] border-site-border bg-white font-sans text-sm text-site-text outline-none focus:border-navy" />
        <Button variant="primary" onClick={applyVoucher}>Pakai</Button>
      </div>
      {msg && <div className={`text-xs mt-2 ${msg.startsWith("✓") ? "text-gold" : "text-[#c0392b]"}`}>{msg}</div>}
      <div className="text-[11px] text-site-gray mt-1.5">Coba kode: VESTIRE10</div>
    </div>
  );
}
