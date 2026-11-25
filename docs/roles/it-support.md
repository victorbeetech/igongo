# IT Support Officer

**Level:** Supervisors and officers · **Role key:** `it-support` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Sets up devices and printers, prints cards and helps staff with app problems.

**Reports to:** [IT Manager](it-manager.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- Devices offline
- Card print queue
- IT faults
- Printer status

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Devices & Stations](../modules/18-devices-stations.md) | view, create, edit | Everything |
| [NFC & QR Staff Cards](../modules/16-staff-cards.md) | view, create | Everything |
| [Faults & Maintenance](../modules/40-faults-maintenance.md) | view, edit | Own department |
| [Users, Accounts & Login](../modules/04-users-login.md) | view | Everything |

## Approval limits

- None.

## Extra rules

- Can reset a staff PIN after checking identity.
- Can switch to the client view at any time to see the app exactly as a guest sees it.
