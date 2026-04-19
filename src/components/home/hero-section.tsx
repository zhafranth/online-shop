import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

export function HeroSection() {
  return (
    <div className="grid grid-cols-2 min-h-[88vh]">
      <div className="bg-navy text-white flex flex-col justify-center p-[clamp(40px,6vw,100px)]">
        <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gold mb-5">New Season 2026</div>
        <h1 className="font-serif font-light leading-[1.1] mb-4 text-[clamp(2.8rem,5vw,5rem)]">
          Tampil<br /><em className="italic text-gold">Percaya</em><br />Diri
        </h1>
        <p className="text-[15px] text-white/65 max-w-[340px] leading-[1.8] mb-9">
          Koleksi terbaru kami menggabungkan kenyamanan modern dengan estetika yang timeless. Untuk setiap versi terbaik dirimu.
        </p>
        <div className="flex gap-3.5 flex-wrap">
          <Link href="/catalog"><Button variant="gold">Belanja Sekarang</Button></Link>
          <Link href="/catalog?cat=Women"><Button variant="outline-white">Lihat Lookbook</Button></Link>
        </div>
        <div className="flex gap-10 mt-[60px] pt-10 border-t border-white/[0.12]">
          {[["500+", "Produk"], ["50K+", "Pelanggan"], ["4.9★", "Rating"]].map(([val, label]) => (
            <div key={label}>
              <div className="font-serif text-[28px] font-semibold text-gold">{val}</div>
              <div className="text-[11px] tracking-[0.1em] uppercase text-white/50 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>
      <PlaceholderImage label={"hero campaign\nmodel foto – full bleed"} className="h-full min-h-[88vh]" />
    </div>
  );
}
