# Kids Club Attendant

**Level:** Frontline staff · **Role key:** `kids-club-attendant` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Looks after children in the play area and kids' activities.

**Reports to:** [Guest Relations Officer](guest-relations-officer.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- My schedule
- Report incident
- Panic button

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Security, Patrols & Incidents](../modules/45-security-incidents.md) | create | Everything |
| [CRM: Guest & Client Profiles](../modules/54-crm-guests.md) | view | Assigned to them |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
