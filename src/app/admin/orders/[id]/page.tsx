"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useOrderStore } from "@/stores/order-store";
import { useProductStore } from "@/stores/product-store";
import { OrderStatus } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { formatPrice } from "@/lib/utils";

const STATUSES: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];
const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const order = useOrderStore((s) => s.getById(id));
  const updateStatus = useOrderStore((s) => s.updateStatus);
  const getProduct = useProductStore((s) => s.getById);
  const [nextStatus, setNextStatus] = useState<OrderStatus | null>(null);
  const [confirm, setConfirm] = useState(false);

  if (!order) {
    return (
      <div className="bg-white border border-site-border p-7">
        <p className="text-site-gray-dark mb-4">Order tidak ditemukan.</p>
        <button onClick={() => router.push("/admin/orders")} className="text-gold underline">
          Kembali ke daftar order
        </button>
      </div>
    );
  }

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const askChange = () => {
    if (nextStatus && nextStatus !== order.status) setConfirm(true);
  };

  const apply = () => {
    if (nextStatus) updateStatus(order.id, nextStatus);
    setConfirm(false);
    setNextStatus(null);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <nav className="flex items-center gap-2 text-[13px] text-site-gray">
        <Link href="/admin/orders" className="hover:text-navy">Orders</Link>
        <ChevronRight size={14} />
        <span className="text-site-text font-mono">{order.id}</span>
      </nav>

      <div className="flex items-center gap-4">
        <h2 className="font-serif text-[28px] font-semibold text-navy">Detail {order.id}</h2>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-site-border p-6">
            <h3 className="text-[11px] font-semibold tracking-[0.12em] uppercase text-site-gray mb-3">Customer</h3>
            <p className="text-site-text font-medium">{order.userName}</p>
            <p className="text-sm text-site-gray-dark">{order.userEmail}</p>
            <p className="text-sm text-site-gray-dark mt-2">{order.shippingAddress}</p>
          </div>

          <div className="bg-white border border-site-border">
            <div className="px-6 py-4 border-b border-site-border">
              <h3 className="text-[11px] font-semibold tracking-[0.12em] uppercase text-site-gray">Items</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream/60 border-b border-site-border">
                  <th className="text-left px-6 py-2.5 text-[10px] font-semibold tracking-[0.1em] uppercase text-site-gray">Produk</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold tracking-[0.1em] uppercase text-site-gray">Size</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold tracking-[0.1em] uppercase text-site-gray">Warna</th>
                  <th className="text-right px-4 py-2.5 text-[10px] font-semibold tracking-[0.1em] uppercase text-site-gray">Qty</th>
                  <th className="text-right px-4 py-2.5 text-[10px] font-semibold tracking-[0.1em] uppercase text-site-gray">Harga</th>
                  <th className="text-right px-6 py-2.5 text-[10px] font-semibold tracking-[0.1em] uppercase text-site-gray">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((it, i) => {
                  const product = getProduct(it.productId);
                  return (
                    <tr key={i} className="border-b border-site-border/60 last:border-0">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          {product && <img src={product.image} alt={it.productName} className="w-10 h-10 object-cover bg-cream" />}
                          <span className="text-site-text">{it.productName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-site-gray-dark">{it.size}</td>
                      <td className="px-4 py-3 text-site-gray-dark">{it.color}</td>
                      <td className="px-4 py-3 text-right text-site-text">{it.qty}</td>
                      <td className="px-4 py-3 text-right text-site-text">{formatPrice(it.price)}</td>
                      <td className="px-6 py-3 text-right text-site-text">{formatPrice(it.price * it.qty)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="bg-white border border-site-border p-6">
            <h3 className="text-[11px] font-semibold tracking-[0.12em] uppercase text-site-gray mb-4">Ringkasan</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-site-gray-dark">Subtotal</dt><dd className="text-site-text">{formatPrice(order.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-site-gray-dark">Pengiriman</dt><dd className="text-site-text">{formatPrice(order.shipping)}</dd></div>
              <div className="flex justify-between pt-2 mt-2 border-t border-site-border">
                <dt className="font-semibold text-site-text">Total</dt>
                <dd className="font-serif text-[20px] font-semibold text-navy">{formatPrice(order.total)}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white border border-site-border p-6">
            <h3 className="text-[11px] font-semibold tracking-[0.12em] uppercase text-site-gray mb-3">Pembayaran</h3>
            <p className="text-site-text font-medium">{order.paymentMethod.toUpperCase()}</p>
            <p className="text-sm text-site-gray-dark mt-1">Dibuat {fmtDate(order.createdAt)}</p>
          </div>

          <div className="bg-white border border-site-border p-6">
            <h3 className="text-[11px] font-semibold tracking-[0.12em] uppercase text-site-gray mb-3">Update Status</h3>
            <select
              value={nextStatus ?? order.status}
              onChange={(e) => setNextStatus(e.target.value as OrderStatus)}
              className="w-full px-4 py-3 border-[1.5px] border-site-border bg-white text-sm text-site-text outline-none focus:border-navy mb-3"
            >
              {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
            </select>
            <Button fullWidth onClick={askChange} disabled={!nextStatus || nextStatus === order.status}>
              Update Status
            </Button>
          </div>
        </aside>
      </div>

      <ConfirmModal
        open={confirm}
        title="Ubah Status Order"
        message={`Yakin ingin mengubah status ${order.id} menjadi "${nextStatus ? STATUS_LABEL[nextStatus] : ""}"?`}
        confirmLabel="Ubah"
        onConfirm={apply}
        onCancel={() => setConfirm(false)}
      />
    </div>
  );
}
