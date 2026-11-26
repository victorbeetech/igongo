// Where module 73 (Crafts & Bookshop) lives in the API, for the shared booking pages.

import type { BookingPlace } from "@/shared/bookings/types/bookingPlace";
import type { OfferingKind } from "@/shared/bookings/types/offering";

export const PLACE: BookingPlace = { path: "/api/shop", module: "crafts-bookshop", unit: "item" };

/** What this module sells. */
export const KINDS: OfferingKind[] = ["stock"];
