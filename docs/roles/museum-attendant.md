# Museum Ticket Attendant

**Level:** Frontline staff · **Role key:** `museum-attendant` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Sells and scans museum tickets and welcomes visitors at the entrance.

**Reports to:** [Museum & Cultural Centre Manager](museum-manager.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- Scan ticket
- Tours booked
- Take payment
- My cash-up

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Museum & Cultural Visits](../modules/68-museum.md) | view, create, edit | Own department |
| [Payments](../modules/77-payments.md) | view, create | Own department |
| [Receipts & Invoicing](../modules/78-receipts-invoicing.md) | view, create | Own department |
| [Cash-up & Reconciliation](../modules/79-cash-up.md) | view, create | Own records |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
