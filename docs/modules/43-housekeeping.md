# 43. Housekeeping & Room Status

**Group:** Operations · **Module key:** `housekeeping` · [All modules](README.md)

## Summary

Keeps rooms clean and ready: room status, cleaning assignments, minibar and amenity checks. Room bookings stay in APEX; this module only handles the work on the rooms.

## Features
- Room board: clean, dirty, in progress, inspected, out of order and do not disturb.
- Daily cleaning assignments for room attendants, from check-outs and stay-overs.
- Attendants update status from the app as they work.
- Supervisor inspection before a room is released.
- Amenity and linen checklists.
- Guest requests (towels, extra pillow) routed from [Guest Requests & Help Desk](60-guest-requests.md).
- Public area cleaning schedules.
- Lost items found in rooms passed to [Lost & Found](46-lost-found.md).

## Super admin options
- Room statuses and their colours.
- Cleaning standards and time per room type.
- Whether inspection is required before release.


## Depends on

- [Locations & Departments](15-locations-departments.md)
- [Laundry](44-laundry.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `room.status_changed`
- `room.cleaned`
- `room.inspected`
- `room.out_of_order`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
