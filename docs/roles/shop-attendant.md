# Shop Attendant

**Level:** Frontline staff · **Role key:** `shop-attendant` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Sells crafts, books and souvenirs and packs online orders.

**Reports to:** [Crafts & Bookshop Manager](crafts-manager.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- New sale
- Scan product
- Online orders
- My cash-up

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Crafts & Bookshop](../modules/73-crafts-bookshop.md) | view, create, edit | Own department |
| [Payments](../modules/77-payments.md) | view, create | Own records |
| [Receipts & Invoicing](../modules/78-receipts-invoicing.md) | view, create | Own records |
| [Cash-up & Reconciliation](../modules/79-cash-up.md) | view, create | Own records |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
