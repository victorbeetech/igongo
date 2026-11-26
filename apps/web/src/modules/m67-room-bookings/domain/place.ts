// Where module 67 (Room Bookings) lives in the API, for the shared booking pages.

import type { BookingPlace } from "@/shared/bookings/types/bookingPlace";
import type { OfferingKind } from "@/shared/bookings/types/offering";

export const PLACE: BookingPlace = { path: "/api/rooms", module: "room-bookings", unit: "room" };

/** What this module sells. */
export const KINDS: OfferingKind[] = ["nights"];
