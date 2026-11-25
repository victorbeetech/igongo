# Linen Keeper

**Level:** Frontline staff · **Role key:** `linen-keeper` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Issues and counts linen and uniforms between the laundry and departments.

**Reports to:** [Housekeeping Supervisor](housekeeping-supervisor.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- Linen counts
- Uniform and linen issue
- Laundry today

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Laundry](../modules/44-laundry.md) | view, create, edit | Everything |
| [Stock & Inventory](../modules/84-stock-inventory.md) | view, create | Own department |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
