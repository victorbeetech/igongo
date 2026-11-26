# Guest requests (module 60)

Spec: [docs/modules/60-guest-requests.md](../../docs/modules/60-guest-requests.md).

Guest Requests & Help Desk (module 60): guests ask for anything; the request goes to the right team and is tracked until done.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `GR-0042`, QR text `IGG-REC:GR-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Guest request**: What do you need?, Details, Room or place. Steps: Received, On the way, Done, Cancelled. Self-service (staff or guests raise their own).

## API

- **Routes** (`/api/guest-requests`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `guest_requests`: `records`, `record_events`, `settings`.
- **Permissions**: `guest-requests.records.view|create|edit|approve|export|comment`, `guest-requests.settings.edit`.
