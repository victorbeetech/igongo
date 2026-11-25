# 69. Events & Conferences

**Group:** Guests and sales · **Module key:** `events-conferences` · [All modules](README.md)

## Summary

Plans and sells weddings, introductions, conferences, parties and company retreats, from enquiry to the final invoice.

## Features
- Enquiry form in the app, WhatsApp and website.
- Event pipeline: enquiry, site visit, quote, confirmed, in progress, completed.
- Packages with venue, food, decor, equipment and wristbands.
- Quotes and contracts from templates, with e-signature.
- Deposits and payment schedule.
- Event timeline and run sheet with tasks for each department.
- Guest list with RSVP and QR invites.
- Wristband ranges linked from [Event Wristbands](17-wristbands.md).
- Staffing needs sent to [Shifts & Rosters](26-shifts-rosters.md).
- Post-event report and feedback.

## Super admin options
- Event types, pipeline stages and packages.
- Deposit rules and contract templates.
- Who can confirm and discount events.


## Depends on

- [Venues & Equipment Hire](70-venues-equipment.md)
- [Payments](77-payments.md)
- [CRM: Guest & Client Profiles](54-crm-guests.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `event.enquiry`
- `event.quoted`
- `event.confirmed`
- `event.started`
- `event.completed`
- `event.cancelled`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
