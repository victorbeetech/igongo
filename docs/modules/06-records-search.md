# 6. Records Archive & Search

**Group:** Core platform · **Module key:** `records-search` · [All modules](README.md)

## Summary

One search box over every module, years back. Finds people, bookings, orders, reports, faults, posts and files, while respecting each person's permissions.

## Features
- Global search across all modules, with filters for module, date, department and person.
- Saved searches and alerts when new matching records appear.
- "Everything about" view: all records linked to one staff member, guest, room, asset or event.
- Archive policy: old records move to cheaper storage but remain searchable.
- Legal hold: freeze records so they cannot be archived or deleted.
- Search inside photos' text and PDFs (OCR).
- Results show only what the person is allowed to see.

## Super admin options
- Which modules are included in global search.
- When records are archived for each module.
- Which roles can use "Everything about".
- Search result limits and export rights.


## Depends on

- [Roles & Permissions](02-roles-permissions.md)
- [Audit Trail](05-audit-trail.md)
- [Files & Media](11-files-media.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `search.saved_alert_triggered`
- `record.archived`
- `legal_hold.placed`
- `legal_hold.released`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
