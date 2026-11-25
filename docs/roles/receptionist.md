# Receptionist

**Level:** Frontline staff · **Role key:** `receptionist` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Welcomes guests, handles front desk requests, registers walk-in clients and visitors, and takes payments at reception.

**Reports to:** [Front Office Manager](front-office-manager.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- Arrivals today
- Guest requests
- WhatsApp chats
- New client account
- Take payment
- Lost and found

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [CRM: Guest & Client Profiles](../modules/54-crm-guests.md) | view, create, edit | Everything |
| [Guest Requests & Help Desk](../modules/60-guest-requests.md) | view, create, edit | Everything |
| [Room Bookings](../modules/67-room-bookings.md) | view, create | Everything |
| [WhatsApp Concierge](../modules/74-whatsapp-concierge.md) | view, edit | Everything |
| [Visitors & Contractors](../modules/20-visitor-management.md) | view, create | Everything |
| [Lost & Found](../modules/46-lost-found.md) | view, create, edit | Everything |
| [Payments](../modules/77-payments.md) | view, create | Own department |
| [Receipts & Invoicing](../modules/78-receipts-invoicing.md) | view, create | Own department |
| [Users, Accounts & Login](../modules/04-users-login.md) | create | Everything |

## Approval limits

- None.

## Extra rules

- Can create client accounts at the desk.
- Can switch to the client view at any time to see the app exactly as a guest sees it.
