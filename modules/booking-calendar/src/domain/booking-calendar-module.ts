/**
 * The module's key and permission prefix. The super admin's on/off switch for
 * the calendar is kept under this key, so turning it off hides the routes
 * with the module gate.
 */

export const bookingCalendarModule = {
  /** Module key used for the switch, permissions and audit. */
  key: "booking-calendar",
  /** Human name shown in the super admin. */
  name: "Booking calendar",
} as const;
