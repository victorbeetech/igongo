# Housekeeping (module 43)

Spec: [docs/modules/43-housekeeping.md](../../docs/modules/43-housekeeping.md).

Housekeeping & Room Status (module 43): the room board, cleaning assignments, minibar and amenity checks and room inspections.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `HK-0042`, QR text `IGG-REC:HK-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Room**: Room, Room type, Floor or block, Guest in, Notes. Steps: Dirty, Cleaning, Clean, Inspected, Out of order.
- **Cleaning job**: Room, Kind, Minibar used, Amenities restocked, Issues found, Photo. Steps: Assigned, Cleaning, Done, Inspected, Failed.

## API

- **Routes** (`/api/housekeeping`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `housekeeping`: `records`, `record_events`, `settings`.
- **Permissions**: `housekeeping.records.view|create|edit|approve|export|comment`, `housekeeping.settings.edit`.
