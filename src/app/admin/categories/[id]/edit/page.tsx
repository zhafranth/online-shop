"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useCategoryStore } from "@/stores/category-store";
import { CategoryForm } from "@/components/admin/category-form";

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const category = useCategoryStore((s) => s.getById(id));

  if (!category) {
    return (
      <div className="bg-white border border-site-border p-7">
        <p className="text-site-gray-dark mb-4">Kategori tidak ditemukan.</p>
        <button
          onClick={() => router.push("/admin/categories")}
          className="text-navy underline text-sm"
        >
          Kembali ke daftar kategori
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Link
        href="/admin/categories"
        className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.12em] uppercase text-site-gray hover:text-navy"
      >
        <ChevronLeft size={14} strokeWidth={2} />
        Kembali ke Kategori
      </Link>
      <div>
        <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray mb-1">
          Edit · /{category.slug}
        </div>
        <h2 className="font-serif text-[34px] leading-tight text-navy">
          {category.label}
        </h2>
      </div>
      <CategoryForm mode="edit" category={category} />
    </div>
  );
}
