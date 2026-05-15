"use client";

import { useEffect, useState } from "react";
import { shippingService } from "@/services/raja-ongkir";
import { useCartStore } from "@/stores/cart-store";
import { useShippingStore } from "@/stores/shipping-store";
import { DEFAULT_COURIER_CODES } from "@/lib/dummy/couriers";
import { WAREHOUSE } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import type { ShippingOption } from "@/types/raja-ongkir";
import { Button } from "@/components/ui/button";

function formatEtd(etd: string): string {
  return etd.replace(/\s*day$/i, " hari").replace("-", "–");
}

interface CourierOptionsProps {
  onBack: () => void;
  onSubmit: () => void;
}

export function CourierOptions({ onBack, onSubmit }: CourierOptionsProps) {
  const address = useShippingStore((s) => s.address);
  const selectedOption = useShippingStore((s) => s.selectedOption);
  const setOption = useShippingStore((s) => s.setOption);
  const totalWeight = useCartStore((s) => s.totalWeight());

  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pickedKey, setPickedKey] = useState<string | null>(
    selectedOption ? `${selectedOption.code}-${selectedOption.service}` : null,
  );

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    setError(null);
    shippingService
      .calculateCost({
        originDistrictId: WAREHOUSE.districtId,
        destinationDistrictId: address.districtId,
        weight: Math.max(totalWeight, 100),
        couriers: DEFAULT_COURIER_CODES,
      })
      .then((res) => setOptions(res.data))
      .catch(() => setError("Gagal menghitung ongkir, coba lagi."))
      .finally(() => setLoading(false));
  }, [address, totalWeight]);

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
            Berat: <strong className="text-site-text">{(totalWeight / 1000).toFixed(2)} kg</strong>
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
              {WAREHOUSE.districtName}, {WAREHOUSE.cityName}
            </strong>
          </span>
        </div>

        {loading && (
          <p className="text-sm text-site-gray py-4">Menghitung ongkir…</p>
        )}

        {error && (
          <div className="px-3.5 py-2.5 text-[13px] bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]">
            {error}
          </div>
        )}

        {!loading && !error && (
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
                    <div className="font-semibold text-sm">
                      {opt.name}{" "}
                      <span className="text-site-gray font-normal">
                        — {opt.service}
                      </span>
                    </div>
                    <div className="text-xs text-site-gray">
                      {opt.description} · ETD {formatEtd(opt.etd)}
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
          <Button onClick={handleContinue} disabled={!selectedOption}>
            Lanjut: Review →
          </Button>
        </div>
      </div>
    </div>
  );
}
