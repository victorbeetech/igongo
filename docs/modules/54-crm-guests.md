# 54. CRM: Guest & Client Profiles

**Group:** Guests and sales · **Module key:** `crm-guests` · [All modules](README.md)

## Summary

One profile for every guest and client, across rooms, food, events, museum, pool, spa and shop, so staff know who they are serving.

## Features
- Profile: name, phone, email, nationality, ID (if collected), photo, preferences, allergies and notes.
- Full history: stays (from APEX), orders, bookings, visits, spend, feedback and complaints.
- Tags and segments, such as VIP, regular, school, government, wedding client.
- Duplicate detection and merge.
- Consent records for SMS, WhatsApp and email marketing.
- Birthday and anniversary reminders.
- Staff notes, visible by role.
- Guest's own view: my bookings, orders, receipts, points and saved details.
- Data export and delete on request.

## Super admin options
- Profile fields and tags.
- Who can see contact details and spend.
- Segment rules.
- Data retention for inactive guests.


## Depends on

- [Custom Fields](07-custom-fields.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `guest.created`
- `guest.updated`
- `guest.merged`
- `guest.tagged`
- `guest.consent_changed`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
