# Barista

**Level:** Frontline staff · **Role key:** `barista` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Makes and sells coffee and snacks at the coffee shops.

**Reports to:** [Restaurant & F&B Manager](fnb-manager.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- Coffee tickets
- New order
- Take payment
- My cash-up

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Kitchen Display & Production](../modules/63-kitchen-display.md) | view, edit | Own department |
| [Food Ordering](../modules/62-food-ordering.md) | view, create | Own department |
| [Payments](../modules/77-payments.md) | view, create | Own records |
| [Receipts & Invoicing](../modules/78-receipts-invoicing.md) | view, create | Own records |
| [Cash-up & Reconciliation](../modules/79-cash-up.md) | view, create | Own records |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
