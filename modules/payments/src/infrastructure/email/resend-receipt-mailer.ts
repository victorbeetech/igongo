/**
 * Sends receipt emails through Resend. It does nothing until the owner sets the
 * RESEND_API_KEY secret and a sender address (RECEIPT_FROM); until then every
 * call returns "not configured" and no request leaves the API.
 */

import type { Payment } from "../../domain/payment";
import { receiptEmail } from "../../domain/receipt-email";
import type { ReceiptMailer, ReceiptResult } from "../../application/ports/receipt-mailer";

/** The Resend endpoint for sending one email. */
export const RESEND_ENDPOINT = "https://api.resend.com/emails";

/** What the mailer needs: the key and sender, and how to find the payer's address. */
export interface ResendConfig {
  /** The API key, read at send time: the super admin's setting first, else the RESEND_API_KEY secret. */
  apiKey: () => Promise<string | null | undefined>;
  /** The sender, such as "Igongo <receipts@yourdomain>", read at send time the same way. */
  from: () => Promise<string | null | undefined>;
  /** The payer's email address for a user ID, or null when unknown. */
  emailOf: (userId: string) => Promise<string | null>;
  /** The HTTP function, injectable for tests. */
  fetch?: typeof fetch;
  /** The clock, injectable for tests. */
  now?: () => Date;
}

/** Builds the Resend-backed receipt mailer. */
export function resendReceiptMailer(config: ResendConfig): ReceiptMailer {
  return {
    async sendReceipt(payment: Payment): Promise<ReceiptResult> {
      // Step 1: not configured yet, so nothing is sent.
      const key = await config.apiKey();
      const from = await config.from();
      if (!key) return { sent: false, reason: "RESEND_API_KEY is not set" };
      if (!from) return { sent: false, reason: "RECEIPT_FROM is not set" };
      // Step 2: the payer needs an address on file.
      if (!payment.payerUserId) return { sent: false, reason: "no payer account" };
      const to = await config.emailOf(payment.payerUserId);
      if (!to) return { sent: false, reason: "payer has no email address" };
      // Step 3: send the receipt; a refusal or network error is reported, never thrown.
      const email = receiptEmail(payment, (config.now ?? (() => new Date()))());
      const send = config.fetch ?? fetch;
      try {
        const res = await send(RESEND_ENDPOINT, {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({ from, to: [to], subject: email.subject, text: email.text, html: email.html }),
        });
        if (!res.ok) return { sent: false, reason: `Resend refused the receipt (${res.status})` };
        return { sent: true };
      } catch (error) {
        return { sent: false, reason: `Resend could not be reached: ${error instanceof Error ? error.message : String(error)}` };
      }
    },
  };
}
