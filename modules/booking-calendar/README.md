# Booking Calendar

A calendar of spots available by date and room, for guests. It reads the live rooms and bookings from the booking engine ([@igongo/bookings-kit](../../packages/bookings-kit/README.md)), so a day shows **Spots full** exactly when the booking flow would refuse it.

- **Routes** (`/api/calendar`):
  - `GET /?from=YYYY-MM-DD&days=N`: the guest calendar. Availability only: each day has a status (`open`, `spots_full`, `closed`) and each visible room has units left. Guest names and booking details are never returned.
  - `GET /settings`, `PUT /settings`: the super admin's settings.
- **Settings** (super admin, one value under key `calendar`): `enabled` (on/off), `openWeekdays`, `fullRule` (`every_offering` or `any_offering`), `windowDays`.
- **Permissions**: `booking-calendar.settings.view`, `booking-calendar.settings.edit`.
- **Data**: its own schema `booking_calendar`, one settings table. No other module reads it.
- **Module switch**: `booking-calendar`, handled by the API's module gate.

## Layout

- `src/domain`: the day rule (`day-status.ts`), date helpers, settings defaults. Pure code.
- `src/application`: `read-calendar.ts` (guest view), `save-calendar-settings.ts`, and the settings port.
- `src/infrastructure`: the settings table and store.
- `src/presentation`: routes and request schemas.

Reminders for booked dates live in their own module folder and are not part of this one.
