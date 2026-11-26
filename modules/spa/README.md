# Spa / Humura (module 72)

Spec: [docs/modules/72-spa.md](../../docs/modules/72-spa.md).

Spa / Humura (module 72) API: treatments and sauna or steam sessions by date and time slot with capacity, deposits, and check-in at the spa.

A booking module built on [@igongo/bookings-kit](../../packages/bookings-kit/README.md): it sells [`slot`] offerings, with codes like `SP-7KQ2MX`.

- **Routes** (`/api/spa`): `GET /offerings`, `GET /offerings/:id/availability`, `POST|PATCH /offerings`, `GET|PUT /rules`, `POST /bookings`, `GET /bookings/mine`, `GET /bookings`, `POST /bookings/:id/cancel|approve`, `POST /check-in`.
- **Data**: its own schema `spa`: `offerings`, `bookings`, `settings`.
- **Permissions**: `spa.bookings.create|view|edit|approve`, `spa.offerings.edit`, `spa.settings.edit`.
