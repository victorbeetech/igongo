# Store Keeper

**Level:** Frontline staff · **Role key:** `store-keeper` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Keeps the stores: issues assets, uniforms and linen, and signs keys and equipment in and out. Full stock management is outside this project's scope.

**Reports to:** [Finance & Accounts Manager](finance-manager.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- Asset issue and return
- Uniform issue
- Keys out
- Asset count

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Asset Register](../modules/41-asset-register.md) | view, create, edit | Everything |
| [Key Control](../modules/21-key-control.md) | view, edit | Everything |
| [Staff Requests & Welfare](../modules/36-staff-welfare.md) | view, edit | Everything |
| [Laundry](../modules/44-laundry.md) | view | Everything |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
