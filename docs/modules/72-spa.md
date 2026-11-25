# 72. Spa / Humura

**Group:** Guests and sales · **Module key:** `spa` · [All modules](README.md)

## Summary

Treatments, therapists and appointments for the Humura spa, sauna and steam room.

## Features
- Treatment menu with time and description.
- Appointment booking in the app or at the desk, matched to therapist and room.
- Therapist schedules and breaks.
- Health questions before treatment.
- Packages and memberships.
- Reminders and no-show records.

## Super admin options
- Treatments, rooms and therapists.
- Booking and cancellation rules.


## Depends on

- [Payments](77-payments.md)
- [CRM: Guest & Client Profiles](54-crm-guests.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `spa.booked`
- `spa.completed`
- `spa.cancelled`
- `spa.no_show`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
