# Maintenance Manager (Chief Engineer)

**Level:** Department managers · **Role key:** `maintenance-manager` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Keeps the buildings, power, water, plumbing, equipment and vehicles working, and plans preventive maintenance.

**Reports to:** [General Manager (GM)](general-manager.md)

**Uses:** Igongo app and web portal

## Home screen tiles

- Open faults by urgency
- Faults overdue
- Jobs today
- Planned maintenance due
- Technicians on duty
- Repair costs this month

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Faults & Maintenance](../modules/40-faults-maintenance.md) | view, create, edit, approve, export, comment, like | Everything |
| [Asset Register](../modules/41-asset-register.md) | view, create, edit, export | Everything |
| [Inspections & Checklists](../modules/39-inspections.md) | view, create | Everything |
| [Tasks](../modules/42-tasks.md) | view, create | Own department |
| [Fleet & Transport](../modules/47-fleet-transport.md) | view | Everything |
| [Attendance](../modules/25-attendance.md) | view | Own department |
| [Shifts & Rosters](../modules/26-shifts-rosters.md) | view, create, edit, approve | Own department |
| [Leave Management](../modules/27-leave.md) | view, approve | Own department |
| [Daily Reports](../modules/38-daily-reports.md) | view, approve, comment | Own department |
| [Reports & Analytics](../modules/81-reports-analytics.md) | view, export | Own department |
| [Stock & Inventory](../modules/84-stock-inventory.md) | view, create | Own department |

## Approval limits

- Repair spending up to Tier 2.
- Can close faults.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
