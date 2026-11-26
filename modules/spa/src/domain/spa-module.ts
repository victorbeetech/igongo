/**
 * Spa / Humura (module 72) as a booking module: what it sells and how its
 * tickets are named. Everything else comes from @igongo/bookings-kit.
 */

import type { BookingModule } from "@igongo/bookings-kit";

export const spaModule: BookingModule = {
  key: "spa",
  /** Codes look like SP-7KQ2MX. */
  prefix: "SP",
  kinds: ["slot"],
  noun: "Spa treatment",
};
