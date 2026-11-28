// The permission keys the booking settings pages check before drawing their change
// forms. They are the same keys the API checks (packages/bookings-kit, booking-permissions),
// so the page and the server agree. The server still refuses any change without them,
// so hiding a form is never the only guard.

/** The keys for one booking module, built from its module key (the place's `module`, such as `events-conferences`). */
export function settingsPermissions(moduleKey: string) {
  return {
    /** The module's booking rules: deposit, approval, cancel deadline and the most per booking. */
    rules: `${moduleKey}.settings.edit`,
    /** Add and change what is on sale: names, prices, capacity, times and dates. */
    offerings: `${moduleKey}.offerings.edit`,
  } as const;
}
