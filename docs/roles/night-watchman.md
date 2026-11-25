# Night Watchman

**Level:** Frontline staff · **Role key:** `night-watchman` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Patrols at night and reports incidents.

**Reports to:** [Security Supervisor](security-supervisor.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- My patrol route
- Scan checkpoint
- Report incident
- Panic button

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Security, Patrols & Incidents](../modules/45-security-incidents.md) | view, create | Own records |
| [Access Control & Zones](../modules/19-access-zones.md) | view | Everything |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
