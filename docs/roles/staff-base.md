# Every Staff Member (base role)

**Level:** Everyone · **Role key:** `staff-base` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

The base role that every staff account gets automatically. It covers self-service: my attendance, shifts, leave, pay, meals, reports, tasks, notices and chat.

**Uses:** The Igongo app on a phone

## Home screen tiles

- Clock-in status
- My shift today
- My tasks
- Notice board
- My leave balance
- My payslips
- Report a fault
- Switch to client view

## Modules, screens and default permissions

| Module | Actions | Data scope |
| --- | --- | --- |
| [Attendance](../modules/25-attendance.md) | view, create | Own records |
| [Shifts & Rosters](../modules/26-shifts-rosters.md) | view | Own records |
| [Leave Management](../modules/27-leave.md) | view, create | Own records |
| [Payslips & Lifetime Earnings](../modules/29-earnings-statements.md) | view | Own records |
| [Advances & Loans](../modules/30-advances-loans.md) | view, create | Own records |
| [Bonuses & Rewards](../modules/31-bonuses-rewards.md) | view | Own records |
| [Staff Meals](../modules/32-staff-meals.md) | view, create | Own records |
| [Training & Certificates](../modules/34-training.md) | view | Own records |
| [Staff Requests & Welfare](../modules/36-staff-welfare.md) | view, create | Own records |
| [Daily Reports](../modules/38-daily-reports.md) | view, create | Own records |
| [Faults & Maintenance](../modules/40-faults-maintenance.md) | view, create, comment, like | Own department |
| [Tasks](../modules/42-tasks.md) | view, edit | Assigned to them |
| [Lost & Found](../modules/46-lost-found.md) | create | Everything |
| [SOPs & Knowledge Base](../modules/48-knowledge-base.md) | view | Everything |
| [Notice Board](../modules/49-notice-board.md) | view, comment, like | Everything |
| [Chat](../modules/50-chat.md) | view, create | Own records |
| [Meetings & Minutes](../modules/51-meetings.md) | view | Own records |
| [Surveys & Polls](../modules/52-surveys-polls.md) | view | Own records |
| [Company Calendar](../modules/53-company-calendar.md) | view | Own records |
| [Security, Patrols & Incidents](../modules/45-security-incidents.md) | create | Everything |

**Main screens:** Me (profile and card), My attendance, My shifts, My leave, My pay, My meals, Notices, Chat, Tasks, Report a fault, Client view

## Approval limits

- None.

## Extra rules

- Payslips open only after a PIN or fingerprint.
- Panic button available to everyone on site.
- Can switch to the client view at any time to see the app exactly as a guest sees it.
