// Something a booking module sells (a room type, ticket, pass, event or shop
// item), as the API returns it (packages/bookings-kit).

/** How it is booked: nights (rooms), slot (tickets), stock (shop), enquiry (events). */
export type OfferingKind = "nights" | "slot" | "stock" | "enquiry";

export interface Offering {
  id: string;
  kind: OfferingKind;
  name: string;
  description: string | null;
  price: number;
  capacity: number;
  slots: string[];
  onDate: string | null;
  photoUrl: string | null;
  details: Record<string, string>;
  active: boolean;
  visibleToClients: boolean;
  sortOrder: number;
}
