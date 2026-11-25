# 38. Daily Reports

**Group:** Operations · **Module key:** `daily-reports` · [All modules](README.md)

## Summary

Each department and staff member files a daily report from a template, and the supervisor signs it off. Reports build a searchable history of how the hotel runs day by day.

## Features
- Report templates per department and role, built in [Forms & Templates Builder](08-forms-builder.md).
- Personal daily report (what I did today) and department daily report (HOD summary).
- Numbers that fill themselves where possible, such as covers served from food ordering or rooms cleaned from housekeeping.
- Photos, voice notes and attachments.
- Submit by a deadline, with reminders and late flags.
- Supervisor sign-off, return for changes, or comments.
- GM daily digest: all department reports in one summary.
- Trends over time and missing report alerts.

## Super admin options
- Which roles and departments file which reports, and how often.
- Deadlines and reminder times.
- Who signs off each report.
- Whether staff can see each other's reports.


## Depends on

- [Forms & Templates Builder](08-forms-builder.md)
- [Locations & Departments](15-locations-departments.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `dailyreport.submitted`
- `dailyreport.signed_off`
- `dailyreport.returned`
- `dailyreport.missing`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
