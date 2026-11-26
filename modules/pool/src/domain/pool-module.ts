/**
 * Pool (module 71) as a booking module: what it sells and how its
 * tickets are named. Everything else comes from @igongo/bookings-kit.
 */

import type { BookingModule } from "@igongo/bookings-kit";

export const poolModule: BookingModule = {
  key: "pool",
  /** Codes look like PL-7KQ2MX. */
  prefix: "PL",
  kinds: ["slot"],
  noun: "Pool pass",
};
