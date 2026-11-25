# Museum Curator

**Level:** Supervisors and officers · **Role key:** `museum-curator` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Looks after the collection and exhibits, writes exhibit content and audio guides.

**Reports to:** [Museum & Cultural Centre Manager](museum-manager.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- Exhibit content
- Inspections due
- Report a fault

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Museum & Cultural Visits](../modules/68-museum.md) | view, create, edit | Own department |
| [Files & Media](../modules/11-files-media.md) | view, create, edit | Own department |
| [Inspections & Checklists](../modules/39-inspections.md) | view, create | Own department |
| [Asset Register](../modules/41-asset-register.md) | view, create, edit | Own department |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
