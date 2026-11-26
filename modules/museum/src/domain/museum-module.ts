/**
 * Museum (module 68) as a booking module: what it sells and how its
 * tickets are named. Everything else comes from @igongo/bookings-kit.
 */

import type { BookingModule } from "@igongo/bookings-kit";

export const museumModule: BookingModule = {
  key: "museum",
  /** Codes look like MU-7KQ2MX. */
  prefix: "MU",
  kinds: ["slot"],
  noun: "Museum ticket",
};
