"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useOrderStore } from "@/stores/order-store";
import { OrderStatus } from "@/types/admin";
import { DataTable } from "@/components/admin/data-table";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { formatPrice } from "@/lib/utils";

const STATUS_FILTERS: { value: "all" | OrderStatus; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AdminOrdersPage() {
  const orders = useOrderStore((s) => s.orders);
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");

  const filtered = useMemo(() => {
    const list = filter === "all" ? orders : orders.filter((o) => o.status === filter);
    return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, filter]);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  return (
    <>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-serif text-[28px] font-semibold text-navy">Order</h2>
          <p className="text-sm text-site-gray">Kelola dan perbarui status order</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as "all" | OrderStatus)}
          className="px-4 py-2.5 border-[1.5px] border-site-border bg-white text-sm font-medium text-site-text outline-none focus:border-navy"
        >
          {STATUS_FILTERS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
      </div>

      <DataTable
        headers={["Order ID", "Customer", "Tanggal", "Total", "Status", "Aksi"]}
        isEmpty={filtered.length === 0}
        empty="Belum ada order"
      >
        {filtered.map((o) => (
          <tr key={o.id} className="border-b border-site-border/70 last:border-0 hover:bg-cream/40">
            <td className="px-5 py-3 font-mono text-[12px] text-site-text">{o.id}</td>
            <td className="px-5 py-3 text-site-text">{o.userName}</td>
            <td className="px-5 py-3 text-site-gray-dark text-[13px]">{fmtDate(o.createdAt)}</td>
            <td className="px-5 py-3 text-site-text">{formatPrice(o.total)}</td>
            <td className="px-5 py-3"><OrderStatusBadge status={o.status} /></td>
            <td className="px-5 py-3">
              <Link href={`/admin/orders/${o.id}`} className="text-[12px] tracking-[0.08em] uppercase text-gold hover:underline">
                Lihat detail →
              </Link>
            </td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}
