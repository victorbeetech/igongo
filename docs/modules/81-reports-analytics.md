# 81. Reports & Analytics

**Group:** Money and insight · **Module key:** `reports-analytics` · [All modules](README.md)

## Summary

Dashboards and reports for every module and every level, from a supervisor's shift to the board's quarter.

## Features
- Ready-made dashboards: GM daily, board monthly, each department, attendance, payroll, food sales, bookings, guest satisfaction.
- Custom report builder: pick a module, fields, filters, groups and chart type.
- Compare periods, outlets and departments.
- Drill down from a total to the records behind it.
- Scheduled reports by email or WhatsApp, such as the GM's 7 AM summary.
- Export to PDF and Excel.
- Targets and alerts, such as "food sales below target by 2 PM".
- Reports respect each person's permissions and data scope.

## Super admin options
- Which dashboards each role sees.
- Who can build and share reports.
- Schedules and recipients.


## Depends on

- [Roles & Permissions](02-roles-permissions.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `report.scheduled_sent`
- `kpi.alert`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
