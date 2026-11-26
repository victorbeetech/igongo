// Where module 70 (Venues & Equipment) lives in the API, for the shared booking pages.

import type { BookingPlace } from "@/shared/bookings/types/bookingPlace";
import type { OfferingKind } from "@/shared/bookings/types/offering";

export const PLACE: BookingPlace = { path: "/api/venues", module: "venues-equipment", unit: "booking" };

/** What this module sells. */
export const KINDS: OfferingKind[] = ["slot", "stock", "enquiry"];
