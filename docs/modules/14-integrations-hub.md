# 14. Integrations Hub & Webhooks

**Group:** Core platform · **Module key:** `integrations-hub` · [All modules](README.md)

## Summary

One place to connect outside services, such as SMS, WhatsApp, payments, maps and APEX, so no module holds its own keys.

## Features
- Connection settings for Africa's Talking, Meta WhatsApp, FCM, MTN MoMo, Airtel Money, Flutterwave, Google Maps and email.
- Keys are stored as encrypted secrets and are never shown again after saving.
- Health check and test button for every connection.
- Outgoing webhooks: send any system event to an outside address.
- API keys for future partners, with limits and expiry.
- Usage and error log per connection.

## Super admin options
- Turn each integration on or off.
- Switch providers (for example a second SMS provider) without code.
- Who receives alerts when a connection fails.


## Depends on

- [Audit Trail](05-audit-trail.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `integration.connected`
- `integration.failed`
- `integration.restored`
- `webhook.failed`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
