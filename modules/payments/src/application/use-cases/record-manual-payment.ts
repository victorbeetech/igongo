/**
 * Use case: staff record a payment taken at a till (S77-08, S77-10): cash,
 * bank transfer, charge to room or corporate account. It succeeds at once
 * and the selling module is told. Charge to room is settled with APEX later.
 */

import type { PayableRef, PaymentMethod } from "@igongo/contracts/payments";
import { AppError, newId } from "@igongo/core";
import { METHOD_CATALOG } from "../../domain/method-catalog";
import { methodAllowed } from "../../domain/method-settings";
import type { Payment } from "../../domain/payment";
import type { PaymentsDeps } from "../payments-deps";
import { amountToTake, billOf } from "./bill-of";
import { settle } from "./settle-payment";

export interface ManualInput {
  ref: PayableRef;
  method: PaymentMethod;
  amount?: number;
  /** A receipt, slip or room number. */
  reference?: string;
}

export async function recordManualPayment(deps: PaymentsDeps, input: ManualInput): Promise<Payment> {
  const info = METHOD_CATALOG[input.method];
  if (info.kind !== "staff") throw new AppError("bad_request", `${info.name} is paid by the guest in the app.`);
  const settings = await deps.settings.read();
  if (!settings.allowManual) throw new AppError("method_disabled", "Recording payments by hand is switched off.");
  const bill = await billOf(deps, input.ref);
  if (!methodAllowed(settings, input.method, input.ref.module, bill.outlet)) throw new AppError("method_disabled", `${info.name} is not switched on here.`);
  const payment: Payment = {
    id: newId("pay"), module: input.ref.module, recordId: input.ref.recordId, label: bill.label, outlet: bill.outlet, method: input.method,
    amount: amountToTake(bill, input.amount), status: "pending", payerUserId: bill.payerUserId, payerPhone: null, providerRef: input.reference ?? null,
    redirectUrl: null, message: null, recordedBy: deps.change.actorId, refundedAmount: 0, createdAt: deps.change.now, settledAt: null,
  };
  await deps.payments.add(payment);
  return settle(deps, payment, "succeeded", `Recorded by ${deps.change.actorName ?? "staff"}${input.reference ? `, ref ${input.reference}` : ""}`);
}
