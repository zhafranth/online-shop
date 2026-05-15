export type PaymentMethodType =
  | "transfer"
  | "ewallet"
  | "cc"
  | "cod"
  | "paylater";

export interface BankAccount {
  bankName: string;
  accountNo: string;
  accountHolder: string;
}

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  label: string;
  description: string;
  icon: string;
  enabled: boolean;
  order: number;
  bankAccounts?: BankAccount[];
}

export const PAYMENT_TYPE_LABEL: Record<PaymentMethodType, string> = {
  transfer: "Transfer Bank",
  ewallet: "E-Wallet",
  cc: "Kartu Kredit / Debit",
  cod: "Cash on Delivery",
  paylater: "Paylater",
};
