# 55. Corporate Accounts

**Group:** Guests and sales · **Module key:** `corporate-accounts` · [All modules](README.md)

## Summary

Companies, NGOs, government offices and schools that book often or on credit.

## Features
- Company profile with contacts, TIN and agreed terms.
- Approved bookers who can book on the company's behalf in the app.
- Credit limit and balance, with statements.
- Negotiated rates and packages.
- Booking and spend history.
- Contract and LPO documents.

## Super admin options
- Who can approve credit and set limits.
- Whether corporate bookers can book without staff confirmation.


## Depends on

- [CRM: Guest & Client Profiles](54-crm-guests.md)
- [Workflow & Approvals](09-workflow-approvals.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `corporate.created`
- `corporate.credit_exceeded`
- `corporate.statement_sent`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
