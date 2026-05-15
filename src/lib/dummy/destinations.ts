import type {
  ApiResponse,
  City,
  District,
  Province,
} from "@/types/raja-ongkir";

export const DUMMY_PROVINCES: Province[] = [
  { id: 11, name: "DKI JAKARTA" },
  { id: 9, name: "JAWA BARAT" },
  { id: 10, name: "JAWA TENGAH" },
  { id: 12, name: "JAWA TIMUR" },
  { id: 5, name: "BANTEN" },
];

export const DUMMY_CITIES: Record<number, City[]> = {
  11: [
    { id: 151, name: "JAKARTA PUSAT", zip_code: "10110" },
    { id: 152, name: "JAKARTA UTARA", zip_code: "14110" },
    { id: 153, name: "JAKARTA SELATAN", zip_code: "12110" },
    { id: 154, name: "JAKARTA BARAT", zip_code: "11110" },
    { id: 155, name: "JAKARTA TIMUR", zip_code: "13110" },
  ],
  9: [
    { id: 22, name: "BANDUNG", zip_code: "40111" },
    { id: 23, name: "BANDUNG BARAT", zip_code: "40721" },
    { id: 78, name: "BOGOR", zip_code: "16111" },
    { id: 79, name: "BOGOR KAB.", zip_code: "16911" },
    { id: 105, name: "DEPOK", zip_code: "16411" },
  ],
  10: [
    { id: 398, name: "SEMARANG", zip_code: "50111" },
    { id: 399, name: "SEMARANG KAB.", zip_code: "50511" },
    { id: 472, name: "SOLO", zip_code: "57111" },
    { id: 501, name: "YOGYAKARTA", zip_code: "55111" },
  ],
  12: [
    { id: 444, name: "SURABAYA", zip_code: "60111" },
    { id: 256, name: "MALANG", zip_code: "65111" },
    { id: 178, name: "JEMBER", zip_code: "68111" },
  ],
  5: [
    { id: 461, name: "TANGERANG", zip_code: "15111" },
    { id: 462, name: "TANGERANG SELATAN", zip_code: "15411" },
    { id: 73, name: "SERANG", zip_code: "42111" },
  ],
};

