# Tables and dine-in (module 64)

Spec: [docs/modules/64-tables-dinein.md](../../docs/modules/64-tables-dinein.md).

Tables & Dine-in (module 64) API: table reservations by date and time slot with seats as capacity, and check-in when the party arrives.

A booking module built on [@igongo/bookings-kit](../../packages/bookings-kit/README.md): it sells [`slot`] offerings, with codes like `TB-7KQ2MX`.

- **Routes** (`/api/tables`): `GET /offerings`, `GET /offerings/:id/availability`, `POST|PATCH /offerings`, `GET|PUT /rules`, `POST /bookings`, `GET /bookings/mine`, `GET /bookings`, `POST /bookings/:id/cancel|approve`, `POST /check-in`.
- **Data**: its own schema `tables`: `offerings`, `bookings`, `settings`.
- **Permissions**: `tables-dinein.bookings.create|view|edit|approve`, `tables-dinein.offerings.edit`, `tables-dinein.settings.edit`.
