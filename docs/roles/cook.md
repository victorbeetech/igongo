# Cook

**Level:** Frontline staff · **Role key:** `cook` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Prepares food, including staff meals and buffets, following the kitchen display and production lists.

**Reports to:** [Sous Chef](sous-chef.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- Tickets now
- Production list today
- Staff meals count

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Kitchen Display & Production](../modules/63-kitchen-display.md) | view, edit | Own department |
| [Buffet Service](../modules/65-buffet.md) | view | Own department |
| [Staff Meals](../modules/32-staff-meals.md) | view | Own department |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
