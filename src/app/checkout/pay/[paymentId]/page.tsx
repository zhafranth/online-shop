"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { paymentService } from "@/services/raja-ongkir";
import { usePaymentStore } from "@/stores/payment-store";
import { useOrderStore } from "@/stores/order-store";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { PaymentCountdown } from "@/components/checkout/payment-countdown";

export default function QrisPaymentPage({
  params,
}: {
  params: Promise<{ paymentId: string }>;
}) {
  const { paymentId } = use(params);
  const router = useRouter();
  const payment = usePaymentStore((s) => s.sessions[paymentId]);
  const [mounted, setMounted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const isDev =
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_PAYMENT_DEBUG === "true";

  useEffect(() => {
    setMounted(true);
    // Cart cleared here (after we've safely navigated) instead of in PaymentReview,
    // so the empty-cart redirect on /checkout can't race with the push and bounce
    // the user back to /cart.
    useCartStore.getState().clearCart();
  }, []);

  // Polling status — simulates webhook check
  useEffect(() => {
    if (!payment || payment.status !== "PENDING") return;
    const id = setInterval(() => {
      paymentService.getStatus(paymentId).then((res) => {
        if (res.data.status === "PAID") {
          const order = useOrderStore
            .getState()
            .orders.find((o) => o.paymentId === paymentId);
          if (order) {
            router.replace(`/orders/${order.id}/success`);
          }
        }
      });
    }, 1500);
    return () => clearInterval(id);
  }, [payment, paymentId, router]);

  // Auto-redirect if already PAID on mount
  useEffect(() => {
    if (payment?.status === "PAID") {
      const order = useOrderStore
        .getState()
        .orders.find((o) => o.paymentId === paymentId);
      if (order) router.replace(`/orders/${order.id}/success`);
    }
  }, [payment?.status, paymentId, router]);

  const handleSimulatePaid = async () => {
    await paymentService.simulatePaid?.(paymentId);
  };

  const handleSimulateExpired = async () => {
    await paymentService.simulateExpired?.(paymentId);
  };

  const handleExpireFromCountdown = () => {
    if (payment?.status === "PENDING") {
      void paymentService.simulateExpired?.(paymentId);
    }
  };

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

  if (!payment) {
    return (
      <div className="min-h-screen pt-[72px]">
        <Navbar />
        <div className="container-site py-20 text-center">
          <h2 className="font-serif text-2xl mb-3">Sesi pembayaran tidak ditemukan</h2>
          <p className="text-site-gray mb-6">
            Link pembayaran mungkin sudah kadaluarsa atau tidak valid.
          </p>
          <Link href="/cart">
            <Button>Kembali ke Keranjang</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (payment.status === "EXPIRED") {
    return (
      <div className="min-h-screen pt-[72px]">
        <Navbar />
        <div className="container-site py-20 text-center max-w-xl mx-auto">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#fef2f2] flex items-center justify-center text-3xl text-[#b91c1c]">
            ⏱
          </div>
          <h2 className="font-serif text-2xl mb-3">Pembayaran Kadaluarsa</h2>
          <p className="text-site-gray mb-6">
            Sesi pembayaran sudah lewat batas waktu. Silakan order ulang.
          </p>
          <Link href="/catalog">
            <Button>Order Ulang</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (payment.status === "CANCELLED") {
    return (
      <div className="min-h-screen pt-[72px]">
        <Navbar />
        <div className="container-site py-20 text-center max-w-xl mx-auto">
          <h2 className="font-serif text-2xl mb-3">Pembayaran Dibatalkan</h2>
          <Link href="/cart">
            <Button>Kembali ke Keranjang</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[72px] animate-fade-up bg-cream">
      <Navbar />
      <div className="container-site py-8 md:py-12">
        <div className="max-w-xl mx-auto bg-white border-[1.5px] border-site-border">
          <div className="px-5 py-4 bg-navy text-white">
            <h2 className="font-serif text-xl">Bayar via QRIS</h2>
            <p className="text-xs text-white/70 mt-0.5">
              Order ref: {payment.reference_id}
            </p>
          </div>
          <div className="p-6 md:p-8 text-center space-y-5">
            <div>
              <div className="text-xs text-site-gray uppercase tracking-[0.12em] mb-1">
                Total Bayar
              </div>
              <div className="font-serif text-3xl font-semibold text-navy">
                {formatPrice(payment.amount)}
              </div>
            </div>

            <div className="flex justify-center">
              <div className="p-4 bg-white border-[1.5px] border-site-border inline-block">
                <QRCodeSVG
                  value={payment.qris_string}
                  size={220}
                  level="M"
                  marginSize={2}
                />
                <div className="text-[10px] text-site-gray mt-2 uppercase tracking-[0.1em]">
                  QRIS · Dummy
                </div>
              </div>
            </div>

            <p className="text-xs text-site-gray">
              Scan dengan: DANA · OVO · GoPay · ShopeePay · BCA Mobile · LinkAja
            </p>

            <div className="bg-cream py-3 px-4 inline-flex flex-col items-center gap-1">
              <div className="text-[10px] uppercase tracking-[0.12em] text-site-gray">
                Bayar sebelum
              </div>
              <PaymentCountdown
                expiredAt={payment.expired_at}
                onExpire={handleExpireFromCountdown}
              />
            </div>

            <button
              type="button"
              onClick={() => setShowInstructions((v) => !v)}
              className="text-xs text-site-gray underline mx-auto"
            >
              {showInstructions ? "Sembunyikan" : "Lihat"} instruksi
              pembayaran
            </button>

            {showInstructions && (
              <ol className="text-left text-sm text-site-gray-dark space-y-2 bg-cream p-4 border border-site-border">
                <li>1. Buka aplikasi e-wallet/m-banking favoritmu.</li>
                <li>2. Pilih menu &ldquo;Scan QR&rdquo; atau &ldquo;QRIS&rdquo;.</li>
                <li>3. Arahkan kamera ke QR code di atas.</li>
                <li>
                  4. Periksa nominal pembayaran sesuai{" "}
                  <strong>{formatPrice(payment.amount)}</strong> lalu konfirmasi.
                </li>
                <li>5. Status akan otomatis terupdate setelah pembayaran berhasil.</li>
              </ol>
            )}

            {isDev && paymentService.simulatePaid && (
              <div className="border-t border-dashed border-site-border pt-4 space-y-2.5">
                <p className="text-[11px] uppercase tracking-[0.12em] text-site-gray">
                  🔧 Dev Tools (Dummy Mode)
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    fullWidth
                    onClick={handleSimulatePaid}
                    className="text-xs"
                  >
                    Simulasi Pembayaran Sukses
                  </Button>
                  <Button
                    fullWidth
                    variant="outline"
                    onClick={handleSimulateExpired}
                    className="text-xs"
                  >
                    Simulasi Expired
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
