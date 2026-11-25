# Switchboard / Call Centre Agent

**Level:** Frontline staff · **Role key:** `switchboard-operator` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Answers calls, takes phone orders and bookings, and passes messages.

**Reports to:** [Front Office Manager](front-office-manager.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- New order
- Guest requests
- Chats waiting

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Food Ordering](../modules/62-food-ordering.md) | view, create | Everything |
| [Tables & Dine-in](../modules/64-tables-dinein.md) | view, create | Everything |
| [Room Bookings](../modules/67-room-bookings.md) | view, create | Everything |
| [Guest Requests & Help Desk](../modules/60-guest-requests.md) | view, create | Everything |
| [WhatsApp Concierge](../modules/74-whatsapp-concierge.md) | view, edit | Everything |
| [CRM: Guest & Client Profiles](../modules/54-crm-guests.md) | view | Everything |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
