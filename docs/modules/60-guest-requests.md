# 60. Guest Requests & Help Desk

**Group:** Guests and sales · **Module key:** `guest-requests` · [All modules](README.md)

## Summary

Guests ask for anything from the app, WhatsApp or front desk, and the request goes to the right team and is tracked until done.

## Features
- Request types: towels, cleaning, wake-up call, maintenance, transport, extra bed, information and more.
- Routing to the right department automatically.
- Target times, with alerts when late.
- Guest sees the status live.
- Staff update status and add notes.
- Rate the service when done.

## Super admin options
- Request types, routing rules and target times.
- Which requests guests can make in the app.


## Depends on

- [CRM: Guest & Client Profiles](54-crm-guests.md)
- [Locations & Departments](15-locations-departments.md)
- [Notifications Engine](10-notifications.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `guestrequest.created`
- `guestrequest.assigned`
- `guestrequest.completed`
- `guestrequest.late`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
