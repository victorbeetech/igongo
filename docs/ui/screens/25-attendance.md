# S25. Attendance

[All screens](README.md) · [Module spec](../../modules/25-attendance.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s25-01"></a>S25-01 | Clock in | App, Kiosk | `/attendance/clock-in` | Tap card, scan QR or use the phone at a station, with photo and location | Role home | D25-02 Clock outside area, D25-04 Offline clock saved, S25-02 Clock-in result |
| <a id="s25-02"></a>S25-02 | Clock-in result | App, Kiosk | `/attendance/clock-in-result/:id` | Welcome, late or refused, with the reason | S25-01 Clock in | Back only |
| <a id="s25-03"></a>S25-03 | My attendance | App | `/attendance/my-attendance` | My days, hours, late arrivals and overtime | Role home | D25-01 Forgot to clock out, D25-03 Request correction |
| <a id="s25-04"></a>S25-04 | Attendance today | App, Web | `/attendance/attendance-today` | Who is in, late, absent and on leave, by department | Role home | S25-05 Attendance board, S25-06 On site now, S25-07 Attendance detail, S25-08 Corrections, S25-09 Overtime, S25-10 Attendance reports, S25-11 Attendance rules |
| <a id="s25-05"></a>S25-05 | Attendance board | Web | `/attendance/attendance-board` | Big screen view of today for the gate or HR office | S25-04 Attendance today | Back only |
| <a id="s25-06"></a>S25-06 | On site now | App, Web | `/attendance/on-site-now` | Everyone inside the hotel now: staff, visitors and contractors | Role home, S25-04 Attendance today | Back only |
| <a id="s25-07"></a>S25-07 | Attendance detail | App, Web | `/attendance/attendance-detail/:id` | One person's day with every tap and photo | S25-04 Attendance today | Back only |
| <a id="s25-08"></a>S25-08 | Corrections | App, Web | `/attendance/corrections` | Requests to fix a missed or wrong clock | Role home, S25-04 Attendance today | Back only |
| <a id="s25-09"></a>S25-09 | Overtime | App, Web | `/attendance/overtime` | Overtime claimed and approved | S25-04 Attendance today | Back only |
| <a id="s25-10"></a>S25-10 | Attendance reports | Web | `/attendance/attendance-reports` | Late, absent and hours by person, department and period | S25-04 Attendance today | Back only |
| <a id="s25-11"></a>S25-11 | Attendance rules | Web | `/attendance/attendance-rules` | Grace minutes, rounding, locations and photo rules | S25-04 Attendance today | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d25-01"></a>D25-01 | Forgot to clock out | Ask for the real time and a reason | S25-03 My attendance |
| <a id="d25-02"></a>D25-02 | Clock outside area | Explain the location rule and allow a request | S25-01 Clock in |
| <a id="d25-03"></a>D25-03 | Request correction | Pick the day, time and reason | S25-03 My attendance |
| <a id="d25-04"></a>D25-04 | Offline clock saved | Confirm the clock is saved and will sync | S25-01 Clock in |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
