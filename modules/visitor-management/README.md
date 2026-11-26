# Visitors (module 20)

Spec: [docs/modules/20-visitor-management.md](../../docs/modules/20-visitor-management.md).

Visitors & Contractors (module 20): pre-registered and walk-in visitors, contractors, gate vehicles and the blacklist.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `VS-0042`, QR text `IGG-REC:VS-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Visitor**: Name, Phone, Company, Visiting, Purpose, ID number, Vehicle plate, Photo. Steps: Expected, On site, Left, Refused. Self-service (staff or guests raise their own).
- **Contractor**: Company, Contact person, Phone, Work, From, To, Insurance checked. Steps: Approved, On site, Finished.
- **Gate vehicle**: Plate, Driver, Purpose, In or out. Steps: In, Out.
- **Blacklist entry**: Name, ID number, Reason, Photo. Steps: Barred, Lifted.

## API

- **Routes** (`/api/visitors`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `visitors`: `records`, `record_events`, `settings`.
- **Permissions**: `visitor-management.records.view|create|edit|approve|export|comment`, `visitor-management.settings.edit`.
