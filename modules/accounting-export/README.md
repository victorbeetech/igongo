# Accounting export (module 80)

Spec: [docs/modules/80-accounting-export.md](../../docs/modules/80-accounting-export.md).

Accounting Export (module 80): export batches for the accounting system and the account mapping notes.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `AE-0042`, QR text `IGG-REC:AE-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Export batch**: What, From, To, Format. Steps: Requested, Exported, Posted, Failed.
- **Account mapping**: Item in this system, Account code. Steps: Active, Retired.

## API

- **Routes** (`/api/accounting`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `accounting`: `records`, `record_events`, `settings`.
- **Permissions**: `accounting-export.records.view|create|edit|approve|export|comment`, `accounting-export.settings.edit`.
