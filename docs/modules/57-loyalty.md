# 57. Loyalty & Membership

**Group:** Guests and sales · **Module key:** `loyalty` · [All modules](README.md)

## Summary

Rewards returning guests with points, tiers and memberships across every outlet.

## Features
- Earn points on rooms, food, events, museum, pool, spa and shop.
- Tiers, such as Silver, Gold and Platinum, with benefits.
- Redeem points for food, passes or discounts.
- Memberships for pool, spa or gym, with renewal.
- Digital membership card with QR code in the app.
- Points statement and expiry.

## Super admin options
- Earn and redeem rules per outlet.
- Tiers and benefits.
- Point expiry.


## Depends on

- [CRM: Guest & Client Profiles](54-crm-guests.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `points.earned`
- `points.redeemed`
- `tier.changed`
- `membership.renewed`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
