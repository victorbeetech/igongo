# Modules spec

This is the official list of modules for the Igongo Staff & Guest System. Each module has its own file with a summary, features, super admin options, what it depends on, the events it sends, and what happens when it is switched off.

## Rules every module follows

1. **Fully independent.** No module is a sub-module of another. Each one has its own code folder, its own database tables and its own API. Payroll is not part of HR, the Notice Board is not part of Chat, and Receipts are not part of Payments. If one module has a problem, it can be fixed or switched off without breaking the others.
2. **Talks only through APIs and events.** A module never reads another module's tables. It calls the other module's published API, or listens for its events (such as `order.placed` or `attendance.late`). If the other module is off, it skips that step and carries on.
3. **Configured by the super admin, not by code.** Every option, label, form, workflow, price, permission and screen is data. The code is written once, and the hotel changes everything else from the [Super Admin Console](01-super-admin.md).
4. **Permission-aware.** Every screen, action and field is checked against [Roles & Permissions](02-roles-permissions.md). Roles are data that the super admin creates, never code. See the [roles spec](../roles/README.md).
5. **Everything is recorded.** Every action goes to the [Audit Trail](05-audit-trail.md), and nothing is truly deleted. Records stay searchable for years through [Records Archive & Search](06-records-search.md).
6. **QR on everything physical.** Staff cards, wristbands, assets, tables, rooms, exhibits, tickets, receipts and patrol points all carry a QR code. Cards and wristbands also carry NFC.
7. **Works offline where it matters.** Gate clock-in, wristband scans, meal claims, inspections and kitchen tickets keep working with no network and sync later.
8. **One app.** Every module appears inside the single Igongo app and the web portal. Which parts a person sees depends only on their roles. See [How the single app works](#how-the-single-app-works).

## Standard actions

Every feature in every module uses the same permission actions, so the role builder looks the same everywhere: **view, create, edit, approve, delete, export, comment, like**. Each one can be limited to a data scope: everything, own location, own department, own team, assigned to me, or own records.

## How the single app works

- There is **one Flutter app** for everyone: staff, managers, riders, the board and clients. There is no separate staff app, rider app or guest app.
- Everyone uses **the same entry point and login screen**. Accounts are registered through the super admin's rules: staff accounts come from HR, and client accounts are created by sign-up, at the front desk or from a booking, as the super admin allows.
- After login, the app reads the person's roles and **builds their interface** (menus, home tiles and screens) through [App Layout & Navigation](03-app-builder.md). A new role works at once, with no app update.
- **Any staff role can switch to the client view** and see exactly what clients see, then switch back.
- The web portal uses the same roles and the same modules, for work that is easier on a big screen, such as payroll, reports and super admin settings.

## Scope note

Stock and event wristbands were taken out of the signed scope on 24 Nov 2026 and put back in on 25 Nov 2026, at the hotel's request. Stock is its own module, [Stock & Inventory](84-stock-inventory.md), configured entirely by the super admin. Bar management is still out of scope: drinks are sold as menu items through [Menus & Catalogue](61-menu-catalogue.md) and [Food Ordering](62-food-ordering.md), and bar stores are run as stores in Stock & Inventory.
