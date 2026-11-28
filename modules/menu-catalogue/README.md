# Menus & Catalogue (module 61)

Everything the outlets sell. Spec: [docs/modules/61-menu-catalogue.md](../../docs/modules/61-menu-catalogue.md).

- **Routes** (`/api/menu`): `GET /outlets`, `GET /items` (public), `GET /items/:id`, `GET /search?q=` (public global search, S00-25), `POST /items`, `PATCH /items/:id`, `POST /items/:id/stock`, `GET|PUT /settings`.
- **Data**: schema `menu`: `items` (prices, portions and options as data; never deleted, only switched off), `settings` (outlets and which show to clients).
- **Out of stock** lasts for the hotel day it was set, then clears itself.
- **Permissions**: `menu-catalogue.items.view|create|edit`, `menu-catalogue.stock.edit` (or `kitchen-display.tickets.edit`), `menu-catalogue.settings.edit`.
- **Venues (outlets)**: only the Super Admin role may add, rename, switch on or off for guests, remove, or replace the list (`POST /api/menu/outlets`, `PATCH|DELETE /api/menu/outlets/:key`, `PUT /api/menu/settings`). A venue with dishes cannot be removed; switch it off instead. Guests see only the switched-on venues (`GET /api/menu/outlets`), which the Food venue carousel reads.
- **Contract**: `MenuReader` (`@igongo/contracts/menu-catalogue`) for Food Ordering.
