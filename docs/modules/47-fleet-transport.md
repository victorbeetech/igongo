# 47. Fleet & Transport

**Group:** Operations · **Module key:** `fleet-transport` · [All modules](README.md)

## Summary

Hotel vehicles, drivers, trips and guest transfers, such as airport or town pickups.

## Features
- Vehicle register: plate, type, insurance, service dates and fuel records.
- Trip requests from staff or guests, with approval.
- Driver assignment, trip start and end with mileage and GPS.
- Guest pickup and drop-off bookings, linked to the guest's booking.
- Fuel and repair costs per vehicle.
- Insurance and licence expiry reminders.

## Super admin options
- Vehicles and who can drive each.
- Trip approval rules.
- Whether guests can book transfers in the app.


## Depends on

- [Locations & Departments](15-locations-departments.md)
- [Workflow & Approvals](09-workflow-approvals.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `trip.requested`
- `trip.started`
- `trip.completed`
- `vehicle.service_due`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
