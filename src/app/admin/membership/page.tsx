"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Crown,
  Pencil,
  Sparkles,
} from "lucide-react";
import { useMembershipStore } from "@/stores/membership-store";
import {
  MEMBERSHIP_STATUS_LABEL,
  type MembershipStatus,
} from "@/types/membership";

const STATUS_TONE: Record<MembershipStatus, string> = {
  active: "border-[#166534] text-[#166534] bg-[#f0fdf4]",
  "coming-soon": "border-[#854d0e] text-[#854d0e] bg-[#fefce8]",
  inactive: "border-[#991b1b] text-[#991b1b] bg-[#fef2f2]",
};

export default function AdminMembershipPage() {
  const programs = useMembershipStore((s) => s.programs);

  const stats = useMemo(() => {
    const byStatus = programs.reduce<Record<MembershipStatus, number>>(
      (acc, p) => {
        acc[p.status] = (acc[p.status] ?? 0) + 1;
        return acc;
      },
      { active: 0, "coming-soon": 0, inactive: 0 },
    );
    return { total: programs.length, byStatus };
  }, [programs]);

  return (
    <div className="space-y-6">
      {/* ─── HEADER ─── */}
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3 text-[10px] tracking-[0.22em] uppercase text-site-gray">
            <span>Content</span>
            <span className="h-px w-6 bg-site-border" />
            <span className="font-mono normal-case tracking-tight">
              Partnership 01–{String(stats.total).padStart(2, "0")}
            </span>
          </div>
          <h2 className="font-serif text-[34px] leading-tight mt-2 text-navy">
            Membership
          </h2>
          <p className="text-[13px] text-site-gray mt-1.5 max-w-xl leading-relaxed">
            Tiga program kemitraan ThickApparel. Sunting konten hero, ubah
            status, dan kontrol visibilitas di navbar storefront tanpa edit
            kode.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase text-site-gray font-mono">
          <Sparkles size={13} strokeWidth={1.8} />
          <span>3 program fixed · tidak dapat ditambah</span>
        </div>
      </header>

      {/* ─── INSIGHT STRIP ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 bg-white border border-site-border">
        {[
          { k: "Total Program", v: String(stats.total).padStart(2, "0") },
          {
            k: "Aktif",
            v: String(stats.byStatus.active).padStart(2, "0"),
          },
          {
            k: "Coming Soon",
            v: String(stats.byStatus["coming-soon"]).padStart(2, "0"),
          },
          {
            k: "Nonaktif",
            v: String(stats.byStatus.inactive).padStart(2, "0"),
          },
        ].map((s, i) => (
          <div
            key={s.k}
            className={`px-6 py-5 ${i > 0 ? "md:border-l border-site-border" : ""}`}
          >
            <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray">
              {s.k}
            </div>
            <div className="font-serif text-[30px] leading-none mt-2 text-navy tabular-nums">
              {s.v}
            </div>
          </div>
        ))}
      </div>

      {/* ─── PROGRAM GRID ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {programs.map((p) => (
          <article
            key={p.id}
            className="bg-white border border-site-border flex flex-col overflow-hidden group"
          >
            <div className="relative aspect-[4/3] bg-cream overflow-hidden">
              {p.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={p.image}
                  alt={`${p.title} ${p.titleAccent}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="w-full h-full" />
              )}
              <span
                className={`absolute top-3 left-3 inline-flex items-center px-2 py-1 border-[1.5px] text-[10px] tracking-[0.14em] uppercase font-medium ${STATUS_TONE[p.status]}`}
              >
                {MEMBERSHIP_STATUS_LABEL[p.status]}
              </span>
              <Link
                href={`/membership/${p.id}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`Preview ${p.title} ${p.titleAccent}`}
                className="absolute top-3 right-3 p-1.5 bg-white/95 hover:bg-white text-navy rounded-sm border border-site-border"
              >
                <ArrowUpRight size={14} strokeWidth={1.8} />
              </Link>
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray flex items-center gap-2 mb-2">
                <Crown size={12} strokeWidth={1.8} />
                <span>{p.eyebrow}</span>
                <span className="font-mono normal-case tracking-tight text-site-gray-light">
                  /{p.id}
                </span>
              </div>
              <h3 className="font-serif text-[22px] leading-tight text-navy">
                {p.title}{" "}
                <span className="italic text-site-gray-dark/80">
                  {p.titleAccent}
                </span>
              </h3>
              <p className="text-[12.5px] text-site-gray mt-2 leading-relaxed line-clamp-3 flex-1">
                {p.description}
              </p>

              <div className="mt-4 pt-3 border-t border-site-border text-[11px] text-site-gray font-mono tabular-nums tracking-tight line-clamp-1">
                {p.bannerText}
              </div>

              <Link
                href={`/admin/membership/${p.id}/edit`}
                className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 border-[1.5px] border-navy text-navy text-[11px] tracking-[0.14em] uppercase font-medium no-underline hover:bg-navy hover:text-white transition-colors"
              >
                <Pencil size={13} strokeWidth={1.8} />
                Edit Program
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="flex items-center justify-between gap-5 px-1 pt-2 text-[11px] text-site-gray">
        <div className="flex items-center gap-2 font-mono">
          <span className="inline-block w-2 h-2 rounded-full bg-navy/40" />
          Status <em>Nonaktif</em> menyembunyikan submenu di navbar.
        </div>
        <div className="font-mono tracking-tight">
          EOF · {String(stats.total).padStart(2, "0")} entri
        </div>
      </div>
    </div>
  );
}
