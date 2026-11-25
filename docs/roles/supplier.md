# Supplier

**Level:** Partners and suppliers · **Role key:** `supplier` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

An outside supplier who sees their purchase orders, deliveries and payments, and books deliveries.

**Uses:** Igongo app and web portal, partner view

## Home screen tiles

- Deliveries expected today
- Payments due

## Modules, screens and default permissions

| Module | Actions | Data scope |
| --- | --- | --- |
| [Stock & Inventory](../modules/84-stock-inventory.md) | view | Own records |
| [Payments](../modules/77-payments.md) | view | Own records |
| [Receipts & Invoicing](../modules/78-receipts-invoicing.md) | view | Own records |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Sees only their own orders and payments.
