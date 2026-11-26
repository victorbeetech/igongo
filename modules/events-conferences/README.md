# Events & Conferences (module 69)

Spec: [docs/modules/69-events-conferences.md](../../docs/modules/69-events-conferences.md).

A booking module built on [@igongo/bookings-kit](../../packages/bookings-kit/README.md): it sells `slot` and `enquiry` offerings, with codes like `EV-7KQ2MX`.

- **Routes** (`/api/events`): `GET /offerings`, `GET /offerings/:id/availability`, `POST|PATCH /offerings`, `GET|PUT /rules`, `POST /bookings`, `GET /bookings/mine`, `GET /bookings`, `POST /bookings/:id/cancel|approve`, `POST /check-in`.
- **Data**: its own schema `events`: `offerings`, `bookings`, `settings`.
- **Permissions**: `events-conferences.bookings.create|view|edit|approve`, `events-conferences.offerings.edit`, `events-conferences.settings.edit`.
