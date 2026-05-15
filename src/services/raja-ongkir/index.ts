import type { PaymentService, ShippingService } from "./types";
import { dummyShippingService } from "./dummy/shipping.dummy";
import { dummyPaymentService } from "./dummy/payment.dummy";

const USE_DUMMY =
  process.env.NEXT_PUBLIC_USE_DUMMY_RAJAONGKIR !== "false";

export const shippingService: ShippingService = USE_DUMMY
  ? dummyShippingService
  : dummyShippingService;

export const paymentService: PaymentService = USE_DUMMY
  ? dummyPaymentService
  : dummyPaymentService;

export type { PaymentService, ShippingService } from "./types";
