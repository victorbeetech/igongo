# Food Runner

**Level:** Frontline staff · **Role key:** `food-runner` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Carries food from the pass to tables, rooms and events.

**Reports to:** [Restaurant Supervisor](restaurant-supervisor.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- Orders ready to serve
- My tables

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Food Ordering](../modules/62-food-ordering.md) | view, edit | Own department |
| [Tables & Dine-in](../modules/64-tables-dinein.md) | view | Own department |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
