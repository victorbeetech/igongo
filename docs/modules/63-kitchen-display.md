# 63. Kitchen Display & Production

**Group:** Guests and sales · **Module key:** `kitchen-display` · [All modules](README.md)

## Summary

Shows orders to the kitchen and bar on screens or printers, by station, in the right order and at the right time.

## Features
- Kitchen screens per station (grill, fryer, pastry, bar, coffee).
- Order tickets with time, type, table or room and notes.
- Pre-orders appear at the right moment before the guest's arrival time.
- Bump items as started and ready.
- Colour alerts for late orders.
- Kitchen printer fallback.
- Expo screen for the pass, to check complete orders.
- Daily production list for big events and buffets.
- Food waste recording with reasons.

## Super admin options
- Stations and which items go to each.
- Target times and late alert thresholds.
- How early pre-orders appear.


## Depends on

- [Food Ordering](62-food-ordering.md)
- [Devices & Stations](18-devices-stations.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `ticket.started`
- `ticket.ready`
- `ticket.late`
- `waste.recorded`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
