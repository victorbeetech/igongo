# Access zones (module 19)

Spec: [docs/modules/19-access-zones.md](../../docs/modules/19-access-zones.md).

Access Control & Zones (module 19): restricted areas, who may enter and when, temporary passes and the entry log.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `AZ-0042`, QR text `IGG-REC:AZ-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Zone**: Name, Who may enter, When, Entry by. Steps: Active, Off.
- **Temporary pass**: Person, Zone, From, To, Reason. Steps: Requested, Approved, Expired, Refused. Self-service (staff or guests raise their own).
- **Entry log**: Person, Zone, In or out, Result. Steps: Logged.

## API

- **Routes** (`/api/zones`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `zones`: `records`, `record_events`, `settings`.
- **Permissions**: `access-zones.records.view|create|edit|approve|export|comment`, `access-zones.settings.edit`.
