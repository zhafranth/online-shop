"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useAdminTeamStore } from "@/stores/admin-team-store";
import { AdminMemberForm } from "@/components/admin/admin-member-form";

export default function EditAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const member = useAdminTeamStore((s) => s.getById(id));

  if (!member) {
    return (
      <div className="bg-white border border-site-border p-7">
        <p className="text-site-gray-dark mb-4">Anggota tidak ditemukan.</p>
        <button
          onClick={() => router.push("/admin/admins")}
          className="text-navy underline text-sm"
        >
          Kembali ke daftar admin
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Link
        href="/admin/admins"
        className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.12em] uppercase text-site-gray hover:text-navy"
      >
        <ChevronLeft size={14} strokeWidth={2} />
        Kembali ke Tim Admin
      </Link>
      <div>
        <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray mb-1">
          Edit · {member.email}
        </div>
        <h2 className="font-serif text-[34px] leading-tight text-navy">
          {member.name}
        </h2>
      </div>
      <AdminMemberForm mode="edit" member={member} />
    </div>
  );
}
