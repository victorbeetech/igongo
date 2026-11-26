/**
 * Public contract of Payments (module 77). Payments takes money for any
 * module that sells something (food orders, room bookings, tickets, shop
 * items). A selling module never talks to a payment provider: it gives the
 * gateway a `Payable`, and Payments asks it what is owed and tells it when
 * money came in.
 */

/** Every payment method the system has. Each has its own switch (S77-06). */
export const PAYMENT_METHODS = ["mtn_momo", "airtel_money", "card", "bank_transfer", "cash", "room_charge", "corporate_account"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

/** The thing being paid for: a record in a selling module. */
export interface PayableRef {
  /** The selling module's key, such as `food-ordering`. */
  module: string;
  /** The order or booking ID inside that module. */
  recordId: string;
}

/** What a selling module says is owed on one record. Amounts are whole Uganda shillings. */
export interface PayableBill {
  /** Shown to the payer, such as `Order F-0042`. */
  label: string;
  total: number;
  /** Already paid. */
  paid: number;
  /** The least the payer must pay now (a deposit), never more than total minus paid. */
  minimumNow: number;
  /** The account that owns the record (only they, or staff, may pay it in the app). */
  payerUserId: string | null;
  /** The outlet, for per-outlet method switches, or null. */
  outlet: string | null;
}

/** Implemented by each selling module and handed to Payments by the gateway. */
export interface Payable {
  /** The bill for [recordId], or null when there is no such record. */
  bill(recordId: string): Promise<PayableBill | null>;
  /** Called once for every payment that succeeded on [recordId]. */
  paid(recordId: string, amount: number, paymentId: string): Promise<void>;
}

/** Events this module emits. */
export const PAYMENT_EVENTS = {
  initiated: "payment.initiated",
  succeeded: "payment.succeeded",
  failed: "payment.failed",
  refunded: "payment.refunded",
} as const;
