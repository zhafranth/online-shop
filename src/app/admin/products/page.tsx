"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useProductStore } from "@/stores/product-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/admin/data-table";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  const products = useProductStore((s) => s.products);
  const deleteProduct = useProductStore((s) => s.deleteProduct);
  const [toDelete, setToDelete] = useState<{ id: number; name: string } | null>(null);

  const confirmDelete = () => {
    if (toDelete) {
      deleteProduct(toDelete.id);
      setToDelete(null);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-[28px] font-semibold text-navy">Produk</h2>
          <p className="text-sm text-site-gray">Kelola seluruh katalog VESTIRE</p>
        </div>
        <Link href="/admin/products/new">
          <Button variant="primary" className="flex items-center gap-2">
            <Plus size={16} />
            Tambah Produk
          </Button>
        </Link>
      </div>

      <DataTable
        headers={["Image", "Nama", "Kategori", "Harga", "Stock", "Badge", "Aksi"]}
        isEmpty={products.length === 0}
        empty="Belum ada produk"
      >
        {products.map((p) => (
          <tr key={p.id} className="border-b border-site-border/70 last:border-0 hover:bg-cream/40">
            <td className="px-5 py-3">
              <img src={p.image} alt={p.name} className="w-10 h-10 object-cover bg-cream" />
            </td>
            <td className="px-5 py-3 text-site-text">{p.name}</td>
            <td className="px-5 py-3 text-site-gray-dark">{p.category}</td>
            <td className="px-5 py-3 text-site-text">{formatPrice(p.price)}</td>
            <td className="px-5 py-3">
              <span className={p.stock === 0 ? "text-[#b91c1c] font-semibold" : "text-site-text"}>
                {p.stock}
              </span>
            </td>
            <td className="px-5 py-3">
              {p.badge ? <Badge>{p.badge}</Badge> : <span className="text-site-gray text-xs">—</span>}
            </td>
            <td className="px-5 py-3">
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/products/${p.id}/edit`}
                  className="p-2 text-navy hover:bg-cream rounded-sm"
                  aria-label="Edit"
                >
                  <Pencil size={15} />
                </Link>
                <button
                  onClick={() => setToDelete({ id: p.id, name: p.name })}
                  className="p-2 text-[#b91c1c] hover:bg-[#fee2e2] rounded-sm"
                  aria-label="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      <ConfirmModal
        open={toDelete !== null}
        title="Hapus Produk"
        message={`Yakin ingin menghapus "${toDelete?.name}"? Aksi ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
