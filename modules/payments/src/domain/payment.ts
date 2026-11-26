/**
 * One payment (S77-05): money for one record of one selling module, by one
 * method. A payment starts `pending` (waiting for the payer or provider) and
 * ends `succeeded` or `failed`; a succeeded one can later be refunded.
 */

import type { PaymentMethod } from "@igongo/contracts/payments";

export const PAYMENT_STATUSES = ["pending", "succeeded", "failed", "refunded"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export interface Payment {
  /** The payment's ID, such as `pay_...`; also our reference at the provider. */
  id: string;
  /** What is paid for: the selling module and its record. */
  module: string;
  recordId: string;
  /** The bill's label at the time, such as `Order F-0042`. */
  label: string;
  outlet: string | null;
  method: PaymentMethod;
  /** Whole Uganda shillings. */
  amount: number;
  status: PaymentStatus;
  /** Who pays (the account), and the mobile money number used. */
  payerUserId: string | null;
  payerPhone: string | null;
  /** The provider's own reference, to check the status with them. */
  providerRef: string | null;
  /** The card checkout page, for card payments. */
  redirectUrl: string | null;
  /** The last thing the provider or staff said, for people to read. */
  message: string | null;
  /** The staff member who recorded a cash, bank or account payment. */
  recordedBy: string | null;
  refundedAmount: number;
  createdAt: Date;
  settledAt: Date | null;
}
