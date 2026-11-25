# HR Manager

**Level:** Department managers · **Role key:** `hr-manager` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Runs everything about people: enrolment, contracts, attendance rules, leave, training, discipline, welfare and exits.

**Reports to:** [General Manager (GM)](general-manager.md)

**Uses:** Web portal and Igongo app

## Home screen tiles

- Staff count and changes
- Contracts expiring
- Leave today
- Attendance exceptions
- Recruitment pipeline
- Open cases
- Probation reviews due

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [HR Staff Records](../modules/22-hr-records.md) | view, create, edit, export | Everything |
| [Recruitment](../modules/23-recruitment.md) | view, create, edit, approve | Everything |
| [Onboarding & Exit](../modules/24-onboarding-exit.md) | view, create, edit, approve | Everything |
| [Attendance](../modules/25-attendance.md) | view, edit, approve, export | Everything |
| [Shifts & Rosters](../modules/26-shifts-rosters.md) | view | Everything |
| [Leave Management](../modules/27-leave.md) | view, edit, approve | Everything |
| [Payslips & Lifetime Earnings](../modules/29-earnings-statements.md) | view | Everything |
| [Advances & Loans](../modules/30-advances-loans.md) | view, approve | Everything |
| [Bonuses & Rewards](../modules/31-bonuses-rewards.md) | view, create, approve | Everything |
| [Performance & Appraisals](../modules/33-performance.md) | view, create, edit | Everything |
| [Training & Certificates](../modules/34-training.md) | view, create, edit | Everything |
| [Discipline & Cases](../modules/35-discipline.md) | view, create, edit, approve | Everything |
| [Staff Requests & Welfare](../modules/36-staff-welfare.md) | view, edit, approve | Everything |
| [NFC & QR Staff Cards](../modules/16-staff-cards.md) | view, create, edit | Everything |
| [SOPs & Knowledge Base](../modules/48-knowledge-base.md) | view, create, edit | Everything |
| [Notice Board](../modules/49-notice-board.md) | view, create, edit, comment, like | Everything |
| [Reports & Analytics](../modules/81-reports-analytics.md) | view, export | Own department |

## Approval limits

- Advances up to Tier 1.
- Leave for any staff.
- Hires below manager level.

## Extra rules

- 2FA required.
- Sees salaries only if also given the payroll officer role.
- Can switch to the client view at any time to see the app exactly as a guest sees it.
