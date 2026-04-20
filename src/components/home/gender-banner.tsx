import Link from "next/link";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { Button } from "@/components/ui/button";

const BANNERS = [
  { label: "For Him", desc: "Koleksi pria terbaru", cat: "Men", overlay: "rgba(13,21,38,0.6)" },
  { label: "For Her", desc: "Koleksi wanita terkurasi", cat: "Women", overlay: "rgba(45,26,46,0.65)" },
];

export function GenderBanner() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      {BANNERS.map(({ label, desc, cat, overlay }) => (
        <Link key={cat} href={`/catalog?cat=${cat}`} className="relative h-[280px] md:h-[380px] cursor-pointer overflow-hidden block group">
          <PlaceholderImage label={`${cat.toLowerCase()} campaign`} className="absolute inset-0 w-full h-full" />
          <div className="absolute inset-0" style={{ background: overlay }} />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-6">
            <div className="text-[11px] tracking-[0.2em] uppercase text-gold mb-3">Koleksi {label.split(" ")[1]}</div>
            <h2 className="font-serif font-normal text-3xl md:text-[40px] mb-2">{label}</h2>
            <p className="text-[13px] text-white/70 mb-6 md:mb-7">{desc}</p>
            <Button variant="outline-white" size="sm">Explore →</Button>
          </div>
        </Link>
      ))}
    </section>
  );
}
