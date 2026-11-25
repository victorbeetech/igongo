# Mechanic

**Level:** Frontline staff · **Role key:** `mechanic` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Services and repairs hotel vehicles, mowers and machines.

**Reports to:** [Delivery & Transport Manager](logistics-manager.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- Vehicle service due
- My jobs
- Fuel record

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Fleet & Transport](../modules/47-fleet-transport.md) | view, edit | Everything |
| [Faults & Maintenance](../modules/40-faults-maintenance.md) | view, edit | Own department |
| [Asset Register](../modules/41-asset-register.md) | view, edit | Own department |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
