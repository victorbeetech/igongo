# Gatekeeper

**Level:** Frontline staff · **Role key:** `gatekeeper` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Controls the main gate: staff clock-in station, visitors, vehicles and deliveries.

**Reports to:** [Security Supervisor](security-supervisor.md)

**Uses:** Gate handheld in kiosk mode, and the Igongo app

## Home screen tiles

- Scan card or wristband
- Register visitor
- Visitors inside
- Vehicle log
- Expected arrivals

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [NFC & QR Staff Cards](../modules/16-staff-cards.md) | view | Everything |
| [Event Wristbands](../modules/17-wristbands.md) | view | Everything |
| [Access Control & Zones](../modules/19-access-zones.md) | view | Everything |
| [Visitors & Contractors](../modules/20-visitor-management.md) | view, create, edit | Everything |
| [Security, Patrols & Incidents](../modules/45-security-incidents.md) | view, create | Everything |
| [Attendance](../modules/25-attendance.md) | view | Everything |

**Main screens:** Card scan result shows photo, name, role, on duty or not, and allowed zones only

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can only use the gate station devices for staff clock-in.
- Can switch to the client view at any time to see the app exactly as a guest sees it.
