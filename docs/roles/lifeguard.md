# Lifeguard

**Level:** Frontline staff · **Role key:** `lifeguard` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Keeps swimmers safe, checks entries and records water tests and incidents.

**Reports to:** [Pool Supervisor](pool-manager.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- Swimmers now
- Scan pass or wristband
- Water test
- Report incident
- Panic button

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Swimming Pool](../modules/71-pool.md) | view, edit | Own department |
| [Security, Patrols & Incidents](../modules/45-security-incidents.md) | view, create | Own records |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
