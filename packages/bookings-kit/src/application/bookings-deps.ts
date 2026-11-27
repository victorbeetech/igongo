/** Everything the kit's use cases need, given by the gateway per request for one module. */

import type { ChangeContext } from "@igongo/core";
import type { BookingModule } from "./booking-module";
import type { BookingRepository } from "./ports/booking-repository";
import type { OfferingRepository } from "./ports/offering-repository";
import type { BookingRulesStore } from "./ports/rules-store";

export interface BookingsDeps {
  module: BookingModule;
  offerings: OfferingRepository;
  bookings: BookingRepository;
  rules: BookingRulesStore;
  change: ChangeContext;
  /** The secret that signs tickets (TICKET_SIGNING_KEY). Null or missing means ticket checks are off. */
  ticketKey?: string | null;
}
