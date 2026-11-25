# Finance & Accounts Manager

**Level:** Department managers · **Role key:** `finance-manager` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Controls money: payments, receipts, cash-ups, petty cash, payroll review, accounting exports and credit accounts.

**Reports to:** [General Manager (GM)](general-manager.md)

**Uses:** Web portal and Igongo app

## Home screen tiles

- Takings today by method
- Cash-up variances
- Refunds to approve
- Overdue invoices
- Petty cash floats
- Payroll run status

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Payments](../modules/77-payments.md) | view, approve, export | Everything |
| [Receipts & Invoicing](../modules/78-receipts-invoicing.md) | view, create, edit, approve, export | Everything |
| [Cash-up & Reconciliation](../modules/79-cash-up.md) | view, approve, export | Everything |
| [Accounting Export](../modules/80-accounting-export.md) | view, create, export | Everything |
| [Petty Cash & Expense Claims](../modules/37-petty-cash.md) | view, approve, export | Everything |
| [Payroll](../modules/28-payroll.md) | view, approve, export | Everything |
| [Advances & Loans](../modules/30-advances-loans.md) | view, approve | Everything |
| [Corporate Accounts](../modules/55-corporate-accounts.md) | view, edit | Everything |
| [Prices, Taxes & Discounts](../modules/76-pricing-tax.md) | view | Everything |
| [Reports & Analytics](../modules/81-reports-analytics.md) | view, export | Everything |
| [Stock & Inventory](../modules/84-stock-inventory.md) | view, approve, export | Everything |

## Approval limits

- Refunds and voids up to Tier 2.
- Petty cash up to Tier 2.
- Reviews payroll before the GM approves.

## Extra rules

- 2FA required.
- Cannot create a payment and approve it too.
- Can switch to the client view at any time to see the app exactly as a guest sees it.
