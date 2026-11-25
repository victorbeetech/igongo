# Accountant

**Level:** Supervisors and officers · **Role key:** `accountant` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Records and checks money: receipts, invoices, credit accounts, petty cash and exports.

**Reports to:** [Finance & Accounts Manager](finance-manager.md)

**Uses:** Web portal

## Home screen tiles

- Invoices due
- Cash-ups to check
- Petty cash claims
- Settlement reports
- Exports

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Payments](../modules/77-payments.md) | view, export | Everything |
| [Receipts & Invoicing](../modules/78-receipts-invoicing.md) | view, create, edit, export | Everything |
| [Cash-up & Reconciliation](../modules/79-cash-up.md) | view, edit, export | Everything |
| [Accounting Export](../modules/80-accounting-export.md) | view, create, export | Everything |
| [Petty Cash & Expense Claims](../modules/37-petty-cash.md) | view, edit, export | Everything |
| [Corporate Accounts](../modules/55-corporate-accounts.md) | view, edit | Everything |

## Approval limits

- Petty cash up to Tier 1.

## Extra rules

- 2FA required.
- Can switch to the client view at any time to see the app exactly as a guest sees it.
