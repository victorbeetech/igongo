# Pool Supervisor

**Level:** Department managers · **Role key:** `pool-manager` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Runs the pools safely: passes, memberships, lifeguards, water quality and lessons.

**Reports to:** [General Manager (GM)](general-manager.md)

**Uses:** Igongo app

## Home screen tiles

- Swimmers now and capacity
- Passes sold today
- Lifeguards on duty
- Water tests due
- Incidents

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Swimming Pool](../modules/71-pool.md) | view, create, edit, approve, export | Own department |
| [Loyalty & Membership](../modules/57-loyalty.md) | view | Own department |
| [Security, Patrols & Incidents](../modules/45-security-incidents.md) | view, create | Own department |
| [Attendance](../modules/25-attendance.md) | view | Own department |
| [Shifts & Rosters](../modules/26-shifts-rosters.md) | view, create, edit, approve | Own department |
| [Daily Reports](../modules/38-daily-reports.md) | view, approve, comment | Own department |
| [Inspections & Checklists](../modules/39-inspections.md) | view, create | Own department |

## Approval limits

- Can close the pool.
- Pass refunds up to Tier 1.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
