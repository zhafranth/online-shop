import Link from "next/link";
import { Button } from "@/components/ui/button";

export function OrderSuccess() {
  const orderNumber = `#VST-2026-${Math.floor(Math.random() * 10000)}`;
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-5 py-10 md:p-10">
      <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✓</div>
      <h2 className="font-serif font-normal text-2xl md:text-[32px] mb-2.5">Pesanan Berhasil!</h2>
      <p className="text-site-gray text-[15px] mb-2">Nomor pesanan: {orderNumber}</p>
      <p className="text-site-gray text-[13px] max-w-[400px] leading-[1.8] mb-8">Terima kasih! Pesananmu sedang kami proses. Kamu akan mendapat konfirmasi via WhatsApp & email.</p>
      <Link href="/"><Button variant="primary">Kembali ke Beranda</Button></Link>
    </div>
  );
}
