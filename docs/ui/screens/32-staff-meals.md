# S32. Staff Meals

[All screens](README.md) · [Module spec](../../modules/32-staff-meals.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s32-01"></a>S32-01 | Meal today | App | `/staff-meals/meal-today` | My meal entitlement for today and where to claim it | Role home | S32-02 Claim meal |
| <a id="s32-02"></a>S32-02 | Claim meal | App, Kiosk | `/staff-meals/claim-meal` | Tap card at the canteen: allowed, already claimed or not entitled | S32-01 Meal today | D32-01 Already claimed |
| <a id="s32-03"></a>S32-03 | Canteen screen | Kiosk | `/staff-meals/canteen-screen` | Live claims count and the last person served | Role home | Back only |
| <a id="s32-04"></a>S32-04 | Meals today | App, Web | `/staff-meals/meals-today` | Claims by meal, department and time | Role home | D32-02 Guest meal, S32-05 Meal forecast, S32-06 Meal rules, S32-07 Meal reports |
| <a id="s32-05"></a>S32-05 | Meal forecast | App, Web | `/staff-meals/meal-forecast` | Expected meals for the kitchen | Role home, S32-04 Meals today | Back only |
| <a id="s32-06"></a>S32-06 | Meal rules | Web | `/staff-meals/meal-rules` | Who gets which meals, times and exceptions | S32-04 Meals today | Back only |
| <a id="s32-07"></a>S32-07 | Meal reports | Web | `/staff-meals/meal-reports` | Claims by person, department and period | S32-04 Meals today | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d32-01"></a>D32-01 | Already claimed | Show when and where the meal was claimed | S32-02 Claim meal |
| <a id="d32-02"></a>D32-02 | Guest meal | Record a meal for a visitor or casual worker | S32-04 Meals today |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
