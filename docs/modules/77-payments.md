# 77. Payments

**Group:** Money and insight · **Module key:** `payments` · [All modules](README.md)

## Summary

Takes and records every payment, by MTN MoMo, Airtel Money, card, bank and cash, for any module.

## Features
- Mobile money prompts to the payer's phone, and payment links.
- Card payments through Flutterwave.
- Cash and bank transfer recorded by staff.
- Deposits, part payments and balances.
- Split payment across methods or people.
- Refunds, full or partial, with approval.
- Payment callbacks checked with signatures before anything is marked paid.
- Charge to room (sent to APEX) or to a corporate account.
- Failed and pending payment follow-up.
- Daily settlement report per provider.

## Super admin options
- Every payment method is built and ready: MTN MoMo, Airtel Money, card through Flutterwave, bank transfer, cash, charge to room and corporate account. Each one has its own on and off switch for the whole system, then per outlet and module, so the hotel turns methods on as it agrees them with each provider.
- Provider keys and settings are entered in [Integrations & API](14-integrations.md), never in code.
- Refund approval tiers.
- Whether staff can mark a payment as received manually.


## Depends on

- [Integrations Hub & Webhooks](14-integrations-hub.md)
- [Workflow & Approvals](09-workflow-approvals.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `payment.initiated`
- `payment.succeeded`
- `payment.failed`
- `payment.refunded`
- `settlement.received`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
