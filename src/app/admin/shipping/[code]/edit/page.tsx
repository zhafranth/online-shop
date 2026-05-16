"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useAdminShippingStore } from "@/stores/admin-shipping-store";
import { CourierForm } from "@/components/admin/courier-form";

export default function EditCourierPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const router = useRouter();
  const courier = useAdminShippingStore((s) => s.getByCode(code));

  if (!courier) {
    return (
      <div className="bg-white border border-site-border p-7">
        <p className="text-site-gray-dark mb-4">Kurir tidak ditemukan.</p>
        <button
          onClick={() => router.push("/admin/shipping")}
          className="text-navy underline text-sm"
        >
          Kembali ke daftar kurir
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Link
        href="/admin/shipping"
        className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.12em] uppercase text-site-gray hover:text-navy"
      >
        <ChevronLeft size={14} strokeWidth={2} />
        Kembali ke Pengiriman
      </Link>
      <div>
        <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray mb-1">
          Edit · /{courier.code}
        </div>
        <h2 className="font-serif text-[34px] leading-tight text-navy">
          {courier.label}
        </h2>
      </div>
      <CourierForm mode="edit" courier={courier} />
    </div>
  );
}
