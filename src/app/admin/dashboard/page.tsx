"use client";

import Link from "next/link";
import { Package, ShoppingBag, Users, DollarSign, AlertTriangle, Clock } from "lucide-react";
import { useProductStore } from "@/stores/product-store";
import { useOrderStore } from "@/stores/order-store";
import { useUserStore } from "@/stores/user-store";
import { StatCard } from "@/components/admin/stat-card";
import { SalesChart } from "@/components/admin/sales-chart";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboardPage() {
  const products = useProductStore((s) => s.products);
  const orders = useOrderStore((s) => s.orders);
  const users = useUserStore((s) => s.users);

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalUsers = users.length;
  const revenue = orders.filter((o) => o.status === "delivered").reduce((sum, o) => sum + o.total, 0);
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const lowStock = products.filter((p) => p.stock < 10).sort((a, b) => a.stock - b.stock);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        <StatCard label="Total Produk" value={totalProducts} icon={Package} accent="navy" />
        <StatCard label="Total Order" value={totalOrders} icon={ShoppingBag} accent="navy" />
        <StatCard label="Total User" value={totalUsers} icon={Users} accent="navy" />
        <StatCard label="Revenue" value={formatPrice(revenue)} icon={DollarSign} accent="gold" />
        <StatCard label="Out of Stock" value={outOfStock} icon={AlertTriangle} accent="red" />
        <StatCard label="Pending Orders" value={pendingOrders} icon={Clock} accent="gold" />
      </div>

      <SalesChart />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white border border-site-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-[20px] font-semibold text-navy">Recent Orders</h3>
            <Link href="/admin/orders" className="text-[12px] tracking-[0.08em] uppercase text-gold hover:underline">
              View all →
            </Link>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-site-border">
                <th className="text-left py-2.5 text-[10px] font-semibold tracking-[0.1em] uppercase text-site-gray">ID</th>
                <th className="text-left py-2.5 text-[10px] font-semibold tracking-[0.1em] uppercase text-site-gray">Customer</th>
                <th className="text-right py-2.5 text-[10px] font-semibold tracking-[0.1em] uppercase text-site-gray">Total</th>
                <th className="text-left py-2.5 text-[10px] font-semibold tracking-[0.1em] uppercase text-site-gray pl-4">Status</th>
                <th className="text-right py-2.5 text-[10px] font-semibold tracking-[0.1em] uppercase text-site-gray">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-site-border/60 last:border-0">
                  <td className="py-3 font-mono text-[12px] text-site-text">{o.id}</td>
                  <td className="py-3 text-site-text">{o.userName}</td>
                  <td className="py-3 text-right text-site-text">{formatPrice(o.total)}</td>
                  <td className="py-3 pl-4"><OrderStatusBadge status={o.status} /></td>
                  <td className="py-3 text-right text-site-gray text-[12px]">{fmtDate(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="bg-white border border-site-border p-6">
          <h3 className="font-serif text-[20px] font-semibold text-navy mb-4">Low Stock Products</h3>
          {lowStock.length === 0 ? (
            <p className="text-sm text-site-gray">Tidak ada produk dengan stok rendah.</p>
          ) : (
            <ul className="divide-y divide-site-border">
              {lowStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-site-text">{p.name}</p>
                    <p className="text-[12px] text-site-gray">
                      Stok: <span className={p.stock === 0 ? "text-[#b91c1c] font-semibold" : "text-site-gray-dark"}>{p.stock}</span>
                    </p>
                  </div>
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="text-[12px] tracking-[0.08em] uppercase text-gold hover:underline"
                  >
                    Edit
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
