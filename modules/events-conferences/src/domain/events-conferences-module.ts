/**
 * Events & Conferences (module 69) as a booking module: what it sells and how its
 * tickets are named. Everything else comes from @igongo/bookings-kit.
 */

import type { BookingModule } from "@igongo/bookings-kit";

export const eventsConferencesModule: BookingModule = {
  key: "events-conferences",
  /** Codes look like EV-7KQ2MX. */
  prefix: "EV",
  kinds: ["slot", "enquiry"],
  noun: "Event booking",
};
