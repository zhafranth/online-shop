"use client";
import { useState } from "react";
import { Product } from "@/types";

interface ProductTabsProps { product: Product; }

export function ProductTabs({ product: p }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("desc");
  const tabs = [{ id: "desc", label: "Deskripsi" }, { id: "material", label: "Material & Perawatan" }, { id: "review", label: "Ulasan (128)" }];

  return (
    <div className="container-site pb-12 md:pb-[60px]">
      <div className="flex border-b-2 border-site-border mb-6 md:mb-7 overflow-x-auto">
        {tabs.map(({ id, label }) => (
          <div key={id} onClick={() => setActiveTab(id)} className={`px-4 md:px-6 py-3 text-[13px] font-medium cursor-pointer tracking-[0.04em] -mb-[2px] border-b-2 whitespace-nowrap ${activeTab === id ? "border-navy text-navy" : "border-transparent text-site-gray"}`}>{label}</div>
        ))}
      </div>
      {activeTab === "desc" && (
        <div className="max-w-[680px] leading-[1.9] text-site-gray-dark text-sm">
          <p className="mb-4">{p.name} hadir dengan desain yang elegan dan bahan berkualitas tinggi. Dipotong dengan presisi untuk memberikan siluet yang sempurna di berbagai bentuk tubuh.</p>
          <ul className="pl-5">
            {["Bahan premium, nyaman sepanjang hari", "Tersedia dalam berbagai pilihan warna", "Potongan modern, cocok untuk berbagai kesempatan", "Mudah dicuci dan cepat kering"].map((t) => (<li key={t} className="mb-1.5">{t}</li>))}
          </ul>
        </div>
      )}
      {activeTab === "material" && (
        <div className="max-w-[680px] text-sm leading-[1.9] text-site-gray-dark">
          <p>Komposisi: 60% Cotton, 35% Linen, 5% Elastane</p>
          <p className="mt-3">Panduan perawatan: Cuci dengan tangan atau mesin suhu dingin (30°C). Jangan diperas. Setrika suhu sedang.</p>
        </div>
      )}
      {activeTab === "review" && (
        <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-6 sm:gap-10">
          <div className="text-center p-6 border border-site-border">
            <div className="font-serif text-[52px] font-semibold text-navy">4.9</div>
            <div className="text-gold text-xl my-1">★★★★★</div>
            <div className="text-xs text-site-gray">128 ulasan</div>
          </div>
          <div>
            {[5, 4, 3, 2, 1].map((n) => {
              const pcts = [85, 10, 3, 1, 1];
              return (
                <div key={n} className="flex items-center gap-2.5 mb-2">
                  <span className="text-xs w-2">{n}</span>
                  <span className="text-gold text-xs">★</span>
                  <div className="flex-1 h-1.5 bg-site-border rounded-sm">
                    <div className="h-full bg-gold rounded-sm" style={{ width: `${pcts[5 - n]}%` }} />
                  </div>
                  <span className="text-xs text-site-gray w-[30px]">{pcts[5 - n]}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
