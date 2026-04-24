import { Product, ShippingOption, PaymentOption } from "@/types";

export const PRODUCTS: Product[] = [
  { id: 1, name: "Kemeja Linen Premium", price: 285000, originalPrice: 350000, category: "Men", sizes: ["S", "M", "L", "XL", "2XL"], colors: ["Navy", "Krem", "Putih"], badge: "NEW", label: "kemeja pria linen", image: "https://picsum.photos/seed/vestire-1/400/500", description: "Kemeja linen ringan dengan potongan relaxed-fit, ideal untuk gaya kasual maupun semi-formal.", stock: 18 },
  { id: 2, name: "Dress Maxi Batik Modern", price: 425000, originalPrice: null, category: "Women", sizes: ["S", "M", "L", "XL", "2XL"], colors: ["Navy", "Hitam"], badge: "BEST SELLER", label: "dress maxi wanita", image: "https://picsum.photos/seed/vestire-2/400/500", description: "Dress maxi motif batik kontemporer dengan siluet feminim dan bahan rayon jatuh.", stock: 7 },
  { id: 3, name: "Outer Blazer Minimalis", price: 520000, originalPrice: 650000, category: "Unisex", sizes: ["S", "M", "L", "XL"], colors: ["Hitam", "Camel"], badge: "SALE", label: "outer blazer unisex", image: "https://picsum.photos/seed/vestire-3/400/500", description: "Blazer unisex potongan minimalis, lining halus, cocok untuk kerja maupun acara malam.", stock: 12 },
  { id: 4, name: "Celana Kulot Premium", price: 198000, originalPrice: null, category: "Women", sizes: ["S", "M", "L", "XL", "2XL", "3XL"], colors: ["Hitam", "Navy", "Krem"], badge: null, label: "celana kulot wanita", image: "https://picsum.photos/seed/vestire-4/400/500", description: "Kulot high-waist dengan pinggang elastis tersembunyi, bahan crepe premium.", stock: 25 },
  { id: 5, name: "Kaos Oversize Washed", price: 149000, originalPrice: 185000, category: "Unisex", sizes: ["S", "M", "L", "XL", "2XL"], colors: ["Hitam", "Putih", "Abu"], badge: "NEW", label: "kaos oversize unisex", image: "https://picsum.photos/seed/vestire-5/400/500", description: "Kaos oversize cotton combed 24s dengan finishing washed untuk tampilan vintage.", stock: 40 },
  { id: 6, name: "Rok A-Line Plisket", price: 235000, originalPrice: null, category: "Women", sizes: ["S", "M", "L", "XL"], colors: ["Krem", "Hitam", "Mauve"], badge: null, label: "rok a-line wanita", image: "https://picsum.photos/seed/vestire-6/400/500", description: "Rok plisket flowy panjang midi, cocok untuk gaya feminim klasik modern.", stock: 0 },
  { id: 7, name: "Jaket Bomber Kasual", price: 390000, originalPrice: 480000, category: "Men", sizes: ["S", "M", "L", "XL"], colors: ["Hitam", "Olive"], badge: "SALE", label: "jaket bomber pria", image: "https://picsum.photos/seed/vestire-7/400/500", description: "Bomber taslan water-repellent, lining quilted hangat, ribbing elastis.", stock: 9 },
  { id: 8, name: "Set Koordinat Linen", price: 475000, originalPrice: null, category: "Women", sizes: ["S", "M", "L", "XL", "2XL"], colors: ["Krem", "Biru Muda"], badge: "NEW", label: "set koordinat linen", image: "https://picsum.photos/seed/vestire-8/400/500", description: "Set atasan + celana linen premium, desain match-match untuk look effortless.", stock: 14 },
  { id: 9, name: "Kemeja Flannel Pria", price: 225000, originalPrice: null, category: "Men", sizes: ["S", "M", "L", "XL", "2XL"], colors: ["Navy", "Merah", "Hijau"], badge: null, label: "kemeja flannel pria", image: "https://picsum.photos/seed/vestire-9/400/500", description: "Flannel brushed cotton, regular-fit, nyaman untuk cuaca sejuk.", stock: 22 },
  { id: 10, name: "Dress Midi Crinkle", price: 315000, originalPrice: 380000, category: "Women", sizes: ["S", "M", "L", "XL"], colors: ["Hitam", "Terracotta"], badge: "SALE", label: "dress midi wanita", image: "https://picsum.photos/seed/vestire-10/400/500", description: "Dress midi bahan crinkle ringan, detail kancing depan, tali pinggang.", stock: 5 },
  { id: 11, name: "Celana Chino Slim", price: 275000, originalPrice: null, category: "Men", sizes: ["28", "30", "32", "34", "36"], colors: ["Krem", "Navy", "Abu"], badge: null, label: "celana chino pria", image: "https://picsum.photos/seed/vestire-11/400/500", description: "Chino stretch slim-fit, nyaman untuk mobilitas harian maupun kantor.", stock: 30 },
  { id: 12, name: "Scarf Premium Voile", price: 89000, originalPrice: null, category: "Aksesoris", sizes: ["One Size"], colors: ["Hitam", "Krem", "Mauve"], badge: "NEW", label: "scarf voile", image: "https://picsum.photos/seed/vestire-12/400/500", description: "Scarf voile ringan transparan, jatuh cantik, cocok untuk hijab formal.", stock: 50 },
];

export const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: "jne", label: "JNE REG", description: "Estimasi 2–3 hari kerja", price: 15000 },
  { id: "jnt", label: "J&T Express", description: "Estimasi 2–4 hari kerja", price: 12000 },
  { id: "sicepat", label: "SiCepat HEMAT", description: "Estimasi 3–5 hari kerja", price: 9000 },
  { id: "gosend", label: "GoSend Same Day", description: "Tiba hari ini (area tertentu)", price: 35000 },
];

export const PAYMENT_OPTIONS: PaymentOption[] = [
  { id: "transfer", label: "Transfer Bank", description: "BCA, Mandiri, BNI, BRI", icon: "🏦" },
  { id: "gopay", label: "GoPay / OVO", description: "Bayar via dompet digital", icon: "📱" },
  { id: "cc", label: "Kartu Kredit / Debit", description: "Visa, Mastercard, JCB", icon: "💳" },
  { id: "cod", label: "Bayar di Tempat (COD)", description: "Khusus area tertentu", icon: "🤝" },
  { id: "paylater", label: "Kredivo / Akulaku", description: "Cicilan 0%", icon: "📋" },
];

export const SIZE_GUIDE = [
  { size: "XS", dada: "76–80", pinggang: "58–62", panggul: "84–88", tinggi: "150–155" },
  { size: "S", dada: "80–84", pinggang: "62–66", panggul: "88–92", tinggi: "155–160" },
  { size: "M", dada: "85–89", pinggang: "67–71", panggul: "93–97", tinggi: "158–163" },
  { size: "L", dada: "90–94", pinggang: "72–76", panggul: "98–102", tinggi: "160–165" },
  { size: "XL", dada: "95–100", pinggang: "77–82", panggul: "103–108", tinggi: "162–167" },
  { size: "2XL", dada: "101–106", pinggang: "83–88", panggul: "109–114", tinggi: "163–168" },
];
