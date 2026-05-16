export interface ShippingCourier {
  code: string;
  label: string;
  description: string;
  price: number;
  etdMin: number;
  etdMax: number;
  enabled: boolean;
  order: number;
}

export interface WarehouseOrigin {
  provinceId: number;
  provinceName: string;
  cityId: number;
  cityName: string;
  districtId: number;
  districtName: string;
  zipCode: string;
}

export function etdLabel(etdMin: number, etdMax: number): string {
  if (etdMin === etdMax) return `Estimasi ${etdMin} hari kerja`;
  return `Estimasi ${etdMin}–${etdMax} hari kerja`;
}
