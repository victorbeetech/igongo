/**
 * Something a booking module sells (a room type, a museum ticket or tour,
 * a pool pass, an event, a shop product). Its kind decides how it is booked:
 *   nights:  check-in and check-out dates, capacity = rooms of this type;
 *   slot:    a date and a time slot (or the whole day), capacity per slot;
 *   stock:   a quantity, capacity = items in stock (no date);
 *   enquiry: a request with a date and guest count, priced later by staff.
 */

export const OFFERING_KINDS = ["nights", "slot", "stock", "enquiry"] as const;
export type OfferingKind = (typeof OFFERING_KINDS)[number];

export interface Offering {
  id: string;
  kind: OfferingKind;
  name: string;
  description: string | null;
  /** Whole shillings per unit (per room per night, per ticket, per item). Set by staff. */
  price: number;
  /** Rooms, places per slot, or items in stock. */
  capacity: number;
  /** Time slots for `slot` offerings, `HH:MM`; empty means a whole-day pass. */
  slots: string[];
  /** A fixed date (an event's day), or null for any day. */
  onDate: string | null;
  photoUrl: string | null;
  /** Extra facts shown to guests, such as amenities or the maker's name. */
  details: Record<string, string>;
  active: boolean;
  visibleToClients: boolean;
  sortOrder: number;
  updatedAt: Date;
}
