# 68. Museum & Cultural Visits

**Group:** Guests and sales · **Module key:** `museum` · [All modules](README.md)

## Summary

Tickets, tours and group visits for the Eriijukiro Museum, the cultural village and the monuments.

## Features
- Ticket types: adult, child, student, resident, foreigner and group.
- Timed entry slots and capacity.
- Guided tour booking with language and guide assignment.
- School and group bookings with lists, deposit and invoice.
- QR tickets scanned at the entrance.
- Audio guide content in the app, per exhibit, with QR codes on exhibits.
- Cultural performances and experiences (such as cooking, dance, crafts) as bookable activities.
- Visitor numbers and trends.

## Super admin options
- Ticket types, slots and capacity.
- Group booking rules.
- Exhibit content and languages.


## Depends on

- [Payments](77-payments.md)
- [CRM: Guest & Client Profiles](54-crm-guests.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `museum.ticket_sold`
- `museum.entry`
- `tour.booked`
- `tour.completed`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
