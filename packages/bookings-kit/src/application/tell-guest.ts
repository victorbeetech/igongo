/**
 * Tells the guest about their booking, in the app. A walk-in booked by staff has
 * no account (`userId` is null), so nothing is sent for them. The send is best
 * effort: the notifier never fails the change it reports.
 */

import type { Booking } from "../domain/booking";
import type { BookingsDeps } from "./bookings-deps";

/** Sends [message] about [b] to the guest's account, when they have one and the notifier is set. */
export async function tellGuest(deps: Pick<BookingsDeps, "notify">, b: Booking, message: { title: string; body: string }): Promise<void> {
  if (!deps.notify || !b.userId) return;
  await deps.notify([b.userId], { ...message, channel: "bookings", link: "/bookings" });
}
