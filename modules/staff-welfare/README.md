# Staff requests and welfare (module 36)

Spec: [docs/modules/36-staff-welfare.md](../../docs/modules/36-staff-welfare.md).

Staff Requests & Welfare (module 36): uniforms, letters, grievances, welfare contributions and support.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `WF-0042`, QR text `IGG-REC:WF-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Staff request**: Request, Details. Steps: Requested, In progress, Done, Declined. Self-service (staff or guests raise their own).
- **Welfare support**: Staff member, Reason, Amount (UGX), Notes. Steps: Requested, Approved, Done, Rejected.

## API

- **Routes** (`/api/welfare`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `welfare`: `records`, `record_events`, `settings`.
- **Permissions**: `staff-welfare.records.view|create|edit|approve|export|comment`, `staff-welfare.settings.edit`.
