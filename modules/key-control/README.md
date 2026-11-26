# Key control (module 21)

Spec: [docs/modules/21-key-control.md](../../docs/modules/21-key-control.md).

Key Control (module 21): the key register, signing keys out and back in, and keys out now.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `KY-0042`, QR text `IGG-REC:KY-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Key**: Key, Opens, Copies, Kind. Steps: In the cabinet, Signed out, Lost, Retired.

## API

- **Routes** (`/api/keys`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `keys`: `records`, `record_events`, `settings`.
- **Permissions**: `key-control.records.view|create|edit|approve|export|comment`, `key-control.settings.edit`.
