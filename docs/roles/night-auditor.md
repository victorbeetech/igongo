# Night Auditor

**Level:** Supervisors and officers · **Role key:** `night-auditor` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Checks the day's takings, bills and room charges overnight and closes the day.

**Reports to:** [Finance & Accounts Manager](finance-manager.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- Cash-ups to check
- Takings today by method
- Voids and refunds this week
- App bookings waiting for APEX

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Payments](../modules/77-payments.md) | view, export | Everything |
| [Receipts & Invoicing](../modules/78-receipts-invoicing.md) | view, export | Everything |
| [Cash-up & Reconciliation](../modules/79-cash-up.md) | view, approve, export | Everything |
| [APEX Integration](../modules/82-apex-integration.md) | view | Everything |
| [Reports & Analytics](../modules/81-reports-analytics.md) | view | Everything |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
