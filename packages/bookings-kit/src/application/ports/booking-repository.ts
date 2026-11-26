/** Where a booking module's bookings are kept. */

import type { Booking, BookingStatus } from "../../domain/booking";

export interface BookingRepository {
  byId(id: string): Promise<Booking | null>;
  byCode(code: string): Promise<Booking | null>;
  list(filter: { userId?: string; date?: string; status?: BookingStatus; limit: number }): Promise<Booking[]>;
  /** Units already held (not cancelled) of [offeringId] that clash with the wanted dates or slot. */
  unitsTaken(q: { offeringId: string; date: string; endDate: string | null; slot: string | null }): Promise<number>;
  add(booking: Booking): Promise<void>;
  update(booking: Booking): Promise<void>;
}
