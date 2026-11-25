# Minibar Attendant

**Level:** Frontline staff · **Role key:** `minibar-attendant` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Checks and refills minibars and amenities in rooms.

**Reports to:** [Housekeeping Supervisor](housekeeping-supervisor.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- My rooms today
- Low stock

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Housekeeping & Room Status](../modules/43-housekeeping.md) | view, edit | Own department |
| [Stock & Inventory](../modules/84-stock-inventory.md) | view, create | Own department |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
