# Venues and equipment (module 70)

Spec: [docs/modules/70-venues-equipment.md](../../docs/modules/70-venues-equipment.md).

Venues & Equipment Hire (module 70) API: halls, gardens and tents by date and slot, chairs, sound and projectors from stock, and priced enquiries, with clash checks so nothing is double-booked.

A booking module built on [@igongo/bookings-kit](../../packages/bookings-kit/README.md): it sells [`slot`, `stock`, `enquiry`] offerings, with codes like `VE-7KQ2MX`.

- **Routes** (`/api/venues`): `GET /offerings`, `GET /offerings/:id/availability`, `POST|PATCH /offerings`, `GET|PUT /rules`, `POST /bookings`, `GET /bookings/mine`, `GET /bookings`, `POST /bookings/:id/cancel|approve`, `POST /check-in`.
- **Data**: its own schema `venues`: `offerings`, `bookings`, `settings`.
- **Permissions**: `venues-equipment.bookings.create|view|edit|approve`, `venues-equipment.offerings.edit`, `venues-equipment.settings.edit`.
