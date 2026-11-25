# Attendance (module 25)

Clock in and out with a card at the gate or reception, or from the app. Spec: [docs/modules/25-attendance.md](../../docs/modules/25-attendance.md).

- **Routes** (`/api/attendance`): `GET /status`, `POST /clock` (own phone), `POST /station-clock` (card tap or QR), `GET /mine`, `GET /board`, `GET /on-site`, `GET /events`, `POST /corrections`, `GET|PUT /rules`.
- **Rules as data** (super admin): day start, grace minutes, phone clock-in on or off, double-tap seconds.
- Events are append-only; a correction is an extra `manual` event with a reason. Each event keeps the person's department at that moment.
- Uses `StaffDirectory` (HR) and `CardResolver` (cards) contracts only.
- **Permissions**: `attendance.clock.create` (self), `attendance.station.create` (scope all: gate, reception, security), `attendance.records.view|edit` (scope decides whose), `attendance.rules.edit`.
