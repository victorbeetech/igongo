# Room Service Attendant

**Level:** Frontline staff · **Role key:** `room-service-attendant` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Takes room service orders and delivers them to rooms.

**Reports to:** [Restaurant Supervisor](restaurant-supervisor.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- Orders ready to serve
- New order
- Take payment

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Food Ordering](../modules/62-food-ordering.md) | view, create, edit | Own department |
| [Payments](../modules/77-payments.md) | view, create | Own department |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
