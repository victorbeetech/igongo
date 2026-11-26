// Where module 64 (Tables & Dine-in) lives in the API, for the shared booking pages.

import type { BookingPlace } from "@/shared/bookings/types/bookingPlace";
import type { OfferingKind } from "@/shared/bookings/types/offering";

export const PLACE: BookingPlace = { path: "/api/tables", module: "tables-dinein", unit: "table" };

/** What this module sells. */
export const KINDS: OfferingKind[] = ["slot"];
