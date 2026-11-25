# Senior Manager

**Level:** Leadership · **Role key:** `senior-manager` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Runs a group of departments for the CEO, such as all guest services or all support services, and steps in for the GM when needed.

**Reports to:** [Chief Executive Officer](ceo.md)

**Uses:** Igongo app and web portal

## Home screen tiles

- My departments dashboard
- Approvals waiting for me
- Daily reports to sign
- Open faults
- Staff on duty now

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Reports & Analytics](../modules/81-reports-analytics.md) | view, export | Everything |
| [Workflow & Approvals](../modules/09-workflow-approvals.md) | view, approve | Everything |
| [HR Staff Records](../modules/22-hr-records.md) | view | Everything |
| [Attendance](../modules/25-attendance.md) | view, export | Everything |
| [Shifts & Rosters](../modules/26-shifts-rosters.md) | view | Everything |
| [Leave Management](../modules/27-leave.md) | view, approve | Everything |
| [Advances & Loans](../modules/30-advances-loans.md) | view, approve | Everything |
| [Bonuses & Rewards](../modules/31-bonuses-rewards.md) | view, create, approve | Everything |
| [Daily Reports](../modules/38-daily-reports.md) | view, approve, comment | Everything |
| [Inspections & Checklists](../modules/39-inspections.md) | view | Everything |
| [Faults & Maintenance](../modules/40-faults-maintenance.md) | view, comment | Everything |
| [Tasks](../modules/42-tasks.md) | view, create | Everything |
| [Notice Board](../modules/49-notice-board.md) | view, create, comment, like | Everything |
| [Meetings & Minutes](../modules/51-meetings.md) | view, create | Everything |
| [Feedback, Complaints & Reviews](../modules/56-guest-feedback.md) | view | Everything |
| [Events & Conferences](../modules/69-events-conferences.md) | view, approve | Everything |

## Approval limits

- Up to Tier 2 for spending, advances, bonuses and discounts.
- Approves leave for department managers.

## Extra rules

- 2FA required.
- Can be made acting GM with a temporary role.
- Can switch to the client view at any time to see the app exactly as a guest sees it.
