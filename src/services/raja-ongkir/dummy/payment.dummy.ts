import type { PaymentService } from "../types";
import {
  DUMMY_PAYMENT_METHODS_RESPONSE,
  createQrisDummy,
} from "@/lib/dummy/payment-channels";
import { generateDummyAwb } from "@/lib/dummy/awb-generator";
import { usePaymentStore } from "@/stores/payment-store";
import { useOrderStore } from "@/stores/order-store";

export const dummyPaymentService: PaymentService = {
  async getMethods() {
    return DUMMY_PAYMENT_METHODS_RESPONSE;
  },

  async createQris(input) {
    const res = await createQrisDummy(input);
    usePaymentStore.getState().add(res.data);
    return res;
  },

  async getStatus(paymentId) {
    const session = usePaymentStore.getState().sessions[paymentId];
    return {
      meta: { message: "ok", code: 200, status: "success" },
      data: session
        ? {
            payment_id: paymentId,
            reference_id: session.reference_id,
            status: session.status,
            paid_at: session.paid_at,
          }
        : {
            payment_id: paymentId,
            reference_id: "",
            status: "FAILED",
          },
    };
  },

  async cancel(paymentId) {
    usePaymentStore.getState().cancel(paymentId);
    return {
      meta: { message: "cancelled", code: 200, status: "success" },
      data: { payment_id: paymentId, status: "CANCELLED" },
    };
  },

  async simulatePaid(paymentId) {
    const session = usePaymentStore.getState().sessions[paymentId];
    if (!session || session.status !== "PENDING") return;

    const paidAt = new Date().toISOString();
    usePaymentStore.getState().markPaid(paymentId, paidAt);

    useOrderStore.getState().markPaid(session.reference_id, {
      awb: generateDummyAwb(),
      paidAt,
    });
  },

  async simulateExpired(paymentId) {
    const session = usePaymentStore.getState().sessions[paymentId];
    if (!session || session.status !== "PENDING") return;
    usePaymentStore.getState().expire(paymentId);
  },
};
