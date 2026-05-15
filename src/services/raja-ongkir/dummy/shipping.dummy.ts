import type { ShippingService } from "../types";
import {
  getCitiesDummy,
  getDistrictsDummy,
  getProvincesDummy,
} from "@/lib/dummy/destinations";
import { calculateCostDummy } from "@/lib/dummy/shipping-cost";
import {
  deriveManifest,
  deriveStatus,
} from "@/lib/dummy/status-simulator";

export const dummyShippingService: ShippingService = {
  getProvinces: getProvincesDummy,
  getCities: getCitiesDummy,
  getDistricts: getDistrictsDummy,
  calculateCost: calculateCostDummy,

  async getTrackingManifest({ paidAt }) {
    return {
      meta: { message: "ok", code: 200, status: "success" },
      data: {
        status: deriveStatus(paidAt),
        manifest: deriveManifest(paidAt),
      },
    };
  },
};
