import type {
  ApiResponse,
  PaymentMethodsResponse,
  QrisPayment,
} from "@/types/raja-ongkir";

export const DUMMY_PAYMENT_METHODS_RESPONSE: ApiResponse<PaymentMethodsResponse> =
  {
    meta: {
      message: "Success Get Payment Methods",
      code: 200,
      status: "success",
    },
    data: {
      virtual_account: [
        { code: "BCA", name: "Bank BCA", fee: 4000, enabled: false },
        { code: "BNI", name: "Bank BNI", fee: 4000, enabled: false },
        { code: "MANDIRI", name: "Bank Mandiri", fee: 4000, enabled: false },
      ],
      qris: [{ code: "QRIS", name: "QRIS", fee_percent: 0.7, enabled: true }],
    },
  };

export interface CreateQrisInput {
  amount: number;
  referenceId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
}

export function createQrisDummy(
  input: CreateQrisInput,
): Promise<ApiResponse<QrisPayment>> {
  const paymentId = `pay_DUM_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)
    .toUpperCase()}`;
  const now = new Date();
  const expiredAt = new Date(now.getTime() + 30 * 60 * 1000);

  return Promise.resolve({
    meta: {
      message: "Success Create Payment",
      code: 201,
      status: "success",
    },
    data: {
      payment_id: paymentId,
      reference_id: input.referenceId,
      payment_method: "qris",
      qris_string: `DUMMY-QRIS-${input.referenceId}-${input.amount}`,
      qris_image_url: "/dummy/qris-placeholder.png",
      amount: input.amount,
      status: "PENDING",
      expired_at: expiredAt.toISOString(),
      created_at: now.toISOString(),
    },
  });
}
