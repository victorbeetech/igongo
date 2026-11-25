# CCTV Operator

**Level:** Frontline staff · **Role key:** `cctv-operator` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Watches the cameras and raises incidents and alerts.

**Reports to:** [Security Manager](security-manager.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- Incidents today
- Refused entries
- Panic alerts

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Security, Patrols & Incidents](../modules/45-security-incidents.md) | view, create | Everything |
| [Access Control & Zones](../modules/19-access-zones.md) | view | Everything |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
