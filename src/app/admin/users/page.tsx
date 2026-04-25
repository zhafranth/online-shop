"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useUserStore } from "@/stores/user-store";
import { DataTable } from "@/components/admin/data-table";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { formatPrice } from "@/lib/utils";

export default function AdminUsersPage() {
  const users = useUserStore((s) => s.users);
  const deleteUser = useUserStore((s) => s.deleteUser);
  const [toDelete, setToDelete] = useState<{ id: number; name: string } | null>(null);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  const confirmDelete = () => {
    if (toDelete) {
      deleteUser(toDelete.id);
      setToDelete(null);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="font-serif text-[28px] font-semibold text-navy">Pengguna</h2>
        <p className="text-sm text-site-gray">Kelola data pelanggan terdaftar</p>
      </div>

      <DataTable
        headers={["Nama", "Email", "Telepon", "Bergabung", "Total Order", "Total Belanja", "Aksi"]}
        isEmpty={users.length === 0}
        empty="Belum ada user"
      >
        {users.map((u) => (
          <tr key={u.id} className="border-b border-site-border/70 last:border-0 hover:bg-cream/40">
            <td className="px-5 py-3 text-site-text">{u.name}</td>
            <td className="px-5 py-3 text-site-gray-dark">{u.email}</td>
            <td className="px-5 py-3 text-site-gray-dark">{u.phone}</td>
            <td className="px-5 py-3 text-site-gray-dark text-[13px]">{fmtDate(u.joinedAt)}</td>
            <td className="px-5 py-3 text-site-text">{u.totalOrders}</td>
            <td className="px-5 py-3 text-site-text">{formatPrice(u.totalSpent)}</td>
            <td className="px-5 py-3">
              <button
                onClick={() => setToDelete({ id: u.id, name: u.name })}
                className="p-2 text-[#b91c1c] hover:bg-[#fee2e2] rounded-sm"
                aria-label="Delete"
              >
                <Trash2 size={15} />
              </button>
            </td>
          </tr>
        ))}
      </DataTable>

      <ConfirmModal
        open={toDelete !== null}
        title="Hapus User"
        message={`Yakin ingin menghapus user "${toDelete?.name}"? Aksi ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
