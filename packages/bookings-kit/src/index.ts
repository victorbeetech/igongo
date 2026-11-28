/**
 * @igongo/bookings-kit: the booking engine shared by every module that
 * takes bookings (Room Bookings, Museum, Events & Conferences, Pool, Crafts
 * & Bookshop). Each module keeps its own folder, Postgres schema, rules and
 * permissions; this package is the code they reuse. See README.md.
 */

export type { BookingModule } from "./application/booking-module";
export type { BookingsDeps } from "./application/bookings-deps";
export type { Booking, BookingStatus } from "./domain/booking";
export { bookingCode, depositOf, nightsBetween, priceOf, startingStatus } from "./domain/booking-math";
export { DEFAULT_BOOKING_RULES, type BookingRules } from "./domain/booking-rules";
export type { Offering, OfferingKind } from "./domain/offering";
export { bookingTables, type BookingTables } from "./infrastructure/db/booking-tables";
export { bookingKpis } from "./infrastructure/booking-kpis";
export { bookingPayable } from "./infrastructure/booking-payable";
export { unitsLeft } from "./application/use-cases/check-availability";
export { bookingsDeps } from "./infrastructure/bookings-deps-factory";
export { bookingPermissions } from "./presentation/booking-permissions";
export { BOOKING_QR_PREFIX, bookingsRouter } from "./presentation/bookings-router";
