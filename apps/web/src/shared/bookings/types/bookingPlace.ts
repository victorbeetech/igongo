// Which booking module a page talks to: its API path and module key, and
// its words. Rooms, Museum, Events, Pool and the Shop each pass their own.

export interface BookingPlace {
  /** The API path, such as `/api/rooms`. */
  path: string;
  /** The module key, for payments, such as `room-bookings`. */
  module: string;
  /** What one unit is called: "room", "ticket", "person", "item". */
  unit: string;
}
