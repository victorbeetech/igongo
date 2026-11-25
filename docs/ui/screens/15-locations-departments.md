# S15. Locations & Departments

[All screens](README.md) · [Module spec](../../modules/15-locations-departments.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s15-01"></a>S15-01 | Organisation chart | App, Web | `/locations-departments/organisation-chart` | Departments, heads and reporting lines | Role home, [S01-01 Console home](01-super-admin.md#s01-01) | S15-02 Departments, S15-03 Locations and areas, S15-04 Outlets, S15-05 Cost centres |
| <a id="s15-02"></a>S15-02 | Departments | Web | `/locations-departments/departments` | Add, edit, merge and retire departments | S15-01 Organisation chart | Back only |
| <a id="s15-03"></a>S15-03 | Locations and areas | Web | `/locations-departments/locations-and-areas` | Sites, buildings, areas and map boundaries | S15-01 Organisation chart | Back only |
| <a id="s15-04"></a>S15-04 | Outlets | Web | `/locations-departments/outlets` | Sales outlets with opening hours | S15-01 Organisation chart | Back only |
| <a id="s15-05"></a>S15-05 | Cost centres | Web | `/locations-departments/cost-centres` | Cost centres for reporting | S15-01 Organisation chart | Back only |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
