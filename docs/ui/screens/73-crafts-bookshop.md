# S73. Crafts & Bookshop

[All screens](README.md) · [Module spec](../../modules/73-crafts-bookshop.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s73-01"></a>S73-01 | Shop | App, Public | `/crafts-bookshop/shop` | Crafts, books and souvenirs online | Role home, [S00-04 Explore as guest home](00-app-shell.md#s00-04), [S00-23 Client view home](00-app-shell.md#s00-23) | S73-02 Product detail, S73-08 Shop settings |
| <a id="s73-02"></a>S73-02 | Product detail | App, Public | `/crafts-bookshop/product-detail/:id` | Photos, maker, price and stock | S73-01 Shop | D73-01 Product sold out, S73-03 Shop cart |
| <a id="s73-03"></a>S73-03 | Shop cart | App, Public | `/crafts-bookshop/shop-cart` | Items, pickup or delivery | S73-02 Product detail | [S77-01 Pay](77-payments.md#s77-01) |
| <a id="s73-04"></a>S73-04 | Shop till | App, Kiosk | `/crafts-bookshop/shop-till` | Point of sale with barcode scan | Role home | Back only |
| <a id="s73-05"></a>S73-05 | Products | Web | `/crafts-bookshop/products` | Catalogue with photos, barcodes and categories | Role home | S73-07 Shop sales |
| <a id="s73-06"></a>S73-06 | Artisans | Web | `/crafts-bookshop/artisans` | Makers, consignment items and what they are owed | Role home | Back only |
| <a id="s73-07"></a>S73-07 | Shop sales | Web | `/crafts-bookshop/shop-sales` | Sales by product and artisan | S73-05 Products | Back only |
| <a id="s73-08"></a>S73-08 | Shop settings | Web | `/crafts-bookshop/shop-settings` | Categories and which products show online; Consignment terms | S73-01 Shop | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d73-01"></a>D73-01 | Product sold out | Notify me when back | S73-02 Product detail |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
