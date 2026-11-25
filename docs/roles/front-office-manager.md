# Front Office Manager

**Level:** Department managers · **Role key:** `front-office-manager` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Runs reception, reservations, guest relations, concierge and porters, working alongside APEX.

**Reports to:** [General Manager (GM)](general-manager.md)

**Uses:** Igongo app and web portal

## Home screen tiles

- Arrivals and departures today
- App bookings waiting for APEX
- Guest requests open
- WhatsApp chats waiting
- Complaints
- Lost and found

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Room Bookings](../modules/67-room-bookings.md) | view, edit, approve | Own department |
| [CRM: Guest & Client Profiles](../modules/54-crm-guests.md) | view, create, edit | Everything |
| [Corporate Accounts](../modules/55-corporate-accounts.md) | view | Everything |
| [Feedback, Complaints & Reviews](../modules/56-guest-feedback.md) | view, edit, comment | Everything |
| [Guest Requests & Help Desk](../modules/60-guest-requests.md) | view, edit, approve | Everything |
| [WhatsApp Concierge](../modules/74-whatsapp-concierge.md) | view, edit | Everything |
| [Lost & Found](../modules/46-lost-found.md) | view, create, edit | Everything |
| [Visitors & Contractors](../modules/20-visitor-management.md) | view | Everything |
| [APEX Integration](../modules/82-apex-integration.md) | view | Everything |
| [Attendance](../modules/25-attendance.md) | view | Own department |
| [Shifts & Rosters](../modules/26-shifts-rosters.md) | view, create, edit, approve | Own department |
| [Leave Management](../modules/27-leave.md) | view, approve | Own department |
| [Daily Reports](../modules/38-daily-reports.md) | view, approve, comment | Own department |
| [Reports & Analytics](../modules/81-reports-analytics.md) | view, export | Own department |

## Approval limits

- Room booking changes and refunds up to Tier 2.
- Complaint vouchers up to Tier 1.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
