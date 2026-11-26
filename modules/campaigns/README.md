# Campaigns (module 58)

Spec: [docs/modules/58-campaigns.md](../../docs/modules/58-campaigns.md).

Marketing Campaigns (module 58): campaigns planned, approved and their results. Sending waits for the SMS, WhatsApp and email accounts.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `CP-0042`, QR text `IGG-REC:CP-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Campaign**: Name, Channel, Audience, Message, Send on, People reached. Steps: Draft, Approved, Sent, Finished, Cancelled.

## API

- **Routes** (`/api/campaigns`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `campaigns`: `records`, `record_events`, `settings`.
- **Permissions**: `campaigns.records.view|create|edit|approve|export|comment`, `campaigns.settings.edit`.
