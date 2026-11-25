# 66. Delivery & Riders

**Group:** Guests and sales · **Module key:** `delivery-riders` · [All modules](README.md)

## Summary

Delivers orders to guests on the grounds and in town, with a rider interface in the same Igongo app.

## Features

### Dispatch
- Delivery zones drawn on a map, with fees and times per zone.
- Assign orders to riders automatically or by a dispatcher.
- Batch several orders for one rider.

### Rider interface
- Go online or offline.
- Accept order, navigate with Google Maps, call the guest.
- Pickup confirmation at the kitchen pass.
- Proof of delivery: photo, signature or the guest's code.
- Cash collection recorded, with end-of-shift hand-in.
- Earnings and trips history.

### Guest side
- Live rider location on a map and arrival time.
- Rate the rider.

## Super admin options
- Zones, delivery hours and fees.
- Assignment mode (automatic or dispatcher).
- Proof of delivery type.
- Whether riders can carry cash, and the cash limit.


## Depends on

- [Food Ordering](62-food-ordering.md)
- [Payments](77-payments.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `delivery.assigned`
- `delivery.picked_up`
- `delivery.delivered`
- `delivery.failed`
- `rider.online`
- `rider.offline`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
