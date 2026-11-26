# Crafts & Bookshop (module 73)

Spec: [docs/modules/73-crafts-bookshop.md](../../docs/modules/73-crafts-bookshop.md).

A booking module built on [@igongo/bookings-kit](../../packages/bookings-kit/README.md): it sells `stock` offerings, with codes like `SH-7KQ2MX`.

- **Routes** (`/api/shop`): `GET /offerings`, `GET /offerings/:id/availability`, `POST|PATCH /offerings`, `GET|PUT /rules`, `POST /bookings`, `GET /bookings/mine`, `GET /bookings`, `POST /bookings/:id/cancel|approve`, `POST /check-in`.
- **Data**: its own schema `shop`: `offerings`, `bookings`, `settings`.
- **Permissions**: `crafts-bookshop.bookings.create|view|edit|approve`, `crafts-bookshop.offerings.edit`, `crafts-bookshop.settings.edit`.
