/** Finds the bill for a record in a selling module, shared by the paying use cases. */

import type { PayableBill, PayableRef } from "@igongo/contracts/payments";
import { AppError } from "@igongo/core";
import type { PaymentsDeps } from "../payments-deps";

/** The bill for [ref]. @throws AppError when the module is off or the record is unknown */
export async function billOf(deps: PaymentsDeps, ref: PayableRef): Promise<PayableBill> {
  const payable = deps.payables[ref.module];
  if (!payable) throw new AppError("not_found", "That cannot be paid for here.");
  const bill = await payable.bill(ref.recordId);
  if (!bill) throw new AppError("not_found", "Nothing to pay was found.");
  return bill;
}

/** The amount to take: [asked], or everything still owed. @throws AppError outside the deposit..balance range */
export function amountToTake(bill: PayableBill, asked: number | undefined): number {
  const balance = bill.total - bill.paid;
  if (balance <= 0) throw new AppError("conflict", "This is already paid in full.");
  const amount = asked ?? balance;
  if (amount > balance) throw new AppError("bad_request", `Only ${balance} UGX is still owed.`);
  if (amount < Math.min(bill.minimumNow, balance)) throw new AppError("bad_request", `Please pay at least ${bill.minimumNow} UGX now.`);
  return amount;
}
