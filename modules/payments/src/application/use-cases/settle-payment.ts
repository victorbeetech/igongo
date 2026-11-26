/**
 * Use case: a payment's result is known (S77-03). Steps:
 *   1. ask the provider directly (callbacks are never trusted on their own),
 *   2. refuse a "success" for less than we asked,
 *   3. move the payment out of pending, once,
 *   4. tell the selling module, and record it.
 */

import { recordChange } from "@igongo/core";
import type { Payment } from "../../domain/payment";
import type { PaymentsDeps } from "../payments-deps";

/** Re-checks a pending provider payment and settles it. Returns the payment as it now is. */
export async function refreshPayment(deps: PaymentsDeps, payment: Payment): Promise<Payment> {
  const provider = deps.providers[payment.method];
  if (payment.status !== "pending" || !provider || !payment.providerRef) return payment;
  // 1. The provider's own word.
  const verdict = await provider.check(payment.providerRef, payment.id);
  if (verdict.status === "pending") return payment;
  // 2. A short payment is a failure.
  const short = verdict.status === "succeeded" && verdict.amount !== null && verdict.amount < payment.amount;
  const status = short ? "failed" : verdict.status;
  return settle(deps, payment, status, short ? `Paid ${verdict.amount} UGX, less than ${payment.amount} UGX.` : verdict.message);
}

/** Steps 3 and 4: settles [payment] as [status], once. */
export async function settle(deps: PaymentsDeps, payment: Payment, status: "succeeded" | "failed", message: string | null): Promise<Payment> {
  const now = deps.change.now;
  if (!(await deps.payments.settle(payment.id, status, message, now))) return (await deps.payments.byId(payment.id)) ?? payment;
  if (status === "succeeded") {
    await deps.payables[payment.module]?.paid(payment.recordId, payment.amount, payment.id);
    // Step 5: the receipt email. A skipped or failed email never undoes the payment.
    await deps.receipts?.sendReceipt({ ...payment, status, message, settledAt: now });
  }
  await recordChange(deps.change, {
    module: "payments",
    action: status === "succeeded" ? "payment.succeeded" : "payment.failed",
    recordType: "payment",
    recordId: payment.id,
    summary: `${payment.label}: ${payment.amount} UGX by ${payment.method} ${status}`,
  });
  return { ...payment, status, message, settledAt: now };
}
