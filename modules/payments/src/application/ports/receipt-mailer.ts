/**
 * Port: sends a payment's receipt email. It never throws: a failed or skipped
 * email is reported in the result, so it can never undo a payment.
 */

import type { Payment } from "../../domain/payment";

/** What happened to one receipt email. */
export type ReceiptResult = { sent: true } | { sent: false; reason: string };

export interface ReceiptMailer {
  /** Sends the receipt for [payment] to the payer, if the mailer is configured and knows the address. */
  sendReceipt(payment: Payment): Promise<ReceiptResult>;
}
