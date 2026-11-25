# Corporate Booker

**Level:** Guests and clients · **Role key:** `corporate-client` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

A person who books for a company, NGO, government office or school, using the company's account and agreed terms.

**Uses:** The Igongo app and the web portal

## Home screen tiles

- Book for my company
- Company bookings
- Event enquiries
- Invoices and statements
- Company balance

## Modules, screens and default permissions

| Module | Actions | Data scope |
| --- | --- | --- |
| [Corporate Accounts](../modules/55-corporate-accounts.md) | view | Own records |
| [Room Bookings](../modules/67-room-bookings.md) | view, create, edit | Own records |
| [Events & Conferences](../modules/69-events-conferences.md) | view, create | Own records |
| [Museum & Cultural Visits](../modules/68-museum.md) | view, create | Own records |
| [Food Ordering](../modules/62-food-ordering.md) | view, create | Own records |
| [Receipts & Invoicing](../modules/78-receipts-invoicing.md) | view, export | Own records |
| [Payments](../modules/77-payments.md) | view, create | Own records |
| [CRM: Guest & Client Profiles](../modules/54-crm-guests.md) | view, edit | Own records |

## Approval limits

- Books on credit up to the company's credit limit.

## Extra rules

- Only approved bookers named by the company can use the company account.
