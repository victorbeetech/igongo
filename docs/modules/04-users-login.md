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
- Phone number with SMS or WhatsApp OTP.
- Email and password.
- PIN and fingerprint or face unlock on a trusted phone.
- Tap an NFC staff card or scan a QR code on a shared device or kiosk.
- Google and Apple sign-in for clients.

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
- Which login methods are allowed for each role.
- Whether clients can self-register, and whether they need approval.
- Session length per role, idle timeout and the number of devices allowed.
- OTP channel order (SMS first or WhatsApp first).
- Lockout thresholds and new-device alert rules.


## Depends on

- [Roles & Permissions](02-roles-permissions.md)
- [Audit Trail](05-audit-trail.md)
- [Notifications Engine](10-notifications.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `account.created`
- `account.approved`
- `account.locked`
- `account.unlocked`
- `login.succeeded`
- `login.failed`
- `session.revoked`

## If this module is switched off or fails

Cannot be switched off.
