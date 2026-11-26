# Meetings (module 51)

Spec: [docs/modules/51-meetings.md](../../docs/modules/51-meetings.md).

Meetings & Minutes (module 51): meetings, minutes and action items followed up to done.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `MT-0042`, QR text `IGG-REC:MT-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Meeting**: Subject, Date, Time, Place, Invited, Agenda, Minutes. Steps: Planned, Held, Minutes approved, Cancelled.
- **Action item**: Action, From meeting. Steps: Open, Done, Dropped.

## API

- **Routes** (`/api/meetings`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `meetings`: `records`, `record_events`, `settings`.
- **Permissions**: `meetings.records.view|create|edit|approve|export|comment`, `meetings.settings.edit`.
