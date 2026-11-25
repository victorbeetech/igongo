# Cashier

**Level:** Frontline staff · **Role key:** `cashier` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Takes payments at an outlet, issues receipts and does the end-of-shift cash-up.

**Reports to:** [Finance & Accounts Manager](finance-manager.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- Take payment
- Open bills
- Receipts today
- Open shift
- My cash-up

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Payments](../modules/77-payments.md) | view, create | Own department |
| [Receipts & Invoicing](../modules/78-receipts-invoicing.md) | view, create | Own department |
| [Cash-up & Reconciliation](../modules/79-cash-up.md) | view, create | Own records |
| [Food Ordering](../modules/62-food-ordering.md) | view | Own department |
| [Promotions, Vouchers & Gift Cards](../modules/59-promotions-vouchers.md) | view | Own department |

## Approval limits

- Cannot refund or void. Asks the supervisor instead.

## Extra rules

- Blind cash-up if the super admin switches it on.
- Can switch to the client view at any time to see the app exactly as a guest sees it.
