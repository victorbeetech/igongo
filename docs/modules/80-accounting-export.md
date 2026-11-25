# 80. Accounting Export

**Group:** Money and insight · **Module key:** `accounting-export` · [All modules](README.md)

## Summary

Sends sales, payroll, expenses and payments to the hotel's accounting system in the format it needs.

## Features
- Map outlets, items, taxes and expenses to account codes.
- Daily or monthly journals for sales, payments, payroll and petty cash.
- Export to spreadsheet or the accounting system's import format.
- Push to APEX where APEX handles accounts.
- Export log and re-export after corrections.

## Super admin options
- Account code mapping.
- Export schedule and format.


## Depends on

- Only the core platform services that every module uses (login, permissions and the audit trail).

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `accounting.exported`
- `accounting.export_failed`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
