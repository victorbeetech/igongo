# Museum (module 68)

Spec: [docs/modules/68-museum.md](../../docs/modules/68-museum.md).

A booking module built on [@igongo/bookings-kit](../../packages/bookings-kit/README.md): it sells `slot` offerings, with codes like `MU-7KQ2MX`.

- **Routes** (`/api/museum`): `GET /offerings`, `GET /offerings/:id/availability`, `POST|PATCH /offerings`, `GET|PUT /rules`, `POST /bookings`, `GET /bookings/mine`, `GET /bookings`, `POST /bookings/:id/cancel|approve`, `POST /check-in`.
- **Data**: its own schema `museum`: `offerings`, `bookings`, `settings`.
- **Permissions**: `museum.bookings.create|view|edit|approve`, `museum.offerings.edit`, `museum.settings.edit`.
