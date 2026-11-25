# Contractor

**Level:** Partners and suppliers · **Role key:** `contractor` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

An outside company or worker doing a job on site, with a pass, work orders and safety briefing.

**Uses:** Igongo app, partner view

## Home screen tiles

- My jobs
- Report incident

## Modules, screens and default permissions

| Module | Actions | Data scope |
| --- | --- | --- |
| [Faults & Maintenance](../modules/40-faults-maintenance.md) | view, edit | Assigned to them |
| [Visitors & Contractors](../modules/20-visitor-management.md) | view | Own records |
| [Security, Patrols & Incidents](../modules/45-security-incidents.md) | create | Everything |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Access only while the contract and pass are valid.
