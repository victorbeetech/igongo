# Credit Controller

**Level:** Supervisors and officers · **Role key:** `credit-controller` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Follows up corporate balances, invoices and deposits.

**Reports to:** [Finance & Accounts Manager](finance-manager.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- Overdue invoices
- Corporate accounts
- Deposits due

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Corporate Accounts](../modules/55-corporate-accounts.md) | view, edit | Everything |
| [Receipts & Invoicing](../modules/78-receipts-invoicing.md) | view, create, export | Everything |
| [Payments](../modules/77-payments.md) | view | Everything |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
