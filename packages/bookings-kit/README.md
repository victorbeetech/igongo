# @igongo/bookings-kit

The booking engine every bookable module reuses, so it is written once:
Room Bookings (67), Museum (68), Events & Conferences (69), Pool (71) and
Crafts & Bookshop (73). Each module still has its own folder, its own
Postgres schema (`rooms`, `museum`, `events`, `pool`, `shop`), rules,
permissions and switch, so one failing never breaks the others.

- **Offerings** (what is sold), by kind: `nights` (rooms), `slot` (tickets, tours, passes, lessons; per date and time), `stock` (shop items), `enquiry` (event requests priced by staff).
- **Bookings**: requested → awaiting payment (deposit) → confirmed → checked in; or cancelled. Codes like `RB-7KQ2MX`, QR `IGG-BK:<code>`.
- **Availability**: capacity minus clashing bookings (overlapping stays, or the same day and slot); stock is taken off the shelf at once in one statement.
- **Rules** (per module, as data): deposit percent, approval, cancel deadline, unit limit.
- **Payments**: `bookingPayable` gives Payments the bill and takes the payments.
- **Routes**: `bookingsRouter(moduleKey, deps)`; see the comment in `src/presentation/bookings-router.ts`.
- **Permissions**: `<module>.bookings.create|view|edit|approve`, `<module>.offerings.edit`, `<module>.settings.edit`; staff tools need a scope wider than `own`.
