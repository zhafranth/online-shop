import type { ApiResponse, ShippingOption } from "@/types/raja-ongkir";
import {
  COURIER_ETD,
  COURIER_NAMES,
  COURIER_PREMIUM,
  COURIER_SERVICE,
} from "./couriers";
import { districtToProvinceId } from "./destinations";

const ZONE_BY_PROVINCE: Record<number, number> = {
  11: 1, // DKI Jakarta
  9: 2, // Jabar
  5: 2, // Banten
  10: 3, // Jateng
  12: 4, // Jatim
};

const BASE_COST_MATRIX: number[][] = [
  [9000, 12000, 16000, 20000],
  [12000, 9000, 13000, 17000],
  [16000, 13000, 9000, 14000],
  [20000, 17000, 14000, 9000],
];

export function computeDummyCost(
  originProvinceId: number,
  destinationProvinceId: number,
  weightGrams: number,
  courierCode: string,
): number {
  const oZone = (ZONE_BY_PROVINCE[originProvinceId] ?? 2) - 1;
  const dZone = (ZONE_BY_PROVINCE[destinationProvinceId] ?? 2) - 1;
  const base = BASE_COST_MATRIX[oZone]?.[dZone] ?? 12000;
  const weightFactor = Math.max(1, Math.ceil(weightGrams / 1000));
  const premium = COURIER_PREMIUM[courierCode] ?? 0;
  return (base + premium) * weightFactor;
}

export interface CalculateCostInput {
  originDistrictId: number;
  destinationDistrictId: number;
  weight: number;
  couriers: string[];
}

export function calculateCostDummy(
  input: CalculateCostInput,
): Promise<ApiResponse<ShippingOption[]>> {
  const originProvince = districtToProvinceId(input.originDistrictId);
  const destProvince = districtToProvinceId(input.destinationDistrictId);

  const data: ShippingOption[] = input.couriers.map((code) => ({
    name: COURIER_NAMES[code] ?? code.toUpperCase(),
    code,
    service: COURIER_SERVICE[code]?.service ?? "REG",
    description: COURIER_SERVICE[code]?.description ?? "Layanan Reguler",
    cost: computeDummyCost(originProvince, destProvince, input.weight, code),
    etd: COURIER_ETD[code] ?? "2-4 day",
  }));

  return Promise.resolve({
    meta: {
      message: "Success Calculate Shipping cost",
      code: 200,
      status: "success",
    },
    data,
  });
}
