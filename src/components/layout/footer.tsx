import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-navy-dark text-white/60 pt-[60px] pb-[30px]">
      <div className="container-site">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-12">
          <div>
            <div className="font-serif text-[28px] font-bold text-gold mb-3">VESTIRE</div>
            <p className="text-[13px] leading-[1.8] max-w-[260px]">Mode terpilih untuk semua. Kualitas premium, harga terjangkau, dikirim ke seluruh Indonesia.</p>
            <div className="flex gap-3 mt-5">
              {["IG", "TK", "FB", "YT"].map((s) => (
                <div key={s} className="w-9 h-9 border border-white/20 flex items-center justify-center text-[11px] cursor-pointer hover:border-gold hover:text-gold transition-colors">{s}</div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-white mb-4">Belanja</div>
            {["Pria", "Wanita", "Unisex", "Sale", "New Arrivals"].map((t) => (
              <div key={t} className="text-[13px] mb-2 cursor-pointer hover:text-gold transition-colors">{t}</div>
            ))}
          </div>
          <div>
            <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-white mb-4">Bantuan</div>
            {["Panduan Ukuran", "Lacak Pesanan", "Retur & Refund", "FAQ", "Kontak Kami"].map((t) => (
              <div key={t} className="text-[13px] mb-2 cursor-pointer hover:text-gold transition-colors">{t}</div>
            ))}
          </div>
          <div>
            <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-white mb-4">Newsletter</div>
            <p className="text-xs mb-3">Dapatkan update koleksi & promo eksklusif.</p>
            <div className="flex">
              <input type="email" placeholder="email kamu" className="flex-1 px-3 py-2.5 bg-white/[0.08] border border-white/15 text-white text-xs outline-none font-sans placeholder:text-white/40" />
              <Button variant="gold" size="sm" className="shrink-0 rounded-none px-3.5 py-2.5">→</Button>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex justify-between text-xs">
          <span>© 2026 VESTIRE. All rights reserved.</span>
          <span>Privacy Policy · Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
