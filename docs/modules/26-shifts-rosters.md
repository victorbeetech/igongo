# 26. Shifts & Rosters

**Group:** Staff · **Module key:** `shifts-rosters` · [All modules](README.md)

## Summary

Plans who works when. Rosters set the expected times that attendance is measured against.

## Features
- Shift types (morning, evening, night, split, on call) with times and breaks.
- Roster planner by department: drag people into shifts, or copy last week.
- Rotating patterns, such as four days on, two off.
- Minimum staffing rules, with warnings when a shift is short.
- Shift swap and cover requests between staff, approved by the supervisor.
- Open shifts that eligible staff can claim.
- Public holidays calendar for Uganda, editable.
- Roster published to staff phones, with changes notified.
- Extra staff for big events, linked to [Events & Conferences](69-events-conferences.md).

## Super admin options
- Shift types and patterns.
- Who can build and publish rosters.
- How far ahead rosters must be published.
- Whether staff can swap without approval.


## Depends on

- [Locations & Departments](15-locations-departments.md)
- [HR Staff Records](22-hr-records.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `roster.published`
- `shift.changed`
- `shift.swap_requested`
- `shift.swap_approved`
- `shift.understaffed`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
