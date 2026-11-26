/**
 * Use case: refund all or part of a succeeded payment (S77-05), with a
 * reason, by someone holding the refund permission. The money goes back by
 * the same channel by hand for now (provider refund calls come with the
 * live keys); this records it and keeps the books right.
 */

import { AppError, recordChange } from "@igongo/core";
import type { Payment } from "../../domain/payment";
import type { PaymentsDeps } from "../payments-deps";

export async function refundPayment(deps: PaymentsDeps, id: string, amount: number, reason: string): Promise<Payment> {
  const payment = await deps.payments.byId(id);
  if (!payment) throw new AppError("not_found", "Payment not found.");
  if (payment.status !== "succeeded" && payment.status !== "refunded") throw new AppError("conflict", "Only a paid payment can be refunded.");
  const left = payment.amount - payment.refundedAmount;
  if (amount > left) throw new AppError("bad_request", `Only ${left} UGX can still be refunded.`);
  const refunded: Payment = { ...payment, refundedAmount: payment.refundedAmount + amount, status: payment.refundedAmount + amount >= payment.amount ? "refunded" : "succeeded", message: `Refund: ${reason}` };
  await deps.payments.update(refunded);
  await recordChange(deps.change, { module: "payments", action: "payment.refunded", recordType: "payment", recordId: id, summary: `Refunded ${amount} UGX on ${payment.label}: ${reason}` });
  return refunded;
}
