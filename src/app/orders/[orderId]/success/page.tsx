"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useOrderStore } from "@/stores/order-store";
import { formatPrice } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";

export default function OrderSuccessPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const order = useOrderStore((s) => s.getById(orderId));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen pt-[72px]">
        <Navbar />
        <div className="container-site py-20 text-center text-site-gray">
          Memuat…
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen pt-[72px]">
        <Navbar />
        <div className="container-site py-20 text-center">
          <h2 className="font-serif text-2xl mb-3">Pesanan tidak ditemukan</h2>
          <Link href="/catalog">
            <Button>Kembali Belanja</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[72px] animate-fade-up bg-cream">
      <Navbar />
      <div className="container-site py-10 md:py-16">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center text-4xl text-white mx-auto mb-6">
            ✓
          </div>
          <h1 className="font-serif font-normal text-3xl md:text-[36px] mb-3">
            Pembayaran Berhasil!
          </h1>
          <p className="text-site-gray mb-8">
            Pesananmu sudah kami terima dan sedang diproses ✨
          </p>

          <div className="bg-white border-[1.5px] border-site-border text-left">
            <div className="px-5 py-4 border-b border-site-border bg-navy text-white text-sm tracking-[0.06em] font-semibold">
              DETAIL PESANAN
            </div>
            <dl className="p-5 sm:p-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-site-gray">No. Pesanan</dt>
                <dd className="font-mono text-site-text">{order.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-site-gray">AWB</dt>
                <dd className="font-mono text-site-text">
                  {order.awb ?? "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-site-gray">Kurir</dt>
                <dd className="text-site-text">
                  {order.shippingDetails
                    ? `${order.shippingDetails.courierName} (${order.shippingDetails.service})`
                    : "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-site-gray">Total</dt>
                <dd className="font-semibold text-navy">
                  {formatPrice(order.total)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-site-gray">Status</dt>
                <dd className="text-site-text">Sedang dikemas</dd>
              </div>
            </dl>
          </div>

          <p className="text-xs text-site-gray mt-6">
            Kamu akan menerima notifikasi update status pengiriman.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link href={`/orders/${order.id}`} className="block">
              <Button fullWidth>Lacak Pesanan</Button>
            </Link>
            <Link href="/catalog" className="block">
              <Button variant="outline" fullWidth>
                Lanjut Belanja
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
