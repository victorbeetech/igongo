# Pastry Chef / Baker

**Level:** Frontline staff · **Role key:** `pastry-chef` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Makes bread, pastries and desserts for outlets and events.

**Reports to:** [Sous Chef](sous-chef.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- My station tickets
- Production list today
- Record waste
- Mark item out

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Kitchen Display & Production](../modules/63-kitchen-display.md) | view, edit | Own department |
| [Menus & Catalogue](../modules/61-menu-catalogue.md) | view, edit | Own department |
| [Stock & Inventory](../modules/84-stock-inventory.md) | view, create | Own department |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
