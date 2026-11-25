# 58. Marketing Campaigns

**Group:** Guests and sales · **Module key:** `campaigns` · [All modules](README.md)

## Summary

Sends targeted offers and news to guests by SMS, WhatsApp, email and push, to people who agreed to receive them.

## Features
- Campaign builder with audience segment, message, channel and schedule.
- Personalised messages with names and offers.
- Automatic journeys, such as "welcome", "we miss you" or "birthday offer".
- Opt-out link in every message.
- Results: sent, delivered, opened, clicked, booked and revenue.

## Super admin options
- Who can create and send campaigns.
- Whether campaigns need approval.
- Monthly sending limits.


## Depends on

- [CRM: Guest & Client Profiles](54-crm-guests.md)
- [Notifications Engine](10-notifications.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `campaign.sent`
- `campaign.completed`
- `guest.opted_out`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
