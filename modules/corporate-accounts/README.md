# Corporate accounts (module 55)

Spec: [docs/modules/55-corporate-accounts.md](../../docs/modules/55-corporate-accounts.md).

Corporate Accounts (module 55): companies, NGOs, government offices and schools that book often or on credit.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `CA-0042`, QR text `IGG-REC:CA-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Company**: Company, Kind, Contact person, Phone, Email, TIN, Credit limit (UGX), Agreed discount (%). Steps: Applied, Approved, On hold, Closed.
- **Account statement note**: Company, Amount owed (UGX), Due, Notes. Steps: Open, Paid, Written off.

## API

- **Routes** (`/api/corporate`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `corporate`: `records`, `record_events`, `settings`.
- **Permissions**: `corporate-accounts.records.view|create|edit|approve|export|comment`, `corporate-accounts.settings.edit`.
