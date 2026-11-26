# Room Bookings (module 67)

Spec: [docs/modules/67-room-bookings.md](../../docs/modules/67-room-bookings.md).

A booking module built on [@igongo/bookings-kit](../../packages/bookings-kit/README.md): it sells `nights` offerings, with codes like `RB-7KQ2MX`.

- **Routes** (`/api/rooms`): `GET /offerings`, `GET /offerings/:id/availability`, `POST|PATCH /offerings`, `GET|PUT /rules`, `POST /bookings`, `GET /bookings/mine`, `GET /bookings`, `POST /bookings/:id/cancel|approve`, `POST /check-in`.
- **Data**: its own schema `rooms`: `offerings`, `bookings`, `settings`.
- **Permissions**: `room-bookings.bookings.create|view|edit|approve`, `room-bookings.offerings.edit`, `room-bookings.settings.edit`.
