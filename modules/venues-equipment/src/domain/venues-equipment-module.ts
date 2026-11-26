/**
 * Venues and equipment (module 70) as a booking module: what it sells and how its
 * tickets are named. Everything else comes from @igongo/bookings-kit.
 */

import type { BookingModule } from "@igongo/bookings-kit";

export const venuesEquipmentModule: BookingModule = {
  key: "venues-equipment",
  /** Codes look like VE-7KQ2MX. */
  prefix: "VE",
  kinds: ["slot", "stock", "enquiry"],
  noun: "Venue or equipment hire",
};
