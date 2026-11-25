# Wristbands (module 17)

Reusable event wristbands, registered once and assigned by number range. Spec: [docs/modules/17-wristbands.md](../../docs/modules/17-wristbands.md).

- **Routes** (`/api/wristbands`): `GET /summary`, `GET /`, `POST /register-range`, `POST /assign-range`, `POST /reset-range`, `POST /scan` (verdict: ok, wrong_event, not_assigned, blocked, unknown), `GET /scans`, `GET /:number`, `PATCH /:number`.
- **QR code**: `IGG-BAND:<number>:<random token>`; a printed number alone cannot fake a band.
- **Schema** `bands`: `wristbands`, `band_scans` (every scan, kept).
- **Permissions**: `wristbands.bands.view` (scan), `.create` (register), `.edit` (ranges, missing, encode).
