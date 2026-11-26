/** Where a booking module's rules are kept. */

import type { BookingRules } from "../../domain/booking-rules";

export interface BookingRulesStore {
  read(): Promise<BookingRules>;
  write(rules: BookingRules, by: string | null, now: Date): Promise<void>;
}
