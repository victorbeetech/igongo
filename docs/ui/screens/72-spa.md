# S72. Spa / Humura

[All screens](README.md) · [Module spec](../../modules/72-spa.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s72-01"></a>S72-01 | Spa home | App, Public | `/spa/spa-home` | Treatments and packages | Role home, [S00-04 Explore as guest home](00-app-shell.md#s00-04), [S00-23 Client view home](00-app-shell.md#s00-23) | S72-02 Treatment detail |
| <a id="s72-02"></a>S72-02 | Treatment detail | App, Public | `/spa/treatment-detail/:id` | Description, time and price | S72-01 Spa home | S72-03 Book treatment |
| <a id="s72-03"></a>S72-03 | Book treatment | App, Public | `/spa/book-treatment` | Date, time and therapist | S72-02 Treatment detail | S72-04 Health questions |
| <a id="s72-04"></a>S72-04 | Health questions | App, Public | `/spa/health-questions` | Questions before the treatment | Role home, S72-03 Book treatment | [S77-01 Pay](77-payments.md#s77-01) |
| <a id="s72-05"></a>S72-05 | My spa bookings | App | `/spa/my-spa-bookings` | Upcoming and past treatments | Role home | Back only |
| <a id="s72-06"></a>S72-06 | Spa schedule | App, Web | `/spa/spa-schedule` | Therapists, rooms and bookings by day | Role home | D72-01 No-show |
| <a id="s72-07"></a>S72-07 | My therapist day | App | `/spa/my-therapist-day` | A therapist's appointments today with health notes | Role home | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d72-01"></a>D72-01 | No-show | Record a no-show and the fee rule | S72-06 Spa schedule |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
