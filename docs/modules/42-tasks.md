# 42. Tasks

**Group:** Operations · **Module key:** `tasks` · [All modules](README.md)

## Summary

Assign and track work of any kind, one-off or repeating, between any staff.

## Features
- Create a task with title, details, assignee, due date, priority and checklist.
- Recurring tasks (daily, weekly, monthly).
- Board, list and calendar views.
- Comments, photos and mentions.
- Reminders and overdue alerts.
- Tasks created by other modules, such as a failed inspection item.
- Workload view per person.

## Super admin options
- Who can assign tasks to whom (for example, only within the department).
- Priority levels and default reminders.


## Depends on

- [Locations & Departments](15-locations-departments.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `task.created`
- `task.assigned`
- `task.completed`
- `task.overdue`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
