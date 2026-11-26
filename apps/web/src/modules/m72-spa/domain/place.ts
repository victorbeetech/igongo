// Where module 72 (Spa / Humura) lives in the API, for the shared booking pages.

import type { BookingPlace } from "@/shared/bookings/types/bookingPlace";
import type { OfferingKind } from "@/shared/bookings/types/offering";

export const PLACE: BookingPlace = { path: "/api/spa", module: "spa", unit: "treatment" };

/** What this module sells. */
export const KINDS: OfferingKind[] = ["slot"];
