/**
 * Tables and dine-in (module 64) as a booking module: what it sells and how its
 * tickets are named. Everything else comes from @igongo/bookings-kit.
 */

import type { BookingModule } from "@igongo/bookings-kit";

export const tablesDineinModule: BookingModule = {
  key: "tables-dinein",
  /** Codes look like TB-7KQ2MX. */
  prefix: "TB",
  kinds: ["slot"],
  noun: "Table reservation",
};
