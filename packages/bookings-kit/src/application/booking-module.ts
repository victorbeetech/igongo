/** How a module uses the kit: its key (for permissions and the audit), ticket prefix and words. */

import type { OfferingKind } from "../domain/offering";

export interface BookingModule {
  /** The module key, such as `room-bookings`. Permissions are `<key>.bookings.create` and so on. */
  key: string;
  /** Ticket code prefix, such as `RB`. */
  prefix: string;
  /** The kinds of offering this module sells. */
  kinds: OfferingKind[];
  /** What one booking is called, such as "room booking" or "pool pass". */
  noun: string;
}
