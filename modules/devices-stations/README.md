# Devices (module 18)

Spec: [docs/modules/18-devices-stations.md](../../docs/modules/18-devices-stations.md).

Devices & Stations (module 18): every phone, tablet, reader, printer and kiosk, the station it serves, and its alerts.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `DV-0042`, QR text `IGG-REC:DV-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Device**: Name, Kind, Serial number, Station, Kept by, Photo. Steps: Active, Repair, Lost, Retired.
- **Station**: Name, Kind, Devices. Steps: Active, Off.
- **Device alert**: Device, Problem. Steps: Open, In progress, Done.

## API

- **Routes** (`/api/devices`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `devices`: `records`, `record_events`, `settings`.
- **Permissions**: `devices-stations.records.view|create|edit|approve|export|comment`, `devices-stations.settings.edit`.
