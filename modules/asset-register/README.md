# Assets (module 41)

Spec: [docs/modules/41-asset-register.md](../../docs/modules/41-asset-register.md).

Asset Register (module 41): equipment and property with QR tags, where each is, its condition, and asset counts.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `AS-0042`, QR text `IGG-REC:AS-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Asset**: Name, Category, Location, Serial number, Bought on, Cost (UGX), Kept by, Photo. Steps: In use, In repair, In store, Disposed.
- **Asset count**: Area counted, Items found, Missing items. Steps: Counting, Done.

## API

- **Routes** (`/api/assets`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `assets`: `records`, `record_events`, `settings`.
- **Permissions**: `asset-register.records.view|create|edit|approve|export|comment`, `asset-register.settings.edit`.
