# 44. Laundry

**Group:** Operations · **Module key:** `laundry` · [All modules](README.md)

## Summary

Tracks hotel linen, staff uniforms and guest laundry orders.

## Features
- Linen counts: issued, in wash, returned and damaged.
- Guest laundry orders from the app with pickup, items and ready time.
- Staff uniform washing.
- Damage and loss records.
- Daily laundry report.

## Super admin options
- Item list and turnaround times.
- Whether guests can order laundry in the app.


## Depends on

- [Locations & Departments](15-locations-departments.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `laundry.order_created`
- `laundry.order_ready`
- `linen.count_updated`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
