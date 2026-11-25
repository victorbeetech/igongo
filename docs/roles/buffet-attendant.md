# Buffet Attendant

**Level:** Frontline staff · **Role key:** `buffet-attendant` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Checks buffet entry, refills the buffet and records waste.

**Reports to:** [Restaurant Supervisor](restaurant-supervisor.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- Scan card or wristband
- Production list today
- Record waste

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Buffet Service](../modules/65-buffet.md) | view, edit | Own department |
| [Kitchen Display & Production](../modules/63-kitchen-display.md) | view | Own department |
| [Bonuses & Rewards](../modules/31-bonuses-rewards.md) | view | Everything |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
