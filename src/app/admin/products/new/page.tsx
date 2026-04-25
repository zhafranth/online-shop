"use client";

import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div className="space-y-4">
      <h2 className="font-serif text-[28px] font-semibold text-navy">Tambah Produk</h2>
      <ProductForm mode="create" />
    </div>
  );
}
