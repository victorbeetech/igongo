# 71. Swimming Pool

**Group:** Guests and sales · **Module key:** `pool` · [All modules](README.md)

## Summary

Day passes, memberships and safety for the adult and children's pools.

## Features
- Day passes, session passes and family passes, sold in the app or at the gate.
- Memberships with QR card.
- Entry by QR, wristband or room guest check.
- Capacity limit with a live count.
- Lifeguard duty log and incident reports.
- Water quality tests (chlorine, pH) with times and readings.
- Swimming lessons booking.
- Pool closed notice in the app.

## Super admin options
- Pass types and opening hours.
- Capacity limits.
- Water test schedule.


## Depends on

- [Payments](77-payments.md)
- [CRM: Guest & Client Profiles](54-crm-guests.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `pool.pass_sold`
- `pool.entry`
- `pool.capacity_reached`
- `pool.water_test_failed`
- `pool.closed`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
