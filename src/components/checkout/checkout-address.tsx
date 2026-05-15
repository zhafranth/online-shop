"use client";

import { useEffect, useState } from "react";
import { shippingService } from "@/services/raja-ongkir";
import { useShippingStore } from "@/stores/shipping-store";
import type {
  City,
  District,
  Province,
  ShippingAddress,
} from "@/types/raja-ongkir";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CheckoutAddressProps {
  onSubmit: () => void;
}

interface FormState {
  recipientName: string;
  phone: string;
  provinceId: number | "";
  cityId: number | "";
  districtId: number | "";
  zipCode: string;
  fullAddress: string;
}

const emptyForm: FormState = {
  recipientName: "",
  phone: "",
  provinceId: "",
  cityId: "",
  districtId: "",
  zipCode: "",
  fullAddress: "",
};

function addressToForm(addr: ShippingAddress | null): FormState {
  if (!addr) return emptyForm;
  return {
    recipientName: addr.recipientName,
    phone: addr.phone,
    provinceId: addr.provinceId,
    cityId: addr.cityId,
    districtId: addr.districtId,
    zipCode: addr.zipCode,
    fullAddress: addr.fullAddress,
  };
}

export function CheckoutAddress({ onSubmit }: CheckoutAddressProps) {
  const savedAddress = useShippingStore((s) => s.address);
  const setAddress = useShippingStore((s) => s.setAddress);

  const [form, setForm] = useState<FormState>(addressToForm(savedAddress));
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loadingProv, setLoadingProv] = useState(false);
  const [loadingCity, setLoadingCity] = useState(false);
  const [loadingDist, setLoadingDist] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoadingProv(true);
    shippingService
      .getProvinces()
      .then((res) => setProvinces(res.data))
      .catch(() => setError("Gagal memuat provinsi."))
      .finally(() => setLoadingProv(false));
  }, []);

  useEffect(() => {
    if (form.provinceId === "") {
      setCities([]);
      return;
    }
    setLoadingCity(true);
    shippingService
      .getCities(form.provinceId)
      .then((res) => setCities(res.data))
      .catch(() => setError("Gagal memuat kota."))
      .finally(() => setLoadingCity(false));
  }, [form.provinceId]);

  useEffect(() => {
    if (form.cityId === "") {
      setDistricts([]);
      return;
    }
    setLoadingDist(true);
    shippingService
      .getDistricts(form.cityId)
      .then((res) => setDistricts(res.data))
      .catch(() => setError("Gagal memuat kecamatan."))
      .finally(() => setLoadingDist(false));
  }, [form.cityId]);

  const handleProvinceChange = (id: number) => {
    setForm((f) => ({
      ...f,
      provinceId: id,
      cityId: "",
      districtId: "",
      zipCode: "",
    }));
  };

  const handleCityChange = (id: number) => {
    setForm((f) => ({ ...f, cityId: id, districtId: "", zipCode: "" }));
  };

  const handleDistrictChange = (id: number) => {
    const district = districts.find((d) => d.id === id);
    setForm((f) => ({
      ...f,
      districtId: id,
      zipCode: district?.zip_code ?? f.zipCode,
    }));
  };

  const handleSave = () => {
    setError(null);
    if (!form.recipientName.trim())
      return setError("Nama penerima wajib diisi.");
    if (!/^\d{8,14}$/.test(form.phone.replace(/[-\s]/g, "")))
      return setError("No. HP tidak valid (8–14 digit).");
    if (form.provinceId === "") return setError("Pilih provinsi.");
    if (form.cityId === "") return setError("Pilih kota/kabupaten.");
    if (form.districtId === "") return setError("Pilih kecamatan.");
    if (!form.zipCode.trim()) return setError("Kode pos wajib diisi.");
    if (!form.fullAddress.trim()) return setError("Alamat lengkap wajib diisi.");

    const province = provinces.find((p) => p.id === form.provinceId);
    const city = cities.find((c) => c.id === form.cityId);
    const district = districts.find((d) => d.id === form.districtId);
    if (!province || !city || !district) {
      return setError("Data lokasi tidak lengkap.");
    }

    const address: ShippingAddress = {
      recipientName: form.recipientName.trim(),
      phone: form.phone.trim(),
      provinceId: province.id,
      provinceName: province.name,
      cityId: city.id,
      cityName: city.name,
      districtId: district.id,
      districtName: district.name,
      zipCode: form.zipCode.trim(),
      fullAddress: form.fullAddress.trim(),
    };
    setAddress(address);
    onSubmit();
  };

  return (
    <div className="bg-white border-[1.5px] border-site-border">
      <div className="px-5 py-4 bg-navy text-white">
        <h3 className="font-semibold text-sm tracking-[0.06em]">
          1 · Alamat Pengiriman
        </h3>
      </div>
      <div className="p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Nama Penerima"
            placeholder="Budi Santoso"
            value={form.recipientName}
            onChange={(e) =>
              setForm((f) => ({ ...f, recipientName: e.target.value }))
            }
          />
          <Input
            label="No. HP"
            placeholder="08xxxxxxxxxx"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-medium tracking-[0.06em] text-site-gray uppercase mb-1.5">
              Provinsi
            </label>
            <select
              value={form.provinceId}
              onChange={(e) => handleProvinceChange(Number(e.target.value))}
              disabled={loadingProv}
              className="w-full px-4 py-3 border-[1.5px] border-site-border bg-white text-sm outline-none focus:border-navy disabled:opacity-50"
            >
              <option value="">
                {loadingProv ? "Memuat..." : "— Pilih Provinsi —"}
              </option>
              {provinces.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium tracking-[0.06em] text-site-gray uppercase mb-1.5">
              Kota / Kabupaten
            </label>
            <select
              value={form.cityId}
              onChange={(e) => handleCityChange(Number(e.target.value))}
              disabled={form.provinceId === "" || loadingCity}
              className="w-full px-4 py-3 border-[1.5px] border-site-border bg-white text-sm outline-none focus:border-navy disabled:opacity-50"
            >
              <option value="">
                {loadingCity
                  ? "Memuat..."
                  : form.provinceId === ""
                    ? "Pilih provinsi dulu"
                    : "— Pilih Kota —"}
              </option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-medium tracking-[0.06em] text-site-gray uppercase mb-1.5">
              Kecamatan
            </label>
            <select
              value={form.districtId}
              onChange={(e) => handleDistrictChange(Number(e.target.value))}
              disabled={form.cityId === "" || loadingDist}
              className="w-full px-4 py-3 border-[1.5px] border-site-border bg-white text-sm outline-none focus:border-navy disabled:opacity-50"
            >
              <option value="">
                {loadingDist
                  ? "Memuat..."
                  : form.cityId === ""
                    ? "Pilih kota dulu"
                    : "— Pilih Kecamatan —"}
              </option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Kode Pos"
            placeholder="12345"
            value={form.zipCode}
            onChange={(e) =>
              setForm((f) => ({ ...f, zipCode: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="block text-xs font-medium tracking-[0.06em] text-site-gray uppercase mb-1.5">
            Alamat Lengkap
          </label>
          <textarea
            value={form.fullAddress}
            onChange={(e) =>
              setForm((f) => ({ ...f, fullAddress: e.target.value }))
            }
            rows={3}
            placeholder="Jl. Mawar No. 1, RT 01/RW 02, dekat puskesmas..."
            className="w-full px-4 py-3 border-[1.5px] border-site-border bg-white text-sm outline-none focus:border-navy resize-y"
          />
        </div>

        {error && (
          <div className="px-3.5 py-2.5 text-[13px] bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]">
            {error}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button onClick={handleSave}>Lanjut: Pilih Kurir →</Button>
        </div>
      </div>
    </div>
  );
}
