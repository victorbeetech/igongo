# Promotions and vouchers (module 59)

Spec: [docs/modules/59-promotions-vouchers.md](../../docs/modules/59-promotions-vouchers.md).

Promotions, Vouchers & Gift Cards (module 59): promo codes, discounts, vouchers and gift cards, redeemed by code or QR.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `PV-0042`, QR text `IGG-REC:PV-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Promotion**: Name, Promo code, Discount (%), Where it works, Ends. Steps: Draft, Live, Ended.
- **Voucher or gift card**: For, Value (UGX), Expires, Buyer phone. Steps: Issued, Redeemed, Expired, Cancelled. Self-service (staff or guests raise their own).

## API

- **Routes** (`/api/promotions`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `promotions`: `records`, `record_events`, `settings`.
- **Permissions**: `promotions-vouchers.records.view|create|edit|approve|export|comment`, `promotions-vouchers.settings.edit`.
