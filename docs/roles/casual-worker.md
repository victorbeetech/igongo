# Casual Worker

**Level:** Frontline staff · **Role key:** `casual-worker` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

A short-term or daily worker, such as extra event staff. Clocks in and sees only their shift.

**Uses:** The Igongo app on a phone

## Home screen tiles

- Clock-in status
- My shift
- Tasks

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Attendance](../modules/25-attendance.md) | view, create | Own records |
| [Shifts & Rosters](../modules/26-shifts-rosters.md) | view | Own records |
| [Tasks](../modules/42-tasks.md) | view, edit | Assigned to them |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Card expires on the last day of the engagement.
- Can switch to the client view at any time to see the app exactly as a guest sees it.
