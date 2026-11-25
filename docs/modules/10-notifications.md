# 10. Notifications Engine

**Group:** Core platform · **Module key:** `notifications` · [All modules](README.md)

## Summary

Delivers every message the system sends, by app push, SMS, WhatsApp, email or in-app inbox, under rules the super admin controls.

## Features
- Rules: when event X happens in module Y, tell these roles or people, by these channels.
- Message templates with placeholders, in each language.
- Channel fallback, such as push first, then SMS if not read in 10 minutes.
- Quiet hours per role, with urgent messages allowed through.
- Digest mode: bundle low-priority messages into one daily summary.
- In-app inbox with read and unread.
- Delivery log: sent, delivered, read and failed, with cost per channel.
- Personal preferences, within the limits the super admin allows.
- Broadcasts to a role, department or list of clients.

## Super admin options
- Create, edit and switch off any notification rule.
- Which channels each role may receive and which ones a person can mute.
- Sender names and WhatsApp templates.
- Monthly limit on SMS and WhatsApp spend, with an alert near the limit.


## Depends on

- [Roles & Permissions](02-roles-permissions.md)
- [Integrations Hub & Webhooks](14-integrations-hub.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `notification.sent`
- `notification.delivered`
- `notification.failed`
- `notification.read`

## If this module is switched off or fails

Other modules keep working and their messages are queued until it is back.
