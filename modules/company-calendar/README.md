# Company calendar (module 53)

Spec: [docs/modules/53-company-calendar.md](../../docs/modules/53-company-calendar.md).

Company Calendar (module 53): public holidays, events, meetings, training, birthdays and closures in one calendar.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `CL-0042`, QR text `IGG-REC:CL-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Calendar entry**: Title, Kind, Ends, Time, Who it is for. Steps: Planned, Cancelled.

## API

- **Routes** (`/api/calendar`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `calendar`: `records`, `record_events`, `settings`.
- **Permissions**: `company-calendar.records.view|create|edit|approve|export|comment`, `company-calendar.settings.edit`.
