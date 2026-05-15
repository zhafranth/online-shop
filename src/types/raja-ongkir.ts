export interface Meta {
  message: string;
  code: number;
  status: "success" | "error";
}

export interface ApiResponse<T> {
  meta: Meta;
  data: T;
}

export interface Province {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
  zip_code: string;
}

export interface District {
  id: number;
  name: string;
  zip_code: string;
}

export interface ShippingOption {
  name: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

export interface ShippingAddress {
  recipientName: string;
  phone: string;
  provinceId: number;
  provinceName: string;
  cityId: number;
  cityName: string;
  districtId: number;
  districtName: string;
  zipCode: string;
  fullAddress: string;
}

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "EXPIRED"
  | "CANCELLED"
  | "FAILED";

export interface QrisPayment {
  payment_id: string;
  reference_id: string;
  payment_method: "qris";
  qris_string: string;
  qris_image_url: string;
  amount: number;
  status: PaymentStatus;
  expired_at: string;
  created_at: string;
  paid_at?: string;
}

export interface PaymentMethodsResponse {
  virtual_account: Array<{
    code: string;
    name: string;
    fee: number;
    enabled: boolean;
  }>;
  qris: Array<{
    code: string;
    name: string;
    fee_percent: number;
    enabled: boolean;
  }>;
}

export interface TrackingManifest {
  manifest_code: string;
  manifest_description: string;
  manifest_date: string;
  manifest_time: string;
  city_name: string;
}

export type OrderShippingStatus =
  | "Packing"
  | "Dijemput"
  | "Dikirim"
  | "Selesai"
  | "Dibatalkan";
