import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number): string {
  return "Rp " + price.toLocaleString("id-ID");
}

const COLOR_HEX: Record<string, string> = {
  Navy: "#1a2744",
  Hitam: "#0a0a0a",
  Putih: "#ffffff",
  Krem: "#d9c89b",
  Camel: "#b88a5f",
  Abu: "#9a9a9a",
  Mauve: "#b58a9a",
  "Biru Muda": "#a8c5d6",
  Merah: "#a83a3a",
  Hijau: "#4a6b3a",
  Olive: "#6f7d3f",
  Terracotta: "#c87456",
};

export function colorHex(name: string): string {
  return COLOR_HEX[name] ?? "#cccccc";
}

export function discountPercent(price: number, originalPrice: number | null): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round((1 - price / originalPrice) * 100);
}

export function categoryLabelFallback(id: string): string {
  if (!id) return "";
  return id
    .split("-")
    .map((p) => (p ? p.charAt(0).toUpperCase() + p.slice(1) : p))
    .join(" ");
}
