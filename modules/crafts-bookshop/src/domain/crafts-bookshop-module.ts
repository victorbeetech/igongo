/**
 * Crafts & Bookshop (module 73) as a booking module: what it sells and how its
 * tickets are named. Everything else comes from @igongo/bookings-kit.
 */

import type { BookingModule } from "@igongo/bookings-kit";

export const craftsBookshopModule: BookingModule = {
  key: "crafts-bookshop",
  /** Codes look like SH-7KQ2MX. */
  prefix: "SH",
  kinds: ["stock"],
  noun: "Shop order",
};
