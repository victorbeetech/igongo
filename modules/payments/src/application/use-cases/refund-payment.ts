/**
 * Use case: refund all or part of a succeeded payment (S77-05), with a
 * reason, by someone holding the refund permission. When the payment's
 * provider can refund (card through Flutterwave), the money is sent back
 * through it first; otherwise (cash, MoMo, Airtel until their refund keys
 * come) it goes back by hand and this records it and keeps the books right.
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
  // Through the provider when it can; a refusal stops here, so nothing is recorded twice.
  const provider = deps.providers[payment.method];
  const sent = provider?.refund && payment.providerRef ? await provider.refund(payment.providerRef, payment.id, amount) : null;
  const how = sent ? sent.message : "Pay it back by hand.";
  const refunded: Payment = { ...payment, refundedAmount: payment.refundedAmount + amount, status: payment.refundedAmount + amount >= payment.amount ? "refunded" : "succeeded", message: `Refund: ${reason}. ${how}` };
  await deps.payments.update(refunded);
  await recordChange(deps.change, { module: "payments", action: "payment.refunded", recordType: "payment", recordId: id, summary: `Refunded ${amount} UGX on ${payment.label}: ${reason} (${sent ? "through the provider" : "by hand"})` });
  return refunded;
}
