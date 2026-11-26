# @igongo/records-kit

The work-records engine shared by every module whose work is "a record that moves through steps": found items, tasks, leave requests, visitors, keys signed out, cash-ups, guest requests and so on. Like [@igongo/bookings-kit](../bookings-kit/README.md), each module keeps its own folder, Postgres schema, permissions and default set-up, and reuses this code.

## What the super admin controls (no code)

Each module's settings screen (`PUT /config`) edits, as data:

- **Record types**, such as "Found item" and "Lost item report". Each can be switched off, and marked *self-service* so people who only hold the create permission for their own records (ordinary staff, guests) may raise it.
- **Fields** of each type (Custom Fields, module 7): text, long text, number, money, date, time, choice, yes/no, staff member, photo, phone; required or not; shown in lists or not.
- **Statuses** of each type (Workflow & Approvals, module 9), in order. The first is the start. A status can need an approver, or close the record.
- Comments on or off, and a notice shown on the module's screens.

Old records are never changed by a set-up change; they keep their saved values.

## Permissions (`<module>.records.*`)

`view`, `create`, `edit`, `approve`, `export`, `comment`, and `<module>.settings.edit`. Scope `own` reaches only the caller's own records (raised by, for, or assigned to them); wider scopes are staff tools.

## Routes

See the comment at the top of `src/presentation/records-router.ts`. Every record has a running code (such as `LF-0042`) and a QR text `IGG-REC:LF-0042`, looked up with `GET /lookup/:code`.

## Data

`records` (kept for ever), `record_events` (each record's history: created, status, assigned, comment, edited) and `settings`, in the module's own schema.
