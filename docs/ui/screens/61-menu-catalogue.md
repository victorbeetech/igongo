# S61. Menus & Catalogue

[All screens](README.md) · [Module spec](../../modules/61-menu-catalogue.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s61-01"></a>S61-01 | Menus | App, Web | `/menu-catalogue/menus` | Menus per outlet and time | Role home | S61-02 Menu editor |
| <a id="s61-02"></a>S61-02 | Menu editor | Web | `/menu-catalogue/menu-editor/:id` | Sections, items, prices and schedule | S61-01 Menus | D61-01 Publish menu, S61-03 Item editor |
| <a id="s61-03"></a>S61-03 | Item editor | Web | `/menu-catalogue/item-editor/:id` | Photos, description, portions, options, extras, allergens and prep time | S61-02 Menu editor | Back only |
| <a id="s61-04"></a>S61-04 | Out of stock today | App, Kiosk | `/menu-catalogue/out-of-stock-today` | Kitchen switches items off and on for today | Role home | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d61-01"></a>D61-01 | Publish menu | Confirm and choose when it goes live | S61-02 Menu editor |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
