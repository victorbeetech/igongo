# Assistant General Manager

**Level:** Leadership · **Role key:** `assistant-gm` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Supports the GM and runs the hotel when the GM is away.

**Reports to:** [General Manager (GM)](general-manager.md)

**Uses:** Igongo app and web portal

## Home screen tiles

- Operations dashboard
- Approvals waiting for me
- Staff on duty
- Today's events and pre-orders
- Open faults
- Complaints

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Reports & Analytics](../modules/81-reports-analytics.md) | view, export | Everything |
| [Workflow & Approvals](../modules/09-workflow-approvals.md) | view, approve | Everything |
| [Attendance](../modules/25-attendance.md) | view, export | Everything |
| [Shifts & Rosters](../modules/26-shifts-rosters.md) | view, approve | Everything |
| [Leave Management](../modules/27-leave.md) | view, approve | Everything |
| [Advances & Loans](../modules/30-advances-loans.md) | view, approve | Everything |
| [Daily Reports](../modules/38-daily-reports.md) | view, approve, comment | Everything |
| [Faults & Maintenance](../modules/40-faults-maintenance.md) | view, comment | Everything |
| [Tasks](../modules/42-tasks.md) | view, create | Everything |
| [Notice Board](../modules/49-notice-board.md) | view, create, comment, like | Everything |
| [Feedback, Complaints & Reviews](../modules/56-guest-feedback.md) | view, edit | Everything |
| [Events & Conferences](../modules/69-events-conferences.md) | view | Everything |
| [Cash-up & Reconciliation](../modules/79-cash-up.md) | view, approve | Everything |

## Approval limits

- Up to Tier 2.
- Payroll access only when made acting GM.

## Extra rules

- 2FA required.
- Can switch to the client view at any time to see the app exactly as a guest sees it.
