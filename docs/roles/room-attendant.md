# Room Attendant

**Level:** Frontline staff · **Role key:** `room-attendant` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Cleans and prepares guest rooms and updates each room's status.

**Reports to:** [Housekeeping Supervisor](housekeeping-supervisor.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- My rooms today
- Guest requests for my rooms
- Report a fault
- Found an item

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Housekeeping & Room Status](../modules/43-housekeeping.md) | view, edit | Assigned to them |
| [Guest Requests & Help Desk](../modules/60-guest-requests.md) | view, edit | Assigned to them |
| [Laundry](../modules/44-laundry.md) | view, create | Own department |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
