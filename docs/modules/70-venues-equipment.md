# 70. Venues & Equipment Hire

**Group:** Guests and sales · **Module key:** `venues-equipment` · [All modules](README.md)

## Summary

A shared calendar of halls, gardens, tents, chairs, sound systems and projectors, so nothing is double-booked.

## Features
- Venues with capacity per layout (theatre, banquet, classroom) and photos.
- Equipment items with quantity.
- Availability calendar with holds and confirmed bookings.
- Setup and cleanup time around each booking.
- Hire to outside clients if wanted.
- Damage records.

## Super admin options
- Venues, layouts and equipment.
- How long a hold lasts before it is released.


## Depends on

- [Locations & Departments](15-locations-departments.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `venue.held`
- `venue.booked`
- `venue.released`
- `equipment.damaged`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
