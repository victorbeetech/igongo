# 50. Chat

**Group:** Communication · **Module key:** `chat` · [All modules](README.md)

## Summary

Secure messaging between staff: one-to-one, groups and department channels.

## Features
- Direct messages, groups and department channels created automatically from departments.
- Text, photos, voice notes, files and location.
- Read receipts and typing status.
- Message search and pinned messages.
- Broadcast-only channels for announcements.
- Staff-to-guest chat for front desk and concierge, kept separate from staff chat.
- Messages kept on the server for records, not just on phones.

## Super admin options
- Who can message whom (for example, staff to managers only).
- Whether groups can be created by anyone.
- Whether staff can delete their messages.
- Message retention.


## Depends on

- [Files & Media](11-files-media.md)
- [Notifications Engine](10-notifications.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `chat.message_sent`
- `chat.group_created`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
