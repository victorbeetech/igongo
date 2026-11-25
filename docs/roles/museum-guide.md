# Museum Guide

**Level:** Frontline staff · **Role key:** `museum-guide` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Leads tours of the museum, cultural village and monuments, and checks tickets.

**Reports to:** [Museum & Cultural Centre Manager](museum-manager.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- My tours today
- Scan ticket
- Group lists
- Exhibit notes

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Museum & Cultural Visits](../modules/68-museum.md) | view, edit | Assigned to them |
| [CRM: Guest & Client Profiles](../modules/54-crm-guests.md) | view | Assigned to them |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
