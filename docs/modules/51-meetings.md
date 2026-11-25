# 51. Meetings & Minutes

**Group:** Communication · **Module key:** `meetings` · [All modules](README.md)

## Summary

Plans meetings, records minutes and follows up action items.

## Features
- Schedule a meeting with agenda, room and invitees, with calendar invites.
- Attendance by card tap or tick.
- Minutes typed in the app, with decisions and action items.
- Action items become tasks with owners and due dates.
- Board meetings with confidential papers.
- Search past minutes.

## Super admin options
- Meeting types and minute templates.
- Who can call meetings and see minutes.


## Depends on

- [Tasks](42-tasks.md)
- [Files & Media](11-files-media.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `meeting.scheduled`
- `meeting.held`
- `minutes.published`
- `actionitem.created`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
