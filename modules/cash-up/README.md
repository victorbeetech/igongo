# Cash-up (module 79)

Spec: [docs/modules/79-cash-up.md](../../docs/modules/79-cash-up.md).

Cash-up & Reconciliation (module 79): end-of-shift cash-up for every cashier, rider and outlet, with variances flagged for checking.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `CU-0042`, QR text `IGG-REC:CU-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Cash-up**: Outlet or till, Expected (UGX), Cash counted (UGX), Mobile money (UGX), Card (UGX), Note on any difference. Steps: Submitted, Checked, Closed. Self-service (staff or guests raise their own).
- **Till opening**: Outlet or till, Opening float (UGX). Steps: Open, Closed. Self-service (staff or guests raise their own).

## API

- **Routes** (`/api/cash-up`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `cash_up`: `records`, `record_events`, `settings`.
- **Permissions**: `cash-up.records.view|create|edit|approve|export|comment`, `cash-up.settings.edit`.
