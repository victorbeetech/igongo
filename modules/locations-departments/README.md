# Organisation (module 15)

Spec: [docs/modules/15-locations-departments.md](../../docs/modules/15-locations-departments.md).

Locations & Departments (module 15): the hotel's departments, locations and areas, outlets and cost centres, kept by the super admin.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `OR-0042`, QR text `IGG-REC:OR-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Department**: Name, Head of department, Part of, Phone. Steps: Active, Closed.
- **Location or area**: Name, Kind, Inside. Steps: Active, Closed.
- **Outlet**: Name, Kind, Opening hours. Steps: Open, Closed.
- **Cost centre**: Code, Name, Owner. Steps: Active, Closed.

## API

- **Routes** (`/api/org`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `org`: `records`, `record_events`, `settings`.
- **Permissions**: `locations-departments.records.view|create|edit|approve|export|comment`, `locations-departments.settings.edit`.
