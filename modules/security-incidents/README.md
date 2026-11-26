# Security (module 45)

Spec: [docs/modules/45-security-incidents.md](../../docs/modules/45-security-incidents.md).

Security, Patrols & Incidents (module 45): incident reports, patrol rounds and panic alerts.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `SC-0042`, QR text `IGG-REC:SC-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Incident**: What happened, Kind, Details, People involved, Photo, Police called. Steps: Reported, Investigating, Closed. Self-service (staff or guests raise their own).
- **Patrol round**: Route, Checkpoints passed, Anything found. Steps: Started, Done.
- **Panic alert**: Where, What is wrong. Steps: Raised, Responding, Resolved. Self-service (staff or guests raise their own).

## API

- **Routes** (`/api/security`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `security`: `records`, `record_events`, `settings`.
- **Permissions**: `security-incidents.records.view|create|edit|approve|export|comment`, `security-incidents.settings.edit`.
