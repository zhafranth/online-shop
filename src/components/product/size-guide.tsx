"use client";
import { useMemo } from "react";
import { useSizeGuideStore } from "@/stores/size-guide-store";

interface SizeGuideProps { selectedSize: string | null; onSizeSelect: (size: string) => void; }

export function SizeGuide({ selectedSize, onSizeSelect }: SizeGuideProps) {
  const rows = useSizeGuideStore((s) => s.rows);
  const note = useSizeGuideStore((s) => s.note);
  const sorted = useMemo(
    () => [...rows].sort((a, b) => a.order - b.order),
    [rows],
  );

  if (sorted.length === 0) return null;

  return (
    <div className="mt-3.5 border-[1.5px] border-gold-light bg-gold-pale p-4">
      <div className="font-serif text-base mb-3 text-navy">Panduan Ukuran (cm)</div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-navy text-white">
              {["Size", "Dada", "Pinggang", "Panggul", "Tinggi"].map((h) => (
                <th key={h} className="px-2.5 py-2 text-left font-semibold whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr key={row.size} onClick={() => onSizeSelect(row.size)} className={`cursor-pointer hover:bg-cream ${i % 2 === 0 ? "bg-white" : "bg-cream"}`}>
                <td className={`px-2.5 py-[7px] border-b border-site-border font-bold ${selectedSize === row.size ? "text-gold" : "text-site-text"}`}>{row.size}</td>
                <td className="px-2.5 py-[7px] border-b border-site-border">{row.dada}</td>
                <td className="px-2.5 py-[7px] border-b border-site-border">{row.pinggang}</td>
                <td className="px-2.5 py-[7px] border-b border-site-border">{row.panggul}</td>
                <td className="px-2.5 py-[7px] border-b border-site-border">{row.tinggi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note ? (
        <div className="text-[11px] text-site-gray mt-2.5 leading-relaxed">{note}</div>
      ) : (
        <div className="text-[11px] text-site-gray mt-2.5">* Klik baris untuk pilih ukuran.</div>
      )}
    </div>
  );
}
