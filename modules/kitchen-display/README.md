# Kitchen production (module 63)

Spec: [docs/modules/63-kitchen-display.md](../../docs/modules/63-kitchen-display.md).

Kitchen Display & Production (module 63): the production list for pre-orders and events, and food waste. Live tickets are on Food Ordering's kitchen board.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `KD-0042`, QR text `IGG-REC:KD-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Production item**: Dish, Quantity, For (order or event), Ready by, Station. Steps: To prepare, Preparing, Ready, Cancelled.
- **Food waste**: Item, Quantity, Reason, Cost (UGX). Steps: Logged.

## API

- **Routes** (`/api/kitchen`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `kitchen`: `records`, `record_events`, `settings`.
- **Permissions**: `kitchen-display.records.view|create|edit|approve|export|comment`, `kitchen-display.settings.edit`.
