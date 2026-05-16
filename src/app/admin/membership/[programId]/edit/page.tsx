"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { MembershipForm } from "@/components/admin/membership-form";
import { useMembershipStore } from "@/stores/membership-store";
import { MEMBERSHIP_PROGRAM_IDS } from "@/types/membership";

export default function EditMembershipProgramPage({
  params,
}: {
  params: Promise<{ programId: string }>;
}) {
  const { programId } = use(params);
  const router = useRouter();
  const program = useMembershipStore((s) =>
    s.programs.find((p) => p.id === programId),
  );

  const isValidId = (MEMBERSHIP_PROGRAM_IDS as string[]).includes(programId);

  if (!isValidId || !program) {
    return (
      <div className="bg-white border border-site-border p-7">
        <p className="text-site-gray-dark mb-4">Program tidak ditemukan.</p>
        <button
          onClick={() => router.push("/admin/membership")}
          className="text-navy underline text-sm"
        >
          Kembali ke daftar program
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Link
        href="/admin/membership"
        className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.12em] uppercase text-site-gray hover:text-navy"
      >
        <ChevronLeft size={14} strokeWidth={2} />
        Kembali ke Membership
      </Link>
      <div>
        <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray mb-1">
          Edit · /{program.id}
        </div>
        <h2 className="font-serif text-[34px] leading-tight text-navy">
          {program.title}{" "}
          <span className="italic text-site-gray-dark/80">
            {program.titleAccent}
          </span>
        </h2>
      </div>
      <MembershipForm program={program} />
    </div>
  );
}
