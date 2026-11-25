# Department Supervisor (template)

**Level:** Supervisors and officers · **Role key:** `department-supervisor` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

A starting point for any shift or section supervisor. Clone it and set the department to make, for example, Restaurant Supervisor or Night Supervisor.

**Reports to:** [General Manager (GM)](general-manager.md)

**Uses:** Igongo app

## Home screen tiles

- My team on duty
- Late and absent today
- Daily reports to sign
- Tasks overdue
- Shift swaps to approve

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Attendance](../modules/25-attendance.md) | view, edit | Own team |
| [Shifts & Rosters](../modules/26-shifts-rosters.md) | view, create, edit, approve | Own team |
| [Leave Management](../modules/27-leave.md) | view, approve | Own team |
| [Daily Reports](../modules/38-daily-reports.md) | view, approve, comment | Own team |
| [Inspections & Checklists](../modules/39-inspections.md) | view, create | Own department |
| [Faults & Maintenance](../modules/40-faults-maintenance.md) | view, create, comment | Own department |
| [Tasks](../modules/42-tasks.md) | view, create | Own team |

## Approval limits

- Shift swaps and attendance corrections for the team.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
