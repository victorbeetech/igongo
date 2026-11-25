# Delivery Rider

**Level:** Frontline staff · **Role key:** `delivery-rider` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Picks up orders from the kitchen and delivers them, using the rider screens in the same Igongo app.

**Reports to:** [Delivery Dispatcher](dispatcher.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- Go online
- My deliveries
- Navigate
- Proof of delivery
- Cash collected
- My earnings

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Delivery & Riders](../modules/66-delivery-riders.md) | view, edit | Assigned to them |
| [Food Ordering](../modules/62-food-ordering.md) | view | Assigned to them |
| [Cash-up & Reconciliation](../modules/79-cash-up.md) | view, create | Own records |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Mobile clock-in allowed with GPS.
- Location shared only while online.
- Can switch to the client view at any time to see the app exactly as a guest sees it.
