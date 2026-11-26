# Shifts and rosters (module 26)

Spec: [docs/modules/26-shifts-rosters.md](../../docs/modules/26-shifts-rosters.md).

Shifts & Rosters (module 26): who works when, shift swaps and open shifts. Attendance reads the times.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `SH-0042`, QR text `IGG-REC:SH-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Shift**: Staff member, Starts, Ends, Department, Role. Steps: Planned, Worked, Cancelled.
- **Open shift**: Starts, Ends, Department, Taken by. Steps: Open, Filled, Cancelled.
- **Swap request**: Swap with, My shift (day and time), Their shift, Reason. Steps: Requested, Approved, Done, Rejected. Self-service (staff or guests raise their own).

## API

- **Routes** (`/api/shifts`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `shifts`: `records`, `record_events`, `settings`.
- **Permissions**: `shifts-rosters.records.view|create|edit|approve|export|comment`, `shifts-rosters.settings.edit`.
