# 67. Room Bookings

**Group:** Guests and sales · **Module key:** `room-bookings` · [All modules](README.md)

## Summary

Lets guests see and book rooms in the app and website. APEX stays the system of record for rooms, so this module checks availability with APEX and sends bookings to it.

## Features
- Room types with photos, amenities and capacity.
- Availability and rates read from APEX through [APEX Integration](82-apex-integration.md).
- Book, pay a deposit or in full, and get a confirmation.
- Change and cancel within the policy.
- Pre-arrival: arrival time, requests, airport pickup and pre-ordered food.
- Packages, such as room plus museum tour plus dinner.
- Digital check-in form, sent to front desk.
- Booking history in the guest profile.

## Super admin options
- Which room types are sold in the app.
- Deposit and cancellation policies.
- Packages.
- What to do when APEX is offline (stop sales, or take requests to confirm later).


## Depends on

- [APEX Integration](82-apex-integration.md)
- [Payments](77-payments.md)
- [CRM: Guest & Client Profiles](54-crm-guests.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `roombooking.requested`
- `roombooking.confirmed`
- `roombooking.cancelled`
- `roombooking.sync_failed`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
