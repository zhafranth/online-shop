export const DUMMY_COURIERS = [
  { code: "jne", name: "Jalur Nugraha Ekakurir (JNE)" },
  { code: "jnt", name: "J&T Express" },
  { code: "sicepat", name: "SiCepat Ekspres" },
  { code: "anteraja", name: "Anteraja" },
  { code: "pos", name: "POS Indonesia" },
] as const;

export const COURIER_NAMES: Record<string, string> = Object.fromEntries(
  DUMMY_COURIERS.map((c) => [c.code, c.name]),
);

export const COURIER_SERVICE: Record<
  string,
  { service: string; description: string }
> = {
  jne: { service: "REG", description: "Layanan Reguler" },
  jnt: { service: "EZ", description: "Express" },
  sicepat: { service: "REG", description: "Regular Service" },
  anteraja: { service: "Regular", description: "Reguler Anteraja" },
  pos: { service: "Reguler", description: "Paket Kilat Khusus" },
};

export const COURIER_ETD: Record<string, string> = {
  jne: "2-3 day",
  jnt: "2-3 day",
  sicepat: "1-2 day",
  anteraja: "2-4 day",
  pos: "3-5 day",
};

export const COURIER_PREMIUM: Record<string, number> = {
  jne: 2000,
  jnt: 1000,
  sicepat: 3000,
  anteraja: 0,
  pos: 6000,
};

export const DEFAULT_COURIER_CODES = ["jne", "jnt", "sicepat", "anteraja", "pos"];
