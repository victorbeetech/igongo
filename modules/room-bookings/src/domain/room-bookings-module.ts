/**
 * Room Bookings (module 67) as a booking module: what it sells and how its
 * tickets are named. Everything else comes from @igongo/bookings-kit.
 */

import type { BookingModule } from "@igongo/bookings-kit";

export const roomBookingsModule: BookingModule = {
  key: "room-bookings",
  /** Codes look like RB-7KQ2MX. */
  prefix: "RB",
  kinds: ["nights"],
  noun: "Room booking",
};
