# Leave (module 27)

Spec: [docs/modules/27-leave.md](../../docs/modules/27-leave.md).

Leave Management (module 27): leave requests, approvals and the leave calendar. The leave types are a choice the super admin edits.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `LV-0042`, QR text `IGG-REC:LV-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Leave request**: Leave type, Days, Last day, Reason, Doctor's note, Covered by. Steps: Requested, Approved, Taken, Rejected, Cancelled. Self-service (staff or guests raise their own).

## API

- **Routes** (`/api/leave`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `leave`: `records`, `record_events`, `settings`.
- **Permissions**: `leave.records.view|create|edit|approve|export|comment`, `leave.settings.edit`.
