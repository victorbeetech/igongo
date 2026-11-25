# Concierge Agent (WhatsApp and chat)

**Level:** Frontline staff · **Role key:** `concierge-agent` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Answers guests on WhatsApp and in-app chat, books and orders for them, and passes requests to departments.

**Reports to:** [Front Office Manager](front-office-manager.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- Chats waiting
- My open chats
- Guest requests
- Send payment link

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [WhatsApp Concierge](../modules/74-whatsapp-concierge.md) | view, edit | Everything |
| [CRM: Guest & Client Profiles](../modules/54-crm-guests.md) | view, edit | Everything |
| [Guest Requests & Help Desk](../modules/60-guest-requests.md) | view, create | Everything |
| [Food Ordering](../modules/62-food-ordering.md) | view, create | Everything |
| [Tables & Dine-in](../modules/64-tables-dinein.md) | view, create | Everything |
| [Museum & Cultural Visits](../modules/68-museum.md) | view, create | Everything |
| [Swimming Pool](../modules/71-pool.md) | view, create | Everything |
| [Spa / Humura](../modules/72-spa.md) | view, create | Everything |
| [Payments](../modules/77-payments.md) | create | Everything |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
