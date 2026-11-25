# S03. App Layout & Navigation

[All screens](README.md) · [Module spec](../../modules/03-app-builder.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s03-01"></a>S03-01 | Layout editor | Web | `/app-builder/layout-editor/:id` | Drag and drop menus, tabs and home tiles for a role | Role home, [S01-01 Console home](01-super-admin.md#s01-01) | S03-02 Tile library, S03-04 Screen order, S03-05 Device layouts, S03-06 Public screens, S03-07 Client view settings, S03-08 Layout preview, S03-09 Layout history |
| <a id="s03-02"></a>S03-02 | Tile library | Web | `/app-builder/tile-library` | All available tiles: shortcuts, counters, charts, lists, actions | S03-01 Layout editor | S03-03 Tile settings |
| <a id="s03-03"></a>S03-03 | Tile settings | Web | `/app-builder/tile-settings` | Data, rules and look of one tile | S03-02 Tile library | Back only |
| <a id="s03-04"></a>S03-04 | Screen order | Web | `/app-builder/screen-order` | Order of screens in each menu | S03-01 Layout editor | Back only |
| <a id="s03-05"></a>S03-05 | Device layouts | Web | `/app-builder/device-layouts` | Phone, tablet, kiosk and web variants | S03-01 Layout editor | Back only |
| <a id="s03-06"></a>S03-06 | Public screens | Web | `/app-builder/public-screens` | What guests see before signing in | S03-01 Layout editor | Back only |
| <a id="s03-07"></a>S03-07 | Client view settings | Web | `/app-builder/client-view-settings` | Which roles can switch, and how test orders are marked | S03-01 Layout editor | Back only |
| <a id="s03-08"></a>S03-08 | Layout preview | App, Web | `/app-builder/layout-preview` | Live preview on a phone frame | S03-01 Layout editor, [S02-10 View as role](02-roles-permissions.md#s02-10) | D03-01 Publish layout |
| <a id="s03-09"></a>S03-09 | Layout history | Web | `/app-builder/layout-history` | Published layouts with roll back | S03-01 Layout editor | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d03-01"></a>D03-01 | Publish layout | Publish now or schedule | S03-08 Layout preview |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
