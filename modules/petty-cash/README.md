# Petty cash (module 37)

Spec: [docs/modules/37-petty-cash.md](../../docs/modules/37-petty-cash.md).

Petty Cash & Expense Claims (module 37): claims with receipts and approvals, the petty cash box and cash counts.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `PC-0042`, QR text `IGG-REC:PC-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Expense claim**: What it was for, Amount (UGX), Date spent, Receipt photo, Department. Steps: Submitted, Approved, Paid, Rejected. Self-service (staff or guests raise their own).
- **Box top-up**: Amount (UGX), From. Steps: Requested, Approved, Received.
- **Cash count**: Expected (UGX), Counted (UGX), Note on any difference. Steps: Counted, Checked.

## API

- **Routes** (`/api/petty-cash`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `petty_cash`: `records`, `record_events`, `settings`.
- **Permissions**: `petty-cash.records.view|create|edit|approve|export|comment`, `petty-cash.settings.edit`.
