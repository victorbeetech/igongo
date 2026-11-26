# Fleet and transport (module 47)

Spec: [docs/modules/47-fleet-transport.md](../../docs/modules/47-fleet-transport.md).

Fleet & Transport (module 47): vehicles, trip requests and guest transfers, fuel and repairs.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `FL-0042`, QR text `IGG-REC:FL-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Vehicle**: Plate, Model, Seats, Usual driver, Insurance ends. Steps: Available, On a trip, In repair, Retired.
- **Trip or transfer**: From, To, Date, Time, People, Vehicle, Driver, Price (UGX). Steps: Requested, Approved, On the way, Done, Cancelled. Self-service (staff or guests raise their own).
- **Fuel or repair**: Vehicle, Kind, Amount (UGX), Odometer (km), Receipt. Steps: Submitted, Approved, Paid.

## API

- **Routes** (`/api/fleet`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `fleet`: `records`, `record_events`, `settings`.
- **Permissions**: `fleet-transport.records.view|create|edit|approve|export|comment`, `fleet-transport.settings.edit`.
