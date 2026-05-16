"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useAdminPromoStore } from "@/stores/admin-promo-store";
import { PromoForm } from "@/components/admin/promo-form";

export default function EditPromoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const promo = useAdminPromoStore((s) => s.getById(id));

  if (!promo) {
    return (
      <div className="bg-white border border-site-border p-7">
        <p className="text-site-gray-dark mb-4">Promo tidak ditemukan.</p>
        <button
          onClick={() => router.push("/admin/promo")}
          className="text-navy underline text-sm"
        >
          Kembali ke daftar promo
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Link
        href="/admin/promo"
        className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.12em] uppercase text-site-gray hover:text-navy"
      >
        <ChevronLeft size={14} strokeWidth={2} />
        Kembali ke Promo
      </Link>
      <div>
        <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray mb-1">
          Edit · {promo.code}
        </div>
        <h2 className="font-serif text-[34px] leading-tight text-navy">
          {promo.label}
        </h2>
      </div>
      <PromoForm mode="edit" promo={promo} />
    </div>
  );
}
