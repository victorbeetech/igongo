# 53. Company Calendar

**Group:** Communication · **Module key:** `company-calendar` · [All modules](README.md)

## Summary

One calendar of hotel life: public holidays, events, meetings, training, birthdays and closures.

## Features
- Calendar layers that people can turn on and off, from events, training, meetings, leave and holidays.
- Company events and staff functions.
- Personal calendar with own shifts, leave and tasks.
- Reminders.
- Sync to Google or phone calendars.

## Super admin options
- Which layers each role can see.
- Who can add company events.


## Depends on

- [Locations & Departments](15-locations-departments.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `calendar.event_created`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
