# Events Coordinator

**Level:** Supervisors and officers · **Role key:** `events-coordinator` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Runs individual events on the day: setup, run sheet, wristbands, guest list and teams.

**Reports to:** [Events & Conferences Manager](events-manager.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- My events
- Run sheet today
- Guest list check-in
- Wristband scans
- Event tasks

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Events & Conferences](../modules/69-events-conferences.md) | view, edit | Assigned to them |
| [Venues & Equipment Hire](../modules/70-venues-equipment.md) | view | Everything |
| [Event Wristbands](../modules/17-wristbands.md) | view, create, edit | Assigned to them |
| [Buffet Service](../modules/65-buffet.md) | view | Assigned to them |
| [Tasks](../modules/42-tasks.md) | view, create | Assigned to them |

## Approval limits

- Can assign and reset wristband ranges for their own events.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