export const DUMMY_DISTRICTS: Record<number, District[]> = {
  151: [
    { id: 2001, name: "GAMBIR", zip_code: "10110" },
    { id: 2002, name: "MENTENG", zip_code: "10310" },
    { id: 2003, name: "TANAH ABANG", zip_code: "10250" },
  ],
  152: [
    { id: 2004, name: "TANJUNG PRIOK", zip_code: "14310" },
    { id: 2005, name: "KELAPA GADING", zip_code: "14240" },
    { id: 2006, name: "PADEMANGAN", zip_code: "14410" },
  ],
  153: [
    { id: 2007, name: "JAGAKARSA", zip_code: "12630" },
    { id: 2008, name: "KEBAYORAN BARU", zip_code: "12110" },
    { id: 2009, name: "TEBET", zip_code: "12810" },
    { id: 2010, name: "MAMPANG PRAPATAN", zip_code: "12760" },
  ],
  154: [
    { id: 2011, name: "KEBON JERUK", zip_code: "11530" },
    { id: 2012, name: "GROGOL PETAMBURAN", zip_code: "11460" },
    { id: 2013, name: "PALMERAH", zip_code: "11480" },
  ],
  155: [
    { id: 2014, name: "MATRAMAN", zip_code: "13140" },
    { id: 2015, name: "DUREN SAWIT", zip_code: "13440" },
    { id: 2016, name: "JATINEGARA", zip_code: "13310" },
  ],
  22: [
    { id: 1391, name: "BANDUNG WETAN", zip_code: "40115" },
    { id: 1392, name: "COBLONG", zip_code: "40132" },
    { id: 1393, name: "CIDADAP", zip_code: "40141" },
  ],
  23: [
    { id: 1394, name: "LEMBANG", zip_code: "40391" },
    { id: 1395, name: "PADALARANG", zip_code: "40552" },
  ],
  78: [
    { id: 1396, name: "BOGOR TENGAH", zip_code: "16121" },
    { id: 1397, name: "BOGOR BARAT", zip_code: "16114" },
  ],
  79: [
    { id: 1398, name: "CIBINONG", zip_code: "16911" },
    { id: 1399, name: "GUNUNG PUTRI", zip_code: "16966" },
  ],
  105: [
    { id: 1400, name: "BEJI", zip_code: "16421" },
    { id: 1401, name: "PANCORAN MAS", zip_code: "16431" },
  ],
  398: [
    { id: 3001, name: "SEMARANG TENGAH", zip_code: "50132" },
    { id: 3002, name: "CANDISARI", zip_code: "50253" },
  ],
  399: [
    { id: 3003, name: "UNGARAN BARAT", zip_code: "50511" },
    { id: 3004, name: "BERGAS", zip_code: "50552" },
  ],
  472: [
    { id: 3005, name: "LAWEYAN", zip_code: "57148" },
    { id: 3006, name: "JEBRES", zip_code: "57126" },
  ],
  501: [
    { id: 3007, name: "GONDOKUSUMAN", zip_code: "55225" },
    { id: 3008, name: "UMBULHARJO", zip_code: "55162" },
  ],
  444: [
    { id: 4001, name: "GUBENG", zip_code: "60281" },
    { id: 4002, name: "WONOKROMO", zip_code: "60243" },
  ],
  256: [
    { id: 4003, name: "KLOJEN", zip_code: "65111" },
    { id: 4004, name: "LOWOKWARU", zip_code: "65141" },
  ],
  178: [
    { id: 4005, name: "PATRANG", zip_code: "68111" },
    { id: 4006, name: "SUMBERSARI", zip_code: "68121" },
  ],
  461: [
    { id: 5001, name: "CIPONDOH", zip_code: "15146" },
    { id: 5002, name: "KARAWACI", zip_code: "15115" },
  ],
  462: [
    { id: 5003, name: "PAMULANG", zip_code: "15417" },
    { id: 5004, name: "CIPUTAT", zip_code: "15411" },
  ],
  73: [
    { id: 5005, name: "SERANG KOTA", zip_code: "42111" },
    { id: 5006, name: "CIPOCOK JAYA", zip_code: "42121" },
  ],
};

const ok = <T>(message: string, data: T): ApiResponse<T> => ({
  meta: { message, code: 200, status: "success" },
  data,
});

export function getProvincesDummy(): Promise<ApiResponse<Province[]>> {
  return Promise.resolve(ok("Success Get Province", DUMMY_PROVINCES));
}

export function getCitiesDummy(
  provinceId: number,
): Promise<ApiResponse<City[]>> {
  return Promise.resolve(
    ok("Success Get City By Province ID", DUMMY_CITIES[provinceId] ?? []),
  );
}

export function getDistrictsDummy(
  cityId: number,
): Promise<ApiResponse<District[]>> {
  return Promise.resolve(
    ok("Success Get District By City ID", DUMMY_DISTRICTS[cityId] ?? []),
  );
}

export function districtToProvinceId(districtId: number): number {
  for (const [provinceIdStr, cities] of Object.entries(DUMMY_CITIES)) {
    for (const city of cities) {
      const districts = DUMMY_DISTRICTS[city.id];
      if (districts?.some((d) => d.id === districtId)) {
        return Number(provinceIdStr);
      }
    }
  }
  return 9;
}

export function findDistrict(
  districtId: number,
): { district: District; cityId: number; provinceId: number } | null {
  for (const [provinceIdStr, cities] of Object.entries(DUMMY_CITIES)) {
    for (const city of cities) {
      const district = DUMMY_DISTRICTS[city.id]?.find(
        (d) => d.id === districtId,
      );
      if (district) {
        return {
          district,
          cityId: city.id,
          provinceId: Number(provinceIdStr),
        };
      }
    }
  }
  return null;
}
