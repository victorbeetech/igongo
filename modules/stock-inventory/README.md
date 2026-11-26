# Stock & Inventory (module 84)

Spec: [docs/modules/84-stock-inventory.md](../../docs/modules/84-stock-inventory.md).

Tracks everything the hotel buys, stores and uses. Everything is set by the super admin with no code: stores, categories, units, extra item fields, and the desk's paperwork types with their fields and approval steps.

- **Ledger** (`stock.movements`): every change is a movement (receive, issue, transfer, adjust, waste, count), kept for ever. Balances per item and store are summed from it; nothing is stored twice. Receipts update the item's average cost. A store cannot go below zero unless the super admin allows it. Adjustments and waste need a reason.
- **Units**: each item has a base unit and conversions (1 sack = 50 kg), so goods are bought in one unit and issued in another.
- **Store reach**: the permission's scope decides the stores: store keepers (`assigned`) the stores they keep, department roles their department's stores, `all` every store.
- **Values**: only holders of `stock-inventory.values.view` see costs and stock value; others see quantities.
- **Desk** (`/api/stock/desk`, built on [@igongo/records-kit](../../packages/records-kit/README.md)): requisitions, purchase requests, purchase orders, suppliers, stock counts and recipes, codes like `SD-0042`. Stock moves only through the ledger, quoting these codes as the reference.

## API

`/api/stock`: `GET|PUT /settings`, `GET|POST /stores`, `PATCH /stores/:id`, `GET|POST /items`, `GET|PATCH /items/:id`, `GET /items/code/:code`, `POST /movements`, `POST /counts`, `GET /movements`, `GET /balances`, `GET /low`, `GET /export/balances`. `/api/stock/desk`: the records kit's routes.

## Permissions

`stock-inventory.stock.view|export`, `stock-inventory.values.view`, `stock-inventory.movements.create|edit|approve`, `stock-inventory.items.edit`, `stock-inventory.settings.edit`, and the desk's `stock-inventory.records.*`.

## Data

Its own schema `stock`: `stores`, `items`, `movements`, `records`, `record_events`, `settings`.
