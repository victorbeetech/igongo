# Laundry (module 44)

Spec: [docs/modules/44-laundry.md](../../docs/modules/44-laundry.md).

Laundry (module 44): guest laundry requests, hotel linen and staff uniforms.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `LD-0042`, QR text `IGG-REC:LD-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Guest laundry**: Room, Items, Service, Price (UGX). Steps: Requested, Collected, Washing, Ready, Delivered. Self-service (staff or guests raise their own).
- **Linen batch**: Linen, Pieces, From. Steps: Received, Washing, Returned.
- **Uniform**: Staff member, Item, Size. Steps: Issued, In laundry, Returned.

## API

- **Routes** (`/api/laundry`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `laundry`: `records`, `record_events`, `settings`.
- **Permissions**: `laundry.records.view|create|edit|approve|export|comment`, `laundry.settings.edit`.
