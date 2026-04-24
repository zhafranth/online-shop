export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number | null;
  category: "Men" | "Women" | "Unisex" | "Aksesoris";
  sizes: string[];
  colors: string[];
  badge: "NEW" | "BEST SELLER" | "SALE" | null;
  label: string;
  image: string;
  description: string;
  stock: number;
}

export interface CartItem extends Product {
  selectedSize: string;
  selectedColor: string;
  qty: number;
}

export interface ShippingOption {
  id: string;
  label: string;
  description: string;
  price: number;
}

export interface PaymentOption {
  id: string;
  label: string;
  description: string;
  icon: string;
}
