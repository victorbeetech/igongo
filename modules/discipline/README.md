# Discipline (module 35)

Spec: [docs/modules/35-discipline.md](../../docs/modules/35-discipline.md).

Discipline & Cases (module 35): a confidential file of incidents, warnings, hearings and outcomes, kept permanently.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `DC-0042`, QR text `IGG-REC:DC-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Case**: Staff member, What happened, Date, Witnesses, Evidence, Outcome. Steps: Opened, Hearing, Decided, Appealed, Closed.

## API

- **Routes** (`/api/discipline`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `discipline`: `records`, `record_events`, `settings`.
- **Permissions**: `discipline.records.view|create|edit|approve|export|comment`, `discipline.settings.edit`.
