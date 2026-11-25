# 65. Buffet Service

**Group:** Guests and sales · **Module key:** `buffet` · [All modules](README.md)

## Summary

Runs buffets for guests, events and staff bonuses: who may eat, how many times, and how many were served.

## Features
- Buffet sessions with date, time, menu and capacity.
- Entry by ticket QR, wristband, staff card (for buffet bonuses) or payment at the door.
- Headcount live and at close.
- Event buffets linked to the event's wristband range.
- Forecast for the kitchen from bookings.

## Super admin options
- Buffet sessions and who can enter.
- Whether re-entry is allowed.


## Depends on

- [Menus & Catalogue](61-menu-catalogue.md)
- [Event Wristbands](17-wristbands.md)
- [NFC & QR Staff Cards](16-staff-cards.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `buffet.entry`
- `buffet.denied`
- `buffet.closed`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
