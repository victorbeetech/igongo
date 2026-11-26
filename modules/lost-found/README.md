# Lost and found (module 46)

Spec: [docs/modules/46-lost-found.md](../../docs/modules/46-lost-found.md).

Lost & Found (module 46): items found and lost item reports, matched to owners, handed over or disposed after the holding time.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `LF-0042`, QR text `IGG-REC:LF-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Found item**: Item, Where it was found, Found by, Photo, Kept at. Steps: Found, Claimed, Handed over, Disposed.
- **Lost item report**: What I lost, Where, When, Phone, Details. Steps: Reported, Matched, Returned, Not found. Self-service (staff or guests raise their own).

## API

- **Routes** (`/api/lost-found`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `lost_found`: `records`, `record_events`, `settings`.
- **Permissions**: `lost-found.records.view|create|edit|approve|export|comment`, `lost-found.settings.edit`.
