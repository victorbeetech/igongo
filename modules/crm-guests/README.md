# CRM: Guest & Client Profiles (module 54)

One profile per guest or client. Spec: [docs/modules/54-crm-guests.md](../../docs/modules/54-crm-guests.md).

- **Routes** (`/api/crm`): `GET|PATCH /me`, `PUT /me/consent` (the guest's own account); `GET|POST /guests`, `GET /guests/:id`, `PUT /guests/:id/tags`, `POST /guests/:id/notes` (staff); `GET|PUT /settings`.
- **Data**: schema `crm`: `profiles` (one per account, or a walk-in with no account), `staff_notes`, `settings` (the tag list).
- **Permissions**: `crm-guests.profiles.view|edit|create` (scope `own` for guests, wider for staff), `crm-guests.settings.edit`.
- **Contract**: `GuestDirectory` (`@igongo/contracts/crm-guests`) for other modules' staff screens.
