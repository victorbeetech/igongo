# Menus & Catalogue (module 61)

Everything the outlets sell. Spec: [docs/modules/61-menu-catalogue.md](../../docs/modules/61-menu-catalogue.md).

- **Routes** (`/api/menu`): `GET /outlets`, `GET /items` (public), `GET /items/:id`, `POST /items`, `PATCH /items/:id`, `POST /items/:id/stock`, `GET|PUT /settings`.
- **Data**: schema `menu`: `items` (prices, portions and options as data; never deleted, only switched off), `settings` (outlets and which show to clients).
- **Out of stock** lasts for the hotel day it was set, then clears itself.
- **Permissions**: `menu-catalogue.items.view|create|edit`, `menu-catalogue.stock.edit` (or `kitchen-display.tickets.edit`), `menu-catalogue.settings.edit`.
- **Contract**: `MenuReader` (`@igongo/contracts/menu-catalogue`) for Food Ordering.
