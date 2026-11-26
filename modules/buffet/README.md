# Buffet (module 65)

Spec: [docs/modules/65-buffet.md](../../docs/modules/65-buffet.md).

Buffet Service (module 65): buffet sessions with capacity and price, people served, and tickets. Staff bonus passes are served by Bonuses & Rewards at the buffet station.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `BF-0042`, QR text `IGG-REC:BF-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Buffet session**: Name, Meal, Price per person (UGX), Places, Served so far. Steps: Planned, Open, Closed.
- **Buffet ticket**: Session, People, Phone. Steps: Booked, Served, Cancelled. Self-service (staff or guests raise their own).

## API

- **Routes** (`/api/buffet`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `buffet`: `records`, `record_events`, `settings`.
- **Permissions**: `buffet.records.view|create|edit|approve|export|comment`, `buffet.settings.edit`.
