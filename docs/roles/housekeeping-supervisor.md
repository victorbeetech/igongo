# Housekeeping Supervisor

**Level:** Supervisors and officers · **Role key:** `housekeeping-supervisor` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Assigns rooms to attendants and inspects rooms before they are released.

**Reports to:** [Executive Housekeeper](housekeeping-manager.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- Rooms to inspect
- Attendant progress
- Guest requests (housekeeping)
- Out of order rooms

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Housekeeping & Room Status](../modules/43-housekeeping.md) | view, edit, approve | Own department |
| [Guest Requests & Help Desk](../modules/60-guest-requests.md) | view, edit | Own department |
| [Inspections & Checklists](../modules/39-inspections.md) | view, create | Own department |
| [Faults & Maintenance](../modules/40-faults-maintenance.md) | view, create | Own department |
| [Attendance](../modules/25-attendance.md) | view | Own team |
| [Shifts & Rosters](../modules/26-shifts-rosters.md) | view, approve | Own team |

## Approval limits

- Releases inspected rooms.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
