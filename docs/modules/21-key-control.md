# 21. Key Control

**Group:** Identity and access hardware · **Module key:** `key-control` · [All modules](README.md)

## Summary

Tracks physical keys and key cards: store keys, office keys, master keys and vehicle keys. Staff sign them out and back in with a card tap.

## Features
- Key register with tag number, what it opens and where it is kept.
- Sign out and return with a staff card tap and a photo.
- Overdue alerts when a key is not returned by end of shift.
- Restricted keys that need a manager's approval.
- Lost key report and lock change record.

## Super admin options
- Which roles can hold which keys.
- Maximum time a key can be out.
- Who is alerted for overdue or lost keys.


## Depends on

- [NFC & QR Staff Cards](16-staff-cards.md)
- [Workflow & Approvals](09-workflow-approvals.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `key.issued`
- `key.returned`
- `key.overdue`
- `key.lost`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
