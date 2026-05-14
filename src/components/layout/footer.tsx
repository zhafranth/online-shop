import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-cream text-site-text/70 pt-14 md:pt-[72px] pb-[30px] border-t border-site-border">
      <div className="container-site">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-8 md:gap-10 mb-12 md:mb-16">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="font-serif text-2xl md:text-[28px] font-semibold text-site-text tracking-[0.18em] uppercase mb-4">ThickApparel</div>
            <p className="text-[13px] leading-[1.85] max-w-[280px] text-site-gray">Mode terpilih untuk semua. Kualitas premium, harga terjangkau, dikirim ke seluruh Indonesia.</p>
            <div className="flex gap-2.5 mt-6">
              {["IG", "TK", "FB", "YT"].map((s) => (
                <div key={s} className="w-9 h-9 border border-site-border flex items-center justify-center text-[11px] text-site-gray cursor-pointer hover:border-site-text hover:text-site-text transition-colors">{s}</div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-site-text mb-5">Belanja</div>
            {["Pria", "Wanita", "Unisex", "Sale", "New Arrivals"].map((t) => (
              <div key={t} className="text-[13px] mb-2.5 text-site-gray cursor-pointer hover:text-site-text transition-colors">{t}</div>
            ))}
          </div>
          <div>
            <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-site-text mb-5">Bantuan</div>
            {["Panduan Ukuran", "Lacak Pesanan", "Retur & Refund", "FAQ", "Kontak Kami"].map((t) => (
              <div key={t} className="text-[13px] mb-2.5 text-site-gray cursor-pointer hover:text-site-text transition-colors">{t}</div>
            ))}
          </div>
          <div>
            <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-site-text mb-5">Newsletter</div>
            <p className="text-xs mb-3 text-site-gray leading-relaxed">Dapatkan update koleksi & promo eksklusif.</p>
            <div className="flex">
              <input type="email" placeholder="email kamu" className="flex-1 px-3 py-2.5 bg-white border border-site-border text-site-text text-xs outline-none font-sans placeholder:text-site-gray-light focus:border-site-text transition-colors" />
              <Button variant="primary" size="sm" className="shrink-0 rounded-none px-3.5 py-2.5">→</Button>
            </div>
          </div>
        </div>
        <div className="border-t border-site-border pt-6 flex flex-col sm:flex-row gap-2 sm:gap-4 sm:justify-between text-xs text-site-gray">
          <span>© 2026 ThickApparel. All rights reserved.</span>
          <span>Privacy Policy · Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
