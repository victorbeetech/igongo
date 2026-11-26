# Loyalty (module 57)

Spec: [docs/modules/57-loyalty.md](../../docs/modules/57-loyalty.md).

Loyalty & Membership (module 57): members, points earned and spent, and the rewards catalogue.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `LY-0042`, QR text `IGG-REC:LY-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Member**: Name, Phone, Tier, Card number. Steps: Active, Suspended, Closed.
- **Points entry**: Member, Points (minus to spend), Reason. Steps: Posted.
- **Reward**: Reward, Points needed, How many left. Steps: Available, Ended.

## API

- **Routes** (`/api/loyalty`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `loyalty`: `records`, `record_events`, `settings`.
- **Permissions**: `loyalty.records.view|create|edit|approve|export|comment`, `loyalty.settings.edit`.
