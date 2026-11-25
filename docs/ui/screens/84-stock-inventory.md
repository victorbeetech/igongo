# S84. Stock & Inventory

[All screens](README.md) · [Module spec](../../modules/84-stock-inventory.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s84-01"></a>S84-01 | Stock home | App, Web | `/stock-inventory/stock-home` | Stock value, low stock, expiring and requests waiting, per store | Role home | D84-04 Below minimum, D84-05 Expiring stock, S84-02 Stores, S84-03 Items, S84-07 Receive goods, S84-08 Requisitions, S84-11 Transfers, S84-15 Stock count, S84-17 Wastage, S84-18 Recipes, S84-19 Stock reports, S84-20 Stock settings |
| <a id="s84-02"></a>S84-02 | Stores | Web | `/stock-inventory/stores` | Stores and sub-stores with their keepers | S84-01 Stock home | Back only |
| <a id="s84-03"></a>S84-03 | Items | App, Web | `/stock-inventory/items` | Items with photo, code, units, levels and suppliers | S84-01 Stock home | S84-04 Item detail, S84-06 Units and conversions |
| <a id="s84-04"></a>S84-04 | Item detail | App, Web | `/stock-inventory/item-detail/:id` | Stock per store, batches, movements and suppliers | S84-03 Items | S84-05 Item editor |
| <a id="s84-05"></a>S84-05 | Item editor | Web | `/stock-inventory/item-editor/:id` | Category, units and conversions, tracking type and levels | S84-04 Item detail | Back only |
| <a id="s84-06"></a>S84-06 | Units and conversions | Web | `/stock-inventory/units-and-conversions` | Units such as crate, sack, kg and how they convert | S84-03 Items | Back only |
| <a id="s84-07"></a>S84-07 | Receive goods | App, Web | `/stock-inventory/receive-goods` | Count a delivery against the order, with photos | S84-01 Stock home, S84-13 Purchase orders | D84-03 Short delivery |
| <a id="s84-08"></a>S84-08 | Requisitions | App, Web | `/stock-inventory/requisitions` | Requests from departments, waiting and issued | Role home, S84-01 Stock home, S84-09 New requisition | D84-01 Approve requisition |
| <a id="s84-09"></a>S84-09 | New requisition | App | `/stock-inventory/new-requisition` | Department asks for items from a store | Role home | S84-08 Requisitions |
| <a id="s84-10"></a>S84-10 | Issue stock | App, Kiosk | `/stock-inventory/issue-stock` | Keeper issues items, receiver confirms with a card tap | D84-01 Approve requisition | Back only |
| <a id="s84-11"></a>S84-11 | Transfers | App, Web | `/stock-inventory/transfers` | Moves between stores with both sides confirming | S84-01 Stock home | Back only |
| <a id="s84-12"></a>S84-12 | Purchase requests | App, Web | `/stock-inventory/purchase-requests` | Requests raised from low stock or by hand | D84-04 Below minimum | S84-13 Purchase orders |
| <a id="s84-13"></a>S84-13 | Purchase orders | Web | `/stock-inventory/purchase-orders` | Orders to suppliers with expected dates | Role home, S84-12 Purchase requests | S84-07 Receive goods, S84-14 Suppliers |
| <a id="s84-14"></a>S84-14 | Suppliers | Web | `/stock-inventory/suppliers` | Contacts, items supplied, lead times and performance | S84-13 Purchase orders | Back only |
| <a id="s84-15"></a>S84-15 | Stock count | App, Kiosk | `/stock-inventory/stock-count` | Count by store, category or spot check, blind if set | Role home, S84-01 Stock home | S84-16 Count variances |
| <a id="s84-16"></a>S84-16 | Count variances | Web | `/stock-inventory/count-variances` | Differences found and adjustments waiting for approval | S84-15 Stock count | D84-02 Approve adjustment |
| <a id="s84-17"></a>S84-17 | Wastage | App, Web | `/stock-inventory/wastage` | Breakage, spoilage and expiry with photo and reason | D84-05 Expiring stock, S84-01 Stock home | Back only |
| <a id="s84-18"></a>S84-18 | Recipes | Web | `/stock-inventory/recipes` | Ingredients per menu item for usage tracking | S84-01 Stock home | Back only |
| <a id="s84-19"></a>S84-19 | Stock reports | Web | `/stock-inventory/stock-reports` | On hand, value, consumption, slow moving and variance | S84-01 Stock home | Back only |
| <a id="s84-20"></a>S84-20 | Stock settings | Web | `/stock-inventory/stock-settings` | Valuation, approvals, reorder rules, count schedules and switches | S84-01 Stock home | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d84-01"></a>D84-01 | Approve requisition | Approve, part approve or reject | S84-08 Requisitions |
| <a id="d84-02"></a>D84-02 | Approve adjustment | Approve a count variance with reason | S84-16 Count variances |
| <a id="d84-03"></a>D84-03 | Short delivery | Record short, damaged or rejected items | S84-07 Receive goods |
| <a id="d84-04"></a>D84-04 | Below minimum | Raise a purchase request now or later | S84-01 Stock home |
| <a id="d84-05"></a>D84-05 | Expiring stock | Use first, move or write off | S84-01 Stock home |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
