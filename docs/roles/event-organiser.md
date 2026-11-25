# Event Client / Organiser

**Level:** Guests and clients · **Role key:** `event-organiser` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

The client who booked an event, such as a wedding or conference, who manages their own guest list and follows the plan.

**Uses:** The Igongo app and the web portal

## Home screen tiles

- My event
- Run sheet
- Guest list and invites
- Payments due
- Chat with the events team

## Modules, screens and default permissions

| Module | Actions | Data scope |
| --- | --- | --- |
| [Events & Conferences](../modules/69-events-conferences.md) | view, edit | Own records |
| [Event Wristbands](../modules/17-wristbands.md) | view | Own records |
| [Payments](../modules/77-payments.md) | view, create | Own records |
| [Receipts & Invoicing](../modules/78-receipts-invoicing.md) | view, export | Own records |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Sees only their own event.
- Access ends 30 days after the event, unless changed.
