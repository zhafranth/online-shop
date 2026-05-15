"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart-store";
import { useShippingStore } from "@/stores/shipping-store";
import { Navbar } from "@/components/layout/navbar";
import { Toast } from "@/components/ui/toast";
import { StepBar } from "@/components/ui/step-bar";
import { CheckoutAddress } from "@/components/checkout/checkout-address";
import { CourierOptions } from "@/components/checkout/courier-options";
import { PaymentReview } from "@/components/checkout/payment-review";
import { CheckoutSummary } from "@/components/checkout/checkout-summary";

type CheckoutStep = "address" | "courier" | "payment";

const STEP_ORDER: CheckoutStep[] = ["address", "courier", "payment"];

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const totalWeight = useCartStore((s) => s.totalWeight());
  const address = useShippingStore((s) => s.address);
  const shippingOption = useShippingStore((s) => s.selectedOption);

  const [step, setStep] = useState<CheckoutStep>("address");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && items.length === 0) {
      router.replace("/cart");
    }
  }, [mounted, items.length, router]);

  const stepIndex = STEP_ORDER.indexOf(step);

  const stepsForBar = [
    { label: "Keranjang", status: "done" as const },
    {
      label: "Alamat",
      status:
        step === "address"
          ? ("active" as const)
          : stepIndex > 0
            ? ("done" as const)
            : ("pending" as const),
    },
    {
      label: "Kurir",
      status:
        step === "courier"
          ? ("active" as const)
          : stepIndex > 1
            ? ("done" as const)
            : ("pending" as const),
    },
    {
      label: "Pembayaran",
      status: step === "payment" ? ("active" as const) : ("pending" as const),
    },
  ];

  if (!mounted) return null;
  if (items.length === 0) return null;

  return (
    <div className="min-h-screen pt-[72px] animate-fade-up">
      <Navbar />
      <div className="bg-cream py-5 md:py-6 border-b border-site-border">
        <div className="container-site flex items-center justify-between gap-3 flex-wrap">
          <h1 className="font-serif font-normal text-2xl md:text-[28px]">
            Checkout
          </h1>
          <div className="text-xs text-site-gray flex items-center gap-1.5">
            <span>🔒</span>
            <span className="hidden sm:inline">
              Pembayaran Aman & Terenkripsi
            </span>
            <span className="sm:hidden">Aman & Terenkripsi</span>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-site-border py-4 overflow-x-auto">
        <div className="container-site">
          <div className="max-w-[560px] min-w-[400px]">
            <StepBar steps={stepsForBar} />
          </div>
        </div>
      </div>

      <div className="container-site py-6 md:py-10 pb-12 md:pb-[60px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-12">
          <div className="space-y-5">
            {step === "address" && (
              <CheckoutAddress onSubmit={() => setStep("courier")} />
            )}
            {step === "courier" && (
              <CourierOptions
                onBack={() => setStep("address")}
                onSubmit={() => setStep("payment")}
              />
            )}
            {step === "payment" && (
              <PaymentReview onBack={() => setStep("courier")} />
            )}
          </div>
          <div className="order-first lg:order-none">
            <CheckoutSummary
              items={items}
              subtotal={subtotal}
              totalWeight={totalWeight}
              address={address}
              shippingOption={shippingOption}
            />
          </div>
        </div>
      </div>
      <Toast />
    </div>
  );
}
