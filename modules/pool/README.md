# Pool (module 71)

Spec: [docs/modules/71-pool.md](../../docs/modules/71-pool.md).

A booking module built on [@igongo/bookings-kit](../../packages/bookings-kit/README.md): it sells `slot` offerings, with codes like `PL-7KQ2MX`.

- **Routes** (`/api/pool`): `GET /offerings`, `GET /offerings/:id/availability`, `POST|PATCH /offerings`, `GET|PUT /rules`, `POST /bookings`, `GET /bookings/mine`, `GET /bookings`, `POST /bookings/:id/cancel|approve`, `POST /check-in`.
- **Data**: its own schema `pool`: `offerings`, `bookings`, `settings`.
- **Permissions**: `pool.bookings.create|view|edit|approve`, `pool.offerings.edit`, `pool.settings.edit`.
