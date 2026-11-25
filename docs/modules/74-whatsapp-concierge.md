# 74. WhatsApp Concierge

**Group:** Guests and sales · **Module key:** `whatsapp-concierge` · [All modules](README.md)

## Summary

Guests talk to the hotel on WhatsApp to book, order, ask questions and get help, with a smooth hand-off to a staff member.

## Features
- Menu-driven chat: book a room, order food, book a table, museum tickets, pool passes and events.
- Answers to common questions from the knowledge base.
- Hand-off to a staff agent with the full chat history.
- Shared inbox for front desk agents, with assignment.
- Payment links sent in the chat.
- Booking and order confirmations and reminders.
- Opening hours auto-reply.

## Super admin options
- Chat menu and answers.
- Agent working hours and routing.
- Message templates.


## Depends on

- [Integrations Hub & Webhooks](14-integrations-hub.md)
- [CRM: Guest & Client Profiles](54-crm-guests.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `whatsapp.chat_started`
- `whatsapp.handoff`
- `whatsapp.chat_closed`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
