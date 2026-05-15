import type {
  ApiResponse,
  City,
  District,
  OrderShippingStatus,
  PaymentMethodsResponse,
  PaymentStatus,
  Province,
  QrisPayment,
  ShippingOption,
  TrackingManifest,
} from "@/types/raja-ongkir";

export interface CalculateCostArgs {
  originDistrictId: number;
  destinationDistrictId: number;
  weight: number;
  couriers: string[];
}

export interface GetTrackingArgs {
  orderId: string;
  paidAt: string;
}

export interface CreateQrisArgs {
  amount: number;
  referenceId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
}

export interface ShippingService {
  getProvinces(): Promise<ApiResponse<Province[]>>;
  getCities(provinceId: number): Promise<ApiResponse<City[]>>;
  getDistricts(cityId: number): Promise<ApiResponse<District[]>>;
  calculateCost(
    input: CalculateCostArgs,
  ): Promise<ApiResponse<ShippingOption[]>>;
  getTrackingManifest(input: GetTrackingArgs): Promise<
    ApiResponse<{
      status: OrderShippingStatus;
      manifest: TrackingManifest[];
    }>
  >;
}

export interface PaymentStatusInfo {
  payment_id: string;
  reference_id: string;
  status: PaymentStatus;
  paid_at?: string;
}

export interface PaymentService {
  getMethods(): Promise<ApiResponse<PaymentMethodsResponse>>;
  createQris(input: CreateQrisArgs): Promise<ApiResponse<QrisPayment>>;
  getStatus(paymentId: string): Promise<ApiResponse<PaymentStatusInfo>>;
  cancel(
    paymentId: string,
  ): Promise<ApiResponse<{ payment_id: string; status: PaymentStatus }>>;
  simulatePaid?(paymentId: string): Promise<void>;
  simulateExpired?(paymentId: string): Promise<void>;
}
