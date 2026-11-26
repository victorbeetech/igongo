// "Pay now" for anything still owed: opens the Pay page (S77-01) for the
// selling module's record. Used by bookings and food orders.

import { Button } from "@/shared/ui/button/Button";

/** A pay link for [recordId] of [module], shown only while money is owed. */
export function PayButton({ module, recordId, owed }: { module: string; recordId: string; owed: number }) {
  if (owed <= 0) return null;
  return <Button href={`/payments/pay?module=${module}&record=${recordId}`}>Pay now</Button>;
}
