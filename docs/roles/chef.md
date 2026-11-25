# Chef (Chef de Partie)

**Level:** Frontline staff · **Role key:** `chef` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Runs a kitchen station, such as grill or pastry, and prepares orders from the kitchen display.

**Reports to:** [Sous Chef](sous-chef.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- My station tickets
- Pre-orders due
- Mark item out
- Record waste

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Kitchen Display & Production](../modules/63-kitchen-display.md) | view, edit | Own department |
| [Menus & Catalogue](../modules/61-menu-catalogue.md) | view | Own department |
| [Food Ordering](../modules/62-food-ordering.md) | view | Own department |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can mark items out of stock for today at their station.
- Can switch to the client view at any time to see the app exactly as a guest sees it.
