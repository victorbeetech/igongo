# Tasks (module 42)

Spec: [docs/modules/42-tasks.md](../../docs/modules/42-tasks.md).

Tasks (module 42): work of any kind given to any staff, one-off or repeating, with due dates and history.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `TK-0042`, QR text `IGG-REC:TK-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Task**: What to do, Details, Priority, Repeats, Photo. Steps: To do, Doing, Done, Cancelled.

## API

- **Routes** (`/api/tasks`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `tasks`: `records`, `record_events`, `settings`.
- **Permissions**: `tasks.records.view|create|edit|approve|export|comment`, `tasks.settings.edit`.
