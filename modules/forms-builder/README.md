# Forms (module 8)

Spec: [docs/modules/08-forms-builder.md](../../docs/modules/08-forms-builder.md).

Forms & Templates Builder (module 8): the super admin designs forms as record types with their own fields, and staff or guests fill them in.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `FM-0042`, QR text `IGG-REC:FM-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **General form**: Details. Steps: Submitted, Reviewed. Self-service (staff or guests raise their own).

## API

- **Routes** (`/api/forms`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `forms`: `records`, `record_events`, `settings`.
- **Permissions**: `forms-builder.records.view|create|edit|approve|export|comment`, `forms-builder.settings.edit`.
