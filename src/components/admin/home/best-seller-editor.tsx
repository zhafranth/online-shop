"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, Search, AlertTriangle } from "lucide-react";
import { useHomeContentStore } from "@/stores/home-content-store";
import { useProductStore } from "@/stores/product-store";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import { SectionShell } from "./section-shell";

interface ProductPickerProps {
  label: string;
  slotIndex: number;
  selectedId: number | null;
  excludedIds: (number | null)[];
  products: Product[];
  onChange: (id: number | null) => void;
}

function ProductPicker({
  label,
  slotIndex,
  selectedId,
  excludedIds,
  products,
  onChange,
}: ProductPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const selected = products.find((p) => p.id === selectedId);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products
      .filter((p) => !excludedIds.includes(p.id) || p.id === selectedId)
      .filter(
        (p) =>
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
      .slice(0, 50);
  }, [products, query, excludedIds, selectedId]);

  return (
    <div ref={ref} className="relative">
      <div className="text-[10px] font-semibold tracking-[0.16em] text-site-gray uppercase mb-2 flex items-center justify-between">
        <span>{label}</span>
        <span className="font-mono normal-case tracking-tight text-site-gray-light">
          slot {slotIndex + 1}
        </span>
      </div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full text-left bg-white border-[1.5px] ${open ? "border-navy" : "border-site-border"} flex items-center gap-3 p-2.5 transition-colors hover:border-navy`}
      >
        <div className="relative w-12 h-16 bg-cream border border-site-border overflow-hidden shrink-0">
          {selected ? (
            <Image
              src={selected.image}
              alt={selected.name}
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[9px] text-site-gray-light tracking-[0.18em] uppercase">
              Pick
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          {selected ? (
            <>
              <div className="font-serif text-[15px] leading-tight text-navy truncate">
                {selected.name}
              </div>
              <div className="text-[11px] text-site-gray font-mono mt-0.5">
                /{selected.id} · {formatPrice(selected.price)}
              </div>
              {selected.stock === 0 && (
                <div className="mt-1 inline-flex items-center gap-1 text-[10px] tracking-[0.14em] uppercase text-[#b45309]">
                  <AlertTriangle size={10} strokeWidth={2} />
                  Stok habis
                </div>
              )}
            </>
          ) : (
            <div className="text-[13px] text-site-gray italic">
              Pilih produk…
            </div>
          )}
        </div>
        <ChevronDown
          size={16}
          strokeWidth={1.7}
          className={`text-site-gray transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-30 mt-1.5 w-full bg-white border border-site-border shadow-lg max-h-[360px] flex flex-col">
          <div className="p-2 border-b border-site-border bg-cream/60 flex items-center gap-2">
            <Search size={13} strokeWidth={1.8} className="text-site-gray" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama atau kategori…"
              className="flex-1 bg-transparent text-[13px] outline-none"
            />
            {selected && (
              <button
                type="button"
                onClick={() => {
                  onChange(null);
                  setOpen(false);
                }}
                className="text-[10px] tracking-[0.14em] uppercase text-[#b91c1c] hover:underline px-1"
              >
                Clear
              </button>
            )}
          </div>
          <div className="overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-8 text-center text-[12.5px] text-site-gray italic">
                Tidak ada produk cocok.
              </div>
            ) : (
              filtered.map((p) => {
                const isSelected = p.id === selectedId;
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => {
                      onChange(p.id);
                      setOpen(false);
                    }}
                    className={`w-full text-left flex items-center gap-3 px-3 py-2.5 border-t border-site-border first:border-t-0 transition-colors ${isSelected ? "bg-cream" : "hover:bg-cream/40"}`}
                  >
                    <div className="relative w-10 h-12 bg-cream border border-site-border overflow-hidden shrink-0">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] text-site-text truncate">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-site-gray font-mono">
                        /{p.id} · {formatPrice(p.price)}
                      </div>
                    </div>
                    {p.stock === 0 && (
                      <span className="text-[9.5px] tracking-[0.14em] uppercase text-[#b45309] font-medium">
                        habis
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

type BestSellerConfigIds = [
  number | null,
  number | null,
  number | null,
  number | null,
];

export function BestSellerEditor({
  index,
  total,
}: {
  index: number;
  total: number;
}) {
  const config = useHomeContentStore((s) => s.content.bestSeller);
  const setBestSeller = useHomeContentStore((s) => s.setBestSeller);
  const products = useProductStore((s) => s.products);

  const [draft, setDraft] = useState(config);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    setDraft(config);
  }, [config]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(config);

  const setSlot = (slotIndex: number, id: number | null) => {
    setDraft((d) => {
      const next: BestSellerConfigIds = [...d.productIds] as BestSellerConfigIds;
      next[slotIndex] = id;
      return { productIds: next };
    });
  };

  const filledCount = draft.productIds.filter((id) => id !== null).length;

  return (
    <SectionShell
      index={index}
      total={total}
      eyebrow="Curation · Featured"
      title="Best Seller"
      description="Empat slot produk best seller, tampil dalam grid 4 kolom di storefront. Picker mencari berdasarkan nama atau kategori. ID produk disimpan, bukan index — aman saat urutan berubah."
      counterLabel={`${String(filledCount).padStart(2, "0")}/04 slot`}
      dirty={dirty}
      savedAt={savedAt}
      onSave={() => {
        setBestSeller(draft);
        setSavedAt(Date.now());
      }}
      onDiscard={() => setDraft(config)}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {draft.productIds.map((id, i) => (
          <ProductPicker
            key={i}
            label={`Slot ${i + 1}`}
            slotIndex={i}
            selectedId={id}
            excludedIds={draft.productIds.filter((_, j) => j !== i)}
            products={products}
            onChange={(next) => setSlot(i, next)}
          />
        ))}
      </div>

      {/* Mini layout preview */}
      <div className="border-t border-dashed border-site-border pt-5">
        <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray mb-3">
          Layout Preview
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 h-[260px]">
          {draft.productIds.map((id, i) => (
            <PreviewCard
              key={i}
              product={products.find((p) => p.id === id)}
            />
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function PreviewCard({ product }: { product?: Product }) {
  if (!product) {
    return (
      <div className="bg-cream border border-dashed border-site-border flex flex-col items-center justify-center text-site-gray-light">
        <div className="text-[10px] tracking-[0.22em] uppercase">
          Slot kosong
        </div>
        <div className="font-serif italic text-[16px] mt-1">empty</div>
      </div>
    );
  }
  return (
    <div className="relative bg-cream border border-site-border overflow-hidden">
      <Image
        src={product.image}
        alt={product.name}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        className="object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <div className="font-serif text-white leading-tight text-[14px]">
          {product.name}
        </div>
        <div className="text-[11px] text-white/80 mt-0.5">
          {formatPrice(product.price)}
        </div>
      </div>
    </div>
  );
}
