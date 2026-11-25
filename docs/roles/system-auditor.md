# Internal Auditor

**Level:** System · **Role key:** `system-auditor` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Reviews records, the audit trail and money flows across all modules without being able to change anything.

**Reports to:** [Board of Directors](board-of-directors.md)

**Uses:** Web portal

## Home screen tiles

- Audit alerts
- Voids and refunds this week
- Cash-up variances
- Payroll changes
- Role changes

## Modules, screens and default permissions

| Module | Actions | Data scope |
| --- | --- | --- |
| [Audit Trail](../modules/05-audit-trail.md) | view, export | Everything |
| [Records Archive & Search](../modules/06-records-search.md) | view, export | Everything |
| [Payroll](../modules/28-payroll.md) | view, export | Everything |
| [Advances & Loans](../modules/30-advances-loans.md) | view, export | Everything |
| [Petty Cash & Expense Claims](../modules/37-petty-cash.md) | view, export | Everything |
| [Payments](../modules/77-payments.md) | view, export | Everything |
| [Receipts & Invoicing](../modules/78-receipts-invoicing.md) | view, export | Everything |
| [Cash-up & Reconciliation](../modules/79-cash-up.md) | view, export | Everything |
| [Reports & Analytics](../modules/81-reports-analytics.md) | view, export | Everything |
| [Roles & Permissions](../modules/02-roles-permissions.md) | view | Everything |

## Approval limits

- None. Read-only role.

## Extra rules

- 2FA required.
- Cannot edit, approve or delete anything.
- Can switch to the client view at any time to see the app exactly as a guest sees it.
