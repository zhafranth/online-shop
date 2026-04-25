"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useProductStore } from "@/stores/product-store";
import { ProductForm } from "@/components/admin/product-form";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const product = useProductStore((s) => s.getById(Number(id)));

  if (!product) {
    return (
      <div className="bg-white border border-site-border p-7">
        <p className="text-site-gray-dark mb-4">Produk tidak ditemukan.</p>
        <button onClick={() => router.push("/admin/products")} className="text-gold underline">
          Kembali ke daftar produk
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-serif text-[28px] font-semibold text-navy">Edit Produk</h2>
      <ProductForm mode="edit" product={product} />
    </div>
  );
}
