# Payroll Officer

**Level:** Supervisors and officers · **Role key:** `payroll-officer` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Prepares payroll, advances and statements, for review and approval by others.

**Reports to:** [Finance & Accounts Manager](finance-manager.md)

**Uses:** Web portal

## Home screen tiles

- Pay run status
- Approved hours to import
- Advances to pay
- Statement requests

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Payroll](../modules/28-payroll.md) | view, create, edit, export | Everything |
| [Payslips & Lifetime Earnings](../modules/29-earnings-statements.md) | view, create, export | Everything |
| [Advances & Loans](../modules/30-advances-loans.md) | view, edit | Everything |
| [Bonuses & Rewards](../modules/31-bonuses-rewards.md) | view | Everything |
| [HR Staff Records](../modules/22-hr-records.md) | view | Everything |
| [Attendance](../modules/25-attendance.md) | view | Everything |

## Approval limits

- Cannot approve a pay run they prepared.

## Extra rules

- 2FA required.
- Every view of salary data is logged.
- Can switch to the client view at any time to see the app exactly as a guest sees it.
