/** A booking module as a `Payable`, so Payments can take deposits and balances. */

import type { Payable } from "@igongo/contracts/payments";
import type { BookingsDeps } from "../application/bookings-deps";
import { recordBookingPayment } from "../application/use-cases/change-booking";
import { depositOf } from "../domain/booking-math";

export function bookingPayable(deps: BookingsDeps): Payable {
  return {
    async bill(id) {
      const b = await deps.bookings.byId(id);
      // Requests are not priced yet; cancelled ones are closed.
      if (!b || b.status === "cancelled" || b.status === "requested") return null;
      const deposit = b.status === "awaiting_payment" ? depositOf(await deps.rules.read(), b.total) : 0;
      return { label: `${deps.module.noun} ${b.code}`, total: b.total, paid: b.paid, minimumNow: Math.max(0, deposit - b.paid), payerUserId: b.userId, outlet: null };
    },
    paid: (id, amount) => recordBookingPayment(deps, id, amount),
  };
}
