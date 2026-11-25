# 62. Food Ordering

**Group:** Guests and sales · **Module key:** `food-ordering` · [All modules](README.md)

## Summary

Takes every food and drink order, from any channel and of any type: delivery, room service, dine-in, takeaway and pre-order for a set arrival time, such as "fry 1 kg of beef, we arrive at 4 PM".

## Features

### Order types
- Delivery to an address or a spot on the grounds.
- Room service.
- Dine-in at a table.
- Takeaway and pickup.
- Pre-order with arrival time: the guest orders and pays a deposit or in full, and the kitchen starts so the food is ready when they arrive.
- Group and event orders.

### Channels
- The app (client view), WhatsApp, the website, phone call (staff enters it) and the waiter's phone at the table.

### The order
- Cart with options, notes and allergies.
- Ready-time estimate from item prep times and kitchen load.
- Pay now, pay a deposit, pay on arrival or charge to room (through APEX) or to a corporate account.
- Order tracking for the guest: received, preparing, ready, on the way, delivered.
- Change or cancel within the allowed time.
- Reorder from history.

### Staff tools
- Waiter order taking on a phone, with table and seat.
- Split and merge bills.
- Void and discount with reasons and approval.

## Super admin options
- Order types on or off per outlet.
- Minimum notice for pre-orders, and the deposit rule.
- Cancel and change windows.
- Which payment options each order type allows.
- Who can void or discount, and up to what tier.


## Depends on

- [Menus & Catalogue](61-menu-catalogue.md)
- [Prices, Taxes & Discounts](76-pricing-tax.md)
- [Payments](77-payments.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `order.placed`
- `order.confirmed`
- `order.changed`
- `order.cancelled`
- `order.ready`
- `order.completed`
- `preorder.due`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
