# Spa Therapist

**Level:** Frontline staff · **Role key:** `spa-therapist` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Gives treatments and keeps the treatment rooms ready.

**Reports to:** [Spa Manager (Humura)](spa-manager.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- My appointments today
- Guest health notes
- My schedule

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Spa / Humura](../modules/72-spa.md) | view, edit | Assigned to them |
| [CRM: Guest & Client Profiles](../modules/54-crm-guests.md) | view | Assigned to them |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
