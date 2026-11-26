# Prices and taxes (module 76)

Spec: [docs/modules/76-pricing-tax.md](../../docs/modules/76-pricing-tax.md).

Prices, Taxes & Discounts (module 76): price lists, taxes and discount rules, with a history of every change.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `PT-0042`, QR text `IGG-REC:PT-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Price list**: Name, Applies to, From, Notes. Steps: Draft, Approved, Retired.
- **Tax**: Tax, Rate (%), Applies to, Included in prices. Steps: Active, Retired.
- **Discount rule**: Name, Discount (%), Who gets it, Ends. Steps: Draft, Approved, Ended.

## API

- **Routes** (`/api/pricing`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `pricing`: `records`, `record_events`, `settings`.
- **Permissions**: `pricing-tax.records.view|create|edit|approve|export|comment`, `pricing-tax.settings.edit`.
