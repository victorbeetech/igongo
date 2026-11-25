# Generator and Power Operator

**Level:** Frontline staff · **Role key:** `generator-operator` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Runs and checks generators, solar, power changeovers and fuel levels.

**Reports to:** [Maintenance Manager (Chief Engineer)](maintenance-manager.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- Tank and pump checks
- Electrical faults
- Fuel record
- Scan an asset

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Inspections & Checklists](../modules/39-inspections.md) | view, create | Assigned to them |
| [Faults & Maintenance](../modules/40-faults-maintenance.md) | view, edit | Own department |
| [Asset Register](../modules/41-asset-register.md) | view, edit | Own department |
| [Fleet & Transport](../modules/47-fleet-transport.md) | view, create | Own department |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
