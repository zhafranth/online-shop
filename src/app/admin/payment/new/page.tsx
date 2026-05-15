"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PaymentMethodForm } from "@/components/admin/payment-method-form";

export default function NewPaymentMethodPage() {
  return (
    <div className="space-y-5">
      <Link
        href="/admin/payment"
        className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.12em] uppercase text-site-gray hover:text-navy"
      >
        <ChevronLeft size={14} strokeWidth={2} />
        Kembali ke Metode Pembayaran
      </Link>
      <div>
        <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray mb-1">
          New Entry
        </div>
        <h2 className="font-serif text-[34px] leading-tight text-navy">
          Tambah Metode Pembayaran
        </h2>
      </div>
      <PaymentMethodForm mode="create" />
    </div>
  );
}
