# Training (module 34)

Spec: [docs/modules/34-training.md](../../docs/modules/34-training.md).

Training & Certificates (module 34): courses, sessions, attendance and certificates with expiry dates.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `TR-0042`, QR text `IGG-REC:TR-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Course**: Course, Kind, Hours, Material or link. Steps: Active, Retired.
- **Training session**: Course, Trainer, Place, Staff attending. Steps: Planned, Held, Cancelled.
- **Certificate**: Staff member, Course, Expires, Copy. Steps: Valid, Expiring, Expired.
- **Training request**: Course I want, Why. Steps: Requested, Approved, Done, Rejected. Self-service (staff or guests raise their own).

## API

- **Routes** (`/api/training`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `training`: `records`, `record_events`, `settings`.
- **Permissions**: `training.records.view|create|edit|approve|export|comment`, `training.settings.edit`.
