# Swimming Instructor

**Level:** Frontline staff · **Role key:** `swimming-instructor` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Teaches swimming lessons and keeps lesson registers.

**Reports to:** [Pool Supervisor](pool-manager.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- My schedule
- Swimmers now
- Report incident

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Swimming Pool](../modules/71-pool.md) | view, edit | Assigned to them |
| [CRM: Guest & Client Profiles](../modules/54-crm-guests.md) | view | Assigned to them |
| [Security, Patrols & Incidents](../modules/45-security-incidents.md) | create | Everything |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
