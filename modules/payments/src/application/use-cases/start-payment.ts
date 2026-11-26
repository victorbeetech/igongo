/**
 * Use case: the payer pays in the app (S77-01, S77-02). Steps:
 *   1. find the bill and check the payer may pay it,
 *   2. check the method is switched on for this module and outlet,
 *   3. work out the amount (deposit up to the balance),
 *   4. a double tap (the same payer, record, method and amount still
 *      pending from the last few minutes) gets that same payment back,
 *      so the payer is never charged twice,
 *   5. save a pending payment, then ask the provider to charge.
 * The result comes later by callback, or when the app asks again.
 */

import type { PayableRef, PaymentMethod } from "@igongo/contracts/payments";
import { AppError, newId, recordChange } from "@igongo/core";
import { METHOD_CATALOG } from "../../domain/method-catalog";
import { methodAllowed } from "../../domain/method-settings";
import type { Payment } from "../../domain/payment";
import { toMsisdn } from "../../domain/uganda-phone";
import type { PaymentsDeps } from "../payments-deps";
import { amountToTake, billOf } from "./bill-of";

/** How long a pending charge counts as "the same tap" (a mobile money prompt times out after about 5 minutes). */
const SAME_CHARGE_MINUTES = 5;

export interface StartInput {
  ref: PayableRef;
  method: PaymentMethod;
  amount?: number;
  phone?: string;
  payer: { userId: string; name: string; email: string };
  /** True when the caller is staff paying for someone else. */
  onBehalf: boolean;
}

export async function startPayment(deps: PaymentsDeps, input: StartInput): Promise<Payment> {
  // 1. The bill, and whose it is.
  const bill = await billOf(deps, input.ref);
  if (!input.onBehalf && bill.payerUserId !== input.payer.userId) throw new AppError("permission_denied", "You can only pay for your own orders and bookings.");
  // 2. The method.
  const info = METHOD_CATALOG[input.method];
  if (info.kind === "staff") throw new AppError("bad_request", `${info.name} is taken by staff at the till.`);
  if (!methodAllowed(await deps.settings.read(), input.method, input.ref.module, bill.outlet)) throw new AppError("method_disabled", `${info.name} is not switched on here.`);
  const provider = deps.providers[input.method];
  if (!provider) throw new AppError("not_configured", `${info.name} is not set up yet.`);
  const msisdn = info.kind === "prompt" ? toMsisdn(input.phone ?? "") : null;
  if (info.kind === "prompt" && !msisdn) throw new AppError("bad_request", "Enter a Ugandan mobile money number, such as 0772 123456.");
  // 3. How much.
  const amount = amountToTake(bill, input.amount);
  // 4. Double tap: the same charge still waiting is returned, not started again.
  const since = deps.change.now.getTime() - SAME_CHARGE_MINUTES * 60_000;
  const waiting = (await deps.payments.forRecord(input.ref.module, input.ref.recordId)).find(
    (p) => p.status === "pending" && p.method === input.method && p.amount === amount && p.payerUserId === bill.payerUserId && p.createdAt.getTime() >= since,
  );
  if (waiting) return waiting;
  // 5. Pending first, so a fast callback always finds it.
  const id = newId("pay");
  const payment: Payment = {
    id, module: input.ref.module, recordId: input.ref.recordId, label: bill.label, outlet: bill.outlet, method: input.method, amount, status: "pending",
    payerUserId: bill.payerUserId, payerPhone: msisdn, providerRef: null, redirectUrl: null, message: null, recordedBy: input.onBehalf ? input.payer.userId : null,
    refundedAmount: 0, createdAt: deps.change.now, settledAt: null,
  };
  await deps.payments.add(payment);
  try {
    const started = await provider.start({
      paymentId: id, amount, label: bill.label, msisdn, payerName: input.payer.name, payerEmail: input.payer.email,
      callbackUrl: `${deps.apiBase}/api/payments/callbacks/${input.method}/${id}`, returnUrl: `${deps.webBase}/payments/payment-result/${id}`,
    });
    Object.assign(payment, { providerRef: started.providerRef, redirectUrl: started.redirectUrl, message: started.message });
    await deps.payments.update(payment);
  } catch (error) {
    // The charge never started: fail the pending payment, then report why.
    await deps.payments.settle(id, "failed", error instanceof Error ? error.message : "The provider did not answer.", deps.change.now);
    throw error;
  }
  await recordChange(deps.change, { module: "payments", action: "payment.initiated", recordType: "payment", recordId: id, summary: `${bill.label}: ${amount} UGX by ${info.name} started` });
  return payment;
}
