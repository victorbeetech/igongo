// Where module 71 (Pool) lives in the API, for the shared booking pages.

import type { BookingPlace } from "@/shared/bookings/types/bookingPlace";
import type { OfferingKind } from "@/shared/bookings/types/offering";

export const PLACE: BookingPlace = { path: "/api/pool", module: "pool", unit: "person" };

/** What this module sells. */
export const KINDS: OfferingKind[] = ["slot"];
