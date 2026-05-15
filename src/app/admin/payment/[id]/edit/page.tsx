"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useAdminPaymentStore } from "@/stores/admin-payment-store";
import { PaymentMethodForm } from "@/components/admin/payment-method-form";

export default function EditPaymentMethodPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const method = useAdminPaymentStore((s) => s.getById(id));

  if (!method) {
    return (
      <div className="bg-white border border-site-border p-7">
        <p className="text-site-gray-dark mb-4">Metode pembayaran tidak ditemukan.</p>
        <button
          onClick={() => router.push("/admin/payment")}
          className="text-navy underline text-sm"
        >
          Kembali ke daftar metode
        </button>
      </div>
    );
  }

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
          Edit · /{method.id}
        </div>
        <h2 className="font-serif text-[34px] leading-tight text-navy">
          {method.label}
        </h2>
      </div>
      <PaymentMethodForm mode="edit" method={method} />
    </div>
  );
}
