// One payment, as the Payments API returns it (modules/payments).

export type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded";

export interface Payment {
  id: string;
  module: string;
  recordId: string;
  label: string;
  method: string;
  amount: number;
  status: PaymentStatus;
  payerPhone: string | null;
  providerRef: string | null;
  /** The card checkout page, for card payments. */
  redirectUrl: string | null;
  message: string | null;
  refundedAmount: number;
  createdAt: string;
}
