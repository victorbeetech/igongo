# Data jobs (module 13)

Spec: [docs/modules/13-data-import-export.md](../../docs/modules/13-data-import-export.md).

Data Import, Export & Backup (module 13): import, export, backup and restore requests, tracked from asking to done.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `DJ-0042`, QR text `IGG-REC:DJ-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Import**: What to import, Spreadsheet, Notes. Steps: Requested, Checked, Imported, Rejected.
- **Export**: What to export, From, To. Steps: Requested, Ready, Rejected.
- **Restore**: Record to restore, Reason. Steps: Requested, Approved, Restored, Rejected.

## API

- **Routes** (`/api/data-jobs`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `data_jobs`: `records`, `record_events`, `settings`.
- **Permissions**: `data-import-export.records.view|create|edit|approve|export|comment`, `data-import-export.settings.edit`.
