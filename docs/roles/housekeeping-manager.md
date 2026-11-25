# Executive Housekeeper

**Level:** Department managers · **Role key:** `housekeeping-manager` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Keeps every room and public area clean, inspected and ready, and runs laundry.

**Reports to:** [General Manager (GM)](general-manager.md)

**Uses:** Igongo app

## Home screen tiles

- Room board
- Rooms to inspect
- Attendant assignments
- Guest requests (housekeeping)
- Laundry today
- Lost and found

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Housekeeping & Room Status](../modules/43-housekeeping.md) | view, create, edit, approve | Own department |
| [Laundry](../modules/44-laundry.md) | view, create, edit | Own department |
| [Lost & Found](../modules/46-lost-found.md) | view, create, edit | Own department |
| [Guest Requests & Help Desk](../modules/60-guest-requests.md) | view, edit | Own department |
| [Inspections & Checklists](../modules/39-inspections.md) | view, create | Own department |
| [Faults & Maintenance](../modules/40-faults-maintenance.md) | view, create | Own department |
| [Attendance](../modules/25-attendance.md) | view | Own department |
| [Shifts & Rosters](../modules/26-shifts-rosters.md) | view, create, edit, approve | Own department |
| [Leave Management](../modules/27-leave.md) | view, approve | Own department |
| [Daily Reports](../modules/38-daily-reports.md) | view, approve, comment | Own department |
| [Reports & Analytics](../modules/81-reports-analytics.md) | view | Own department |

## Approval limits

- Leave and shifts for housekeeping and laundry staff.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
