"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useOrderStore } from "@/stores/order-store";
import { shippingService } from "@/services/raja-ongkir";
import { deriveManifest, deriveStatus } from "@/lib/dummy/status-simulator";
import { formatPrice } from "@/lib/utils";
import type {
  OrderShippingStatus,
  TrackingManifest,
} from "@/types/raja-ongkir";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { TrackingTimeline } from "@/components/tracking/tracking-timeline";

const STATUS_BADGE: Record<OrderShippingStatus, string> = {
  Packing: "bg-cream text-site-gray-dark border-site-border",
  Dijemput: "bg-[#fef3c7] text-[#92400e] border-[#fde68a]",
  Dikirim: "bg-[#dbeafe] text-[#1e40af] border-[#bfdbfe]",
  Selesai: "bg-[#d1fae5] text-[#065f46] border-[#a7f3d0]",
  Dibatalkan: "bg-[#fee2e2] text-[#991b1b] border-[#fecaca]",
};

export default function OrderTrackingPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const order = useOrderStore((s) => s.getById(orderId));
  const [mounted, setMounted] = useState(false);
  const [manifest, setManifest] = useState<TrackingManifest[]>([]);
  const [status, setStatus] = useState<OrderShippingStatus>("Packing");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!order?.paidAt) return;

    const update = () => {
      const paidAt = order.paidAt!;
      setManifest(deriveManifest(paidAt));
      setStatus(deriveStatus(paidAt));
    };

    update();
    const id = setInterval(() => {
      const paidAt = order.paidAt!;
      const currentStatus = deriveStatus(paidAt);
      setManifest(deriveManifest(paidAt));
      setStatus(currentStatus);
      if (currentStatus === "Selesai") clearInterval(id);
    }, 1000);

    return () => clearInterval(id);
  }, [order?.paidAt]);

  // Sync tracking back to order store on status change so admin & summary stay updated
  useEffect(() => {
    if (!order?.paidAt) return;
    shippingService
      .getTrackingManifest({ orderId: order.id, paidAt: order.paidAt })
      .then((res) => {
        useOrderStore.setState((state) => ({
          orders: state.orders.map((o) =>
            o.id === order.id
              ? {
                  ...o,
                  shippingStatus: res.data.status,
                  manifest: res.data.manifest,
                  status:
                    res.data.status === "Selesai"
                      ? "delivered"
                      : res.data.status === "Dikirim"
                        ? "shipped"
                        : res.data.status === "Dijemput"
                          ? "shipped"
                          : o.status,
                }
              : o,
          ),
        }));
      });
  }, [status, order?.paidAt, order?.id]);

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

  const courier = order.shippingDetails;

  return (
    <div className="min-h-screen pt-[72px] animate-fade-up">
      <Navbar />
      <div className="bg-cream py-5 md:py-6 border-b border-site-border">
        <div className="container-site flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="font-serif font-normal text-2xl md:text-[28px]">
              Lacak Pesanan
            </h1>
            <p className="text-xs text-site-gray font-mono mt-0.5">{order.id}</p>
          </div>
          <span
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold border ${STATUS_BADGE[status]}`}
          >
            {status}
          </span>
        </div>
      </div>

      <div className="container-site py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-12">
          <div className="space-y-5">
            <section className="bg-white border-[1.5px] border-site-border">
              <div className="px-5 py-4 border-b border-site-border">
                <h3 className="text-[11px] font-semibold tracking-[0.12em] uppercase text-site-gray">
                  Riwayat Pengiriman
                </h3>
                {order.awb && (
                  <p className="text-sm mt-1">
                    AWB:{" "}
                    <span className="font-mono font-semibold">
                      {order.awb}
                    </span>
                    {courier && (
                      <span className="text-site-gray">
                        {" "}
                        · {courier.courierName} ({courier.service})
                      </span>
                    )}
                  </p>
                )}
              </div>
              <div className="p-5 sm:p-6">
                {order.paidAt ? (
                  <TrackingTimeline manifest={manifest} />
                ) : (
                  <p className="text-sm text-site-gray">
                    Menunggu konfirmasi pembayaran…
                  </p>
                )}
              </div>
            </section>

            <section className="bg-white border-[1.5px] border-site-border">
              <div className="px-5 py-4 border-b border-site-border">
                <h3 className="text-[11px] font-semibold tracking-[0.12em] uppercase text-site-gray">
                  Item Pesanan
                </h3>
              </div>
              <ul className="divide-y divide-site-border">
                {order.items.map((it, i) => (
                  <li
                    key={i}
                    className="px-5 py-3 flex justify-between text-sm gap-3"
                  >
                    <div>
                      <div className="text-site-text">{it.productName}</div>
                      <div className="text-xs text-site-gray">
                        {it.size} · {it.color} · ×{it.qty}
                      </div>
                    </div>
                    <div className="text-site-text font-medium">
                      {formatPrice(it.price * it.qty)}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="space-y-5">
            <section className="bg-white border-[1.5px] border-site-border p-5">
              <h3 className="text-[11px] font-semibold tracking-[0.12em] uppercase text-site-gray mb-3">
                Ringkasan
              </h3>
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-site-gray">Subtotal</dt>
                  <dd>{formatPrice(order.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-site-gray">Ongkir</dt>
                  <dd>{formatPrice(order.shipping)}</dd>
                </div>
                <div className="flex justify-between pt-2 mt-2 border-t border-site-border">
                  <dt className="font-semibold">Total</dt>
                  <dd className="font-serif text-lg font-semibold text-navy">
                    {formatPrice(order.total)}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="bg-white border-[1.5px] border-site-border p-5">
              <h3 className="text-[11px] font-semibold tracking-[0.12em] uppercase text-site-gray mb-3">
                Alamat Pengiriman
              </h3>
              <div className="text-sm text-site-gray-dark leading-relaxed">
                <div className="font-semibold text-site-text">
                  {courier?.address.recipientName ?? order.userName}
                </div>
                {courier?.address.phone && (
                  <div className="text-xs text-site-gray">
                    {courier.address.phone}
                  </div>
                )}
                <div className="mt-1">{order.shippingAddress}</div>
              </div>
            </section>

            <Link href="/catalog">
              <Button variant="outline" fullWidth>
                Belanja Lagi
              </Button>
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
