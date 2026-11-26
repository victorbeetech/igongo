/**
 * The permission keys of one booking module, built from its key, such as
 * `room-bookings.bookings.create`. The super admin gives them to roles.
 */

export function bookingPermissions(moduleKey: string) {
  return {
    /** Own: book for myself (guests). Wider: book for a walk-in guest (staff). */
    book: `${moduleKey}.bookings.create`,
    /** Own: my bookings. Wider: the day's bookings list. */
    view: `${moduleKey}.bookings.view`,
    /** Check in, scan tickets, cancel any booking (staff). */
    edit: `${moduleKey}.bookings.edit`,
    /** Approve requests and quote enquiries. */
    approve: `${moduleKey}.bookings.approve`,
    /** Add and change what is sold (staff). */
    offerings: `${moduleKey}.offerings.edit`,
    /** The module's booking rules. */
    rules: `${moduleKey}.settings.edit`,
  } as const;
}
