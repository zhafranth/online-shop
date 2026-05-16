"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/stores/cart-store";
import { useShippingStore } from "@/stores/shipping-store";
import { useAdminShippingStore } from "@/stores/admin-shipping-store";
import { formatPrice } from "@/lib/utils";
import { etdLabel } from "@/types/shipping-admin";
import type { ShippingOption } from "@/types/raja-ongkir";
import { Button } from "@/components/ui/button";

interface CourierOptionsProps {
  onBack: () => void;
  onSubmit: () => void;
}

export function CourierOptions({ onBack, onSubmit }: CourierOptionsProps) {
  const address = useShippingStore((s) => s.address);
  const selectedOption = useShippingStore((s) => s.selectedOption);
  const setOption = useShippingStore((s) => s.setOption);
  const totalWeight = useCartStore((s) => s.totalWeight());

  const warehouse = useAdminShippingStore((s) => s.warehouse);
  const couriers = useAdminShippingStore((s) => s.couriers);

  const options = useMemo<ShippingOption[]>(
    () =>
      [...couriers]
        .filter((c) => c.enabled)
        .sort((a, b) => a.order - b.order)
        .map((c) => ({
          name: c.label,
          code: c.code,
          service: c.code.toUpperCase(),
          description: c.description || etdLabel(c.etdMin, c.etdMax),
          cost: c.price,
          etd:
            c.etdMin === c.etdMax
              ? `${c.etdMin} day`
              : `${c.etdMin}-${c.etdMax} day`,
        })),
    [couriers],
  );

  const [pickedKey, setPickedKey] = useState<string | null>(
    selectedOption ? `${selectedOption.code}-${selectedOption.service}` : null,
  );

  // Drop a stale selection if its courier has been disabled / removed.
  useEffect(() => {
    if (!selectedOption) return;
    const stillAvailable = options.some(
      (o) => o.code === selectedOption.code && o.service === selectedOption.service,
    );
    if (!stillAvailable) {
      setPickedKey(null);
    }
  }, [options, selectedOption]);

  const handleSelect = (opt: ShippingOption) => {
    setOption(opt);
    setPickedKey(`${opt.code}-${opt.service}`);
  };

  const handleContinue = () => {
    if (!selectedOption) return;
    onSubmit();
  };

  if (!address) {
    return (
      <div className="p-5 bg-cream border-[1.5px] border-site-border text-sm text-site-gray">
        Lengkapi alamat pengiriman terlebih dahulu.
      </div>
    );
  }

  return (
    <div className="bg-white border-[1.5px] border-site-border">
      <div className="px-5 py-4 bg-navy text-white">
        <h3 className="font-semibold text-sm tracking-[0.06em]">
          2 · Pilih Kurir & Ongkir
        </h3>
      </div>
      <div className="p-4 sm:p-5 space-y-4">
        <div className="text-xs text-site-gray flex flex-wrap gap-x-4 gap-y-1">
          <span>
            Berat:{" "}
            <strong className="text-site-text">
              {(totalWeight / 1000).toFixed(2)} kg
            </strong>
          </span>
          <span>
            Tujuan:{" "}
            <strong className="text-site-text">
              {address.districtName}, {address.cityName}
            </strong>
          </span>
          <span>
            Dari:{" "}
            <strong className="text-site-text">
              {warehouse.districtName}, {warehouse.cityName}
            </strong>
          </span>
        </div>

        {options.length === 0 ? (
          <div className="px-4 py-8 bg-cream border border-dashed border-site-border text-center">
            <p className="font-serif text-[18px] text-site-gray-dark mb-1">
              Pengiriman belum dikonfigurasi.
            </p>
            <p className="text-[12.5px] text-site-gray">
              Hubungi admin atau atur kurir di{" "}
              <Link href="/admin/shipping" className="underline text-navy">
                Pengaturan Pengiriman
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {options.map((opt) => {
              const key = `${opt.code}-${opt.service}`;
              const checked = pickedKey === key;
              return (
                <label
                  key={key}
                  className={`flex items-center gap-3 p-3 sm:p-3.5 border-[1.5px] cursor-pointer transition-colors ${
                    checked
                      ? "border-navy bg-cream"
                      : "border-site-border bg-white hover:border-navy/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="courier"
                    checked={checked}
                    onChange={() => handleSelect(opt)}
                    className="accent-[#0a0a0a] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{opt.name}</div>
                    <div className="text-xs text-site-gray">
                      {opt.description}
                    </div>
                  </div>
                  <div className="font-semibold text-sm text-navy shrink-0">
                    {formatPrice(opt.cost)}
                  </div>
                </label>
              );
            })}
          </div>
        )}

        <div className="flex justify-between pt-2">
          <Button variant="outline" onClick={onBack}>
            ← Ganti Alamat
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!selectedOption || options.length === 0}
          >
            Lanjut: Review →
          </Button>
        </div>
      </div>
    </div>
  );
}
