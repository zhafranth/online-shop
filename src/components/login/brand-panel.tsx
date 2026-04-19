import Link from "next/link";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

export function BrandPanel() {
  return (
    <div className="bg-navy-dark text-white flex flex-col justify-between p-[clamp(40px,6vw,80px)] relative overflow-hidden min-h-screen">
      <Link href="/" className="font-serif text-[28px] font-bold text-gold tracking-[0.06em] no-underline">VESTIRE</Link>
      <div>
        <div className="text-[11px] tracking-[0.2em] uppercase text-gold mb-5">Selamat Datang</div>
        <h2 className="font-serif font-light text-[clamp(2rem,4vw,3.5rem)] leading-[1.15] mb-5">&ldquo;Gaya kamu,<br /><em className="text-gold">cerita</em> kamu.&rdquo;</h2>
        <p className="text-sm text-white/60 max-w-[340px] leading-[1.9] mb-9">Bergabunglah dengan 50.000+ pelanggan VESTIRE dan nikmati akses eksklusif ke koleksi terbaru, penawaran spesial, dan pengalaman berbelanja yang menyenangkan.</p>
        <div className="flex flex-col gap-3">
          {["Akses early ke koleksi baru", "Voucher selamat datang Rp 50.000", "Lacak pesanan real-time", "Program loyalitas & poin reward"].map((text) => (
            <div key={text} className="flex gap-2.5 items-center text-[13px] text-white/75"><span className="text-gold text-[10px]">✦</span>{text}</div>
          ))}
        </div>
      </div>
      <div>
        <PlaceholderImage label={"campaign image\nlookbook foto"} className="w-full h-[180px] opacity-70" />
        <div className="text-[11px] text-white/35 mt-3 tracking-[0.06em]">New Season 2026 – Now Available</div>
      </div>
    </div>
  );
}
