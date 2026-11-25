# 52. Surveys & Polls

**Group:** Communication · **Module key:** `surveys-polls` · [All modules](README.md)

## Summary

Quick polls and full surveys for staff or guests, such as staff satisfaction or menu ideas.

## Features
- Polls with single or multiple choice.
- Surveys built with [Forms & Templates Builder](08-forms-builder.md).
- Anonymous option.
- Audience targeting and reminders.
- Live results and charts, with export.

## Super admin options
- Who can create surveys, and for which audiences.
- Whether anonymous surveys are allowed.


## Depends on

- [Forms & Templates Builder](08-forms-builder.md)
- [Notifications Engine](10-notifications.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `survey.published`
- `survey.responded`
- `survey.closed`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
