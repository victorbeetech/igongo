# Promotions and vouchers (module 59)

Spec: [docs/modules/59-promotions-vouchers.md](../../docs/modules/59-promotions-vouchers.md).

Promotions, Vouchers & Gift Cards (module 59): promo codes, discounts, vouchers and gift cards, redeemed by code or QR.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `PV-0042`, QR text `IGG-REC:PV-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Promotion**: Name, Promo code, Discount (%), Where it works, Ends. Steps: Draft, Live, Ended.
- **Voucher or gift card**: For, Value (UGX), Expires, Buyer phone. Steps: Requested, Issued (needs an approver), Redeemed, Expired, Cancelled. Self-service (staff or guests raise their own requests).

## API

- **Routes** (`/api/promotions`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `promotions`: `records`, `record_events`, `settings`.
- **Permissions**: `promotions-vouchers.records.view|create|edit|approve|export|comment`, `promotions-vouchers.settings.edit`.

## Codes at checkout (`PromoDesk`)

Selling modules (Food Ordering first) check codes through the `PromoDesk` contract (`packages/contracts/promotions-vouchers`), built by the gateway:

- **Promo code**: a Promotion in status **Live** whose Promo code matches (any case), not past its end date, and whose "Where it works" is empty, "all", or names the module ("food") or outlet key ("main"). Takes the Discount (%) off the food. Reusable.
- **Voucher**: a Voucher in status **Issued** (approved), typed as its record code (`PV-0042`), not expired. Takes its Value off the food, once; anything over the bill is not kept. Placing the order moves it to **Redeemed**; cancelling the order gives it back (**Issued**).
- The discount is never more than the food; the delivery fee is always paid. Every price is worked out on the server.
- A guest's own voucher request starts at **Requested** and never works until an approver issues it.
