# 64. Tables & Dine-in

**Group:** Guests and sales · **Module key:** `tables-dinein` · [All modules](README.md)

## Summary

Restaurant floor plans, table reservations and the waiter's view of the dining room.

## Features
- Floor plan editor per restaurant, with tables and seats.
- Table reservations from the app, WhatsApp or the front desk, with deposit if needed.
- Table status: free, reserved, seated, ordered, bill asked, paid.
- Assign waiters to sections.
- Waiting list with SMS when a table is ready.
- QR code on every table: scan to see the menu, order and pay.
- Call waiter button.

## Super admin options
- Floor plans and table sizes.
- Reservation rules, time slots and deposits.
- Whether guests can order from the table QR without a waiter.


## Depends on

- [Locations & Departments](15-locations-departments.md)
- [CRM: Guest & Client Profiles](54-crm-guests.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `table.reserved`
- `table.seated`
- `table.freed`
- `waiter.called`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
