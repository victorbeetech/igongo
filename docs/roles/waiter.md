# Waiter / Waitress

**Level:** Frontline staff · **Role key:** `waiter` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Serves guests at tables, by the pool and at events, taking orders and payments on their phone.

**Reports to:** [Restaurant Supervisor](restaurant-supervisor.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- My tables
- New order
- Orders ready to serve
- Call waiter alerts
- Take payment
- My cash-up

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Tables & Dine-in](../modules/64-tables-dinein.md) | view, edit | Own department |
| [Food Ordering](../modules/62-food-ordering.md) | view, create, edit | Assigned to them |
| [Payments](../modules/77-payments.md) | view, create | Own records |
| [Receipts & Invoicing](../modules/78-receipts-invoicing.md) | view, create | Own records |
| [Cash-up & Reconciliation](../modules/79-cash-up.md) | view, create | Own records |
| [Feedback, Complaints & Reviews](../modules/56-guest-feedback.md) | create | Everything |

## Approval limits

- Cannot void or discount. Asks the supervisor instead.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
