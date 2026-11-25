# 59. Promotions, Vouchers & Gift Cards

**Group:** Guests and sales · **Module key:** `promotions-vouchers` · [All modules](README.md)

## Summary

Promo codes, discounts, vouchers and gift cards that work across outlets.

## Features
- Promo codes with rules: dates, outlets, items, minimum spend and usage limits.
- Happy hour and time-based offers.
- Vouchers for complaints, prizes and staff rewards.
- Gift cards bought in the app, with a QR code and balance.
- Redeem by scanning at any till.
- Fraud checks for overuse.

## Super admin options
- Who can create promotions.
- Maximum discount without approval.
- Which outlets accept which vouchers.


## Depends on

- [CRM: Guest & Client Profiles](54-crm-guests.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `promo.created`
- `voucher.issued`
- `voucher.redeemed`
- `giftcard.sold`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
