# 4. Users, Accounts & Login

**Group:** Core platform · **Module key:** `users-login` · [All modules](README.md)

## Summary

One account system for everyone: staff, riders, managers, board members and clients. Every account is created or approved through the super admin's rules, and everyone uses the same login screen.

## Features

### Accounts
- Staff accounts created from [HR Staff Records](22-hr-records.md) or by an admin.
- Client accounts created by self sign-up, by front desk, from a booking, or from WhatsApp, under rules the super admin sets.
- Approval queue for new accounts when self sign-up needs approval.
- Merge duplicate accounts, and link one person who is both staff and a client.

### Login methods
Every method below is built and ready. Each one has its own on and off switch, so the hotel can turn methods on as it agrees them, with no code change or app update.

| Method | Default at launch |
| --- | --- |
| Email and password, with email verification | On |
| Sign in with Google | On |
| Sign in with Apple (required by the App Store when Google is offered) | On |
| Phone number with a one-time code by SMS | Off until the hotel agrees the SMS provider and cost |
| Phone number with a one-time code by WhatsApp | Off until the hotel agrees the WhatsApp provider and cost |
| Email magic link or email one-time code | Off |
| PIN on a trusted phone or shared device | On |
| Fingerprint or face unlock on a trusted phone | On |
| Tap an NFC staff card on a shared device or kiosk | On |
| Scan a staff card QR code on a shared device or kiosk | On |

- One person can link several methods to the same account, such as email and Google, and still has one account and one history.
- When a method is switched off, its button disappears from the login screen at once. People who used only that method are asked to add another method the next time they sign in, so nobody is locked out.
- Provider keys (Google, Apple, SMS, WhatsApp) are entered in [Integrations & API](14-integrations.md), never in code.

### Security
- Two-factor authentication, required per role.
- List of active sessions and devices, with remote sign-out.
- Lock, unlock, suspend and expire accounts.
- Password and PIN rules, failed-login lockout and alerts on a new device.
- Forced logout of everyone in an emergency.

### Self-service
- Forgot password and forgot PIN.
- Update phone, email and photo, with re-verification.
- Download my data and request deletion (clients), as the Data Protection and Privacy Act requires.

## Super admin options
- Each login method on or off for the whole system, and then allowed or not for each role (for example, card tap only for kitchen staff, Google and Apple only for clients).
- Which method the login screen shows first.
- Whether a new Google or Apple sign-in creates a client account straight away or waits for approval.
- Whether clients can self-register, and whether they need approval.
- Session length per role, idle timeout and the number of devices allowed.
- OTP channel order (SMS first or WhatsApp first), code length, expiry, resend wait and a daily limit per phone number to control cost.
- Lockout thresholds and new-device alert rules.


## Depends on

- [Roles & Permissions](02-roles-permissions.md)
- [Audit Trail](05-audit-trail.md)
- [Notifications Engine](10-notifications.md)
- [Integrations Hub & Webhooks](14-integrations-hub.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `login_method.enabled`
- `login_method.disabled`
- `account.created`
- `account.approved`
- `account.locked`
- `account.unlocked`
- `login.succeeded`
- `login.failed`
- `session.revoked`

## If this module is switched off or fails

Cannot be switched off.
