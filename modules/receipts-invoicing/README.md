# Receipts and invoices (module 78)

Spec: [docs/modules/78-receipts-invoicing.md](../../docs/modules/78-receipts-invoicing.md).

Receipts & Invoicing (module 78): invoices, quotes, credit notes and statements, numbered and checkable by QR.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `DO-0042`, QR text `IGG-REC:DO-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Invoice**: Bill to, Items, Total (UGX), Due, Customer TIN. Steps: Draft, Sent, Part paid, Paid, Cancelled.
- **Quote**: For, Items, Total (UGX), Valid until. Steps: Draft, Sent, Accepted, Declined.
- **Credit note**: For, Against invoice, Amount (UGX), Reason. Steps: Draft, Approved, Issued.

## API

- **Routes** (`/api/documents`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `documents`: `records`, `record_events`, `settings`.
- **Permissions**: `receipts-invoicing.records.view|create|edit|approve|export|comment`, `receipts-invoicing.settings.edit`.
