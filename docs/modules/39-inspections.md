# 39. Inspections & Checklists

**Group:** Operations · **Module key:** `inspections` · [All modules](README.md)

## Summary

Daily checkups and audits of rooms, kitchen, pool, grounds, museum, vehicles and safety equipment, with scores and photos.

## Features
- Checklist templates with scoring and pass marks.
- Scheduled rounds: daily, weekly, monthly or per shift.
- Assign an inspector, or let anyone with the role pick the round.
- Scan the area or asset QR code to start the right checklist.
- Photo proof for each failed item.
- A failed item can raise a fault in [Faults & Maintenance](40-faults-maintenance.md) or a task in [Tasks](42-tasks.md) in one tap.
- Score trends by area and inspector.
- Food safety and health inspection records ready for official visits.

## Super admin options
- Checklist templates, schedules and scoring.
- What happens on a failed item (fault, task, alert).
- Who can inspect which areas.


## Depends on

- [Forms & Templates Builder](08-forms-builder.md)
- [Locations & Departments](15-locations-departments.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `inspection.due`
- `inspection.completed`
- `inspection.failed_item`
- `inspection.missed`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
