# IT Manager

**Level:** Department managers · **Role key:** `it-manager` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Looks after devices, networks, cards and printers, and supports the super admin.

**Reports to:** [General Manager (GM)](general-manager.md)

**Uses:** Web portal and Igongo app

## Home screen tiles

- Devices offline
- Integration status
- Card printing queue
- IT faults
- Backups

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Devices & Stations](../modules/18-devices-stations.md) | view, create, edit, delete | Everything |
| [NFC & QR Staff Cards](../modules/16-staff-cards.md) | view, create, edit | Everything |
| [Integrations Hub & Webhooks](../modules/14-integrations-hub.md) | view | Everything |
| [Data Import, Export & Backup](../modules/13-data-import-export.md) | view | Everything |
| [Faults & Maintenance](../modules/40-faults-maintenance.md) | view, create, edit | Own department |
| [Users, Accounts & Login](../modules/04-users-login.md) | view, edit | Everything |

## Approval limits

- None by default.

## Extra rules

- 2FA required.
- Can reset logins and sign out sessions, but cannot change roles unless also a super admin.
- Can switch to the client view at any time to see the app exactly as a guest sees it.
