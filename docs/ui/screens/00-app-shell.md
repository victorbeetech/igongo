# S00. App shell and shared screens

[All screens](README.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s00-01"></a>S00-01 | Launch splash | App, Kiosk | `/launch-splash` | Animated logo while the app starts and checks the session | Not connected yet | S00-02 First-run welcome, S00-05 Sign in, S00-15 Biometric unlock, S00-41 Force update, S00-42 Maintenance notice |
| <a id="s00-02"></a>S00-02 | First-run welcome | App | `/first-run-welcome` | Three short slides about Igongo, with Sign in and Explore as a guest | S00-01 Launch splash | S00-03 Language picker, S00-04 Explore as guest home |
| <a id="s00-03"></a>S00-03 | Language picker | App, Web, Kiosk | `/language-picker` | Choose the app language on first run | S00-02 First-run welcome, S00-32 Settings | S00-05 Sign in |
| <a id="s00-04"></a>S00-04 | Explore as guest home | App, Public | `/explore-as-guest-home` | Public home: rooms, dining, museum, events, pool, spa, shop | S00-02 First-run welcome | S00-05 Sign in, [S62-01 Food home](62-food-ordering.md#s62-01), [S67-01 Rooms](67-room-bookings.md#s67-01), [S68-01 Museum home](68-museum.md#s68-01), [S69-01 Events home](69-events-conferences.md#s69-01), [S71-01 Pool home](71-pool.md#s71-01), [S72-01 Spa home](72-spa.md#s72-01), [S73-01 Shop](73-crafts-bookshop.md#s73-01) |
| <a id="s00-05"></a>S00-05 | Sign in | App, Web, Kiosk | `/sign-in` | One entry point for everyone, showing only the methods switched on: email, Google, Apple, phone, card tap or QR | D00-01 Sign out confirmation, D00-03 Session expired, S00-01 Launch splash, S00-03 Language picker, S00-04 Explore as guest home | S00-06 Sign in with Google, S00-07 Sign in with Apple, S00-10 Phone number entry, S00-12 Password entry, S00-14 Tap card to sign in, S00-18 Create client account, S00-20 Account locked |
| <a id="s00-06"></a>S00-06 | Sign in with Google | App, Web | `/sign-in-with-google` | Google account picker and consent, then back to the app | S00-05 Sign in | Role home, S00-19 Account pending approval |
| <a id="s00-07"></a>S00-07 | Sign in with Apple | App, Web | `/sign-in-with-apple` | Apple sign-in sheet, with hide-my-email support | S00-05 Sign in | Role home |
| <a id="s00-08"></a>S00-08 | Verify email | App, Web | `/verify-email` | Enter the code or open the link sent to the email address | S00-17 Forgot password, S00-18 Create client account | S00-12 Password entry, S00-19 Account pending approval |
| <a id="s00-09"></a>S00-09 | Link sign-in methods | App, Web | `/link-sign-in-methods` | Add or remove email, Google, Apple or phone on my account | S00-31 My profile | Back only |
| <a id="s00-10"></a>S00-10 | Phone number entry | App, Web | `/phone-number-entry` | Enter phone number for a one-time code | S00-05 Sign in | S00-11 OTP code entry |
| <a id="s00-11"></a>S00-11 | OTP code entry | App, Web | `/otp-code-entry` | Enter the code sent by SMS or WhatsApp, with resend timer | S00-10 Phone number entry | Role home |
| <a id="s00-12"></a>S00-12 | Password entry | App, Web | `/password-entry` | Password sign-in, with show password and forgot link | S00-05 Sign in, S00-08 Verify email | S00-16 Two-factor check, S00-17 Forgot password |
| <a id="s00-13"></a>S00-13 | PIN entry | App, Kiosk | `/pin-entry` | Quick PIN sign-in on a trusted phone or shared device | S00-14 Tap card to sign in | Role home |
| <a id="s00-14"></a>S00-14 | Tap card to sign in | Kiosk | `/tap-card-to-sign-in` | Tap a staff card on a shared device to sign in | S00-05 Sign in | S00-13 PIN entry |
| <a id="s00-15"></a>S00-15 | Biometric unlock | App | `/biometric-unlock` | Fingerprint or face unlock prompt | S00-01 Launch splash | D00-03 Session expired, Role home |
| <a id="s00-16"></a>S00-16 | Two-factor check | App, Web | `/two-factor-check` | Second step for roles that require 2FA | S00-12 Password entry | Role home |
| <a id="s00-17"></a>S00-17 | Forgot password | App, Web | `/forgot-password` | Reset a password by phone or email | S00-12 Password entry | S00-08 Verify email |
| <a id="s00-18"></a>S00-18 | Create client account | App, Public | `/create-client-account` | Guest sign-up with name, phone and consent | S00-05 Sign in | S00-08 Verify email |
| <a id="s00-19"></a>S00-19 | Account pending approval | App, Web | `/account-pending-approval` | Shown when a new account waits for approval | S00-06 Sign in with Google, S00-08 Verify email | Back only |
| <a id="s00-20"></a>S00-20 | Account locked | App, Web, Kiosk | `/account-locked` | Shown when an account is locked, with who to contact | S00-05 Sign in | Back only |
| <a id="s00-21"></a>S00-21 | Role home | App, Web | `/role-home` | Home screen built from the person's roles: tiles, counters and shortcuts | Role home | S00-22 Role switcher |
| <a id="s00-22"></a>S00-22 | Role switcher | App, Web | `/role-switcher` | For people with several roles: pick which view to show | S00-21 Role home | Role home |
| <a id="s00-23"></a>S00-23 | Client view home | App | `/client-view-home` | The app exactly as a guest sees it, with a banner to switch back | D00-02 Switch to client view, Role home | Role home, [S59-04 Buy gift card](59-promotions-vouchers.md#s59-04), [S60-01 Request help](60-guest-requests.md#s60-01), [S62-01 Food home](62-food-ordering.md#s62-01), [S64-04 Book a table](64-tables-dinein.md#s64-04), [S65-04 Buy buffet ticket](65-buffet.md#s65-04), [S67-01 Rooms](67-room-bookings.md#s67-01), [S68-01 Museum home](68-museum.md#s68-01), [S69-01 Events home](69-events-conferences.md#s69-01), [S71-01 Pool home](71-pool.md#s71-01), [S72-01 Spa home](72-spa.md#s72-01), [S73-01 Shop](73-crafts-bookshop.md#s73-01) |
| <a id="s00-24"></a>S00-24 | Panic button | App | `/panic-button` | Hold-to-send emergency button available to every staff role | Role home | D00-07 Panic button confirmation |
| <a id="s00-25"></a>S00-25 | Global search | App, Web | `/global-search` | One search box over every module the person can see | Role home | S00-26 Search results |
| <a id="s00-26"></a>S00-26 | Search results | App, Web | `/search-results` | Results grouped by module, with filters | S00-25 Global search, [S06-03 Saved searches](06-records-search.md#s06-03) | S00-27 Everything about |
| <a id="s00-27"></a>S00-27 | Everything about | App, Web | `/everything-about` | All records linked to one person, room, asset or event | S00-26 Search results | [S05-03 Record timeline](05-audit-trail.md#s05-03) |
| <a id="s00-28"></a>S00-28 | Notification inbox | App, Web | `/notification-inbox` | All in-app notifications, read and unread | Role home | S00-29 Notification detail |
| <a id="s00-29"></a>S00-29 | Notification detail | App, Web | `/notification-detail/:id` | One notification with a link to its record | S00-28 Notification inbox | S00-44 Not found |
| <a id="s00-30"></a>S00-30 | Approvals inbox | App, Web | `/approvals-inbox` | Everything waiting for this person's approval, across modules | Role home | [D09-03 Bulk approve](09-workflow-approvals.md#d09-03), [S09-04 Request detail](09-workflow-approvals.md#s09-04) |
| <a id="s00-31"></a>S00-31 | My profile | App, Web | `/my-profile/:id` | Photo, contact details, roles and staff card | Role home | S00-09 Link sign-in methods, S00-36 Active sessions, [S04-10 My data](04-users-login.md#s04-10) |
| <a id="s00-32"></a>S00-32 | Settings | App, Web | `/settings` | Language, text size, theme, notifications and privacy | Role home | D00-01 Sign out confirmation, D00-04 Unsaved changes, S00-03 Language picker, S00-33 Text size setting, S00-34 Theme setting, S00-35 Notification preferences, S00-37 Help and support |
| <a id="s00-33"></a>S00-33 | Text size setting | App, Web | `/text-size-setting` | Compact to Extra large, with a live preview | S00-32 Settings | Back only |
| <a id="s00-34"></a>S00-34 | Theme setting | App, Web | `/theme-setting` | Light, dark or follow the phone | S00-32 Settings | Back only |
| <a id="s00-35"></a>S00-35 | Notification preferences | App, Web | `/notification-preferences` | Which messages to receive and how, within allowed limits | S00-32 Settings | Back only |
| <a id="s00-36"></a>S00-36 | Active sessions | App, Web | `/active-sessions` | Devices signed in, with sign out | S00-31 My profile | D00-01 Sign out confirmation |
| <a id="s00-37"></a>S00-37 | Help and support | App, Web | `/help-and-support` | Help articles and a way to report a problem | S00-32 Settings, S00-45 Something went wrong | S00-38 About |
| <a id="s00-38"></a>S00-38 | About | App, Web | `/about` | App version, terms, privacy policy and licences | S00-37 Help and support | Back only |
| <a id="s00-39"></a>S00-39 | Offline banner | App, Web, Kiosk | `/offline-banner` | Shown on any screen when the network is lost, with sync status | Role home | S00-40 Sync status |
| <a id="s00-40"></a>S00-40 | Sync status | App, Kiosk | `/sync-status` | Items waiting to sync and their status | S00-39 Offline banner | Back only |
| <a id="s00-41"></a>S00-41 | Force update | App, Web, Kiosk | `/force-update` | Shown when a newer app version is required | S00-01 Launch splash | Back only |
| <a id="s00-42"></a>S00-42 | Maintenance notice | App, Web, Kiosk | `/maintenance-notice` | Shown when a module is in maintenance | S00-01 Launch splash | Back only |
| <a id="s00-43"></a>S00-43 | Permission denied | App, Web | `/permission-denied` | Shown when a person opens something their role does not allow | Role home | Back only |
| <a id="s00-44"></a>S00-44 | Not found | App, Web, Public | `/not-found` | A record or page that does not exist | S00-29 Notification detail | Back only |
| <a id="s00-45"></a>S00-45 | Something went wrong | App, Web, Kiosk, Public | `/something-went-wrong` | General error with retry and report | Role home | S00-37 Help and support |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d00-01"></a>D00-01 | Sign out confirmation | Confirm signing out | S00-32 Settings, S00-36 Active sessions |
| <a id="d00-02"></a>D00-02 | Switch to client view | Explain the client view before switching | Role home |
| <a id="d00-03"></a>D00-03 | Session expired | Sign in again to continue | S00-15 Biometric unlock |
| <a id="d00-04"></a>D00-04 | Unsaved changes | Leave or stay when changes are not saved | S00-32 Settings |
| <a id="d00-05"></a>D00-05 | Rate the app | Ask happy users for a store rating | Role home |
| <a id="d00-06"></a>D00-06 | Camera, location, NFC and notification permission | Explain why the app needs each phone permission before asking | Role home |
| <a id="d00-07"></a>D00-07 | Panic button confirmation | Hold to send an emergency alert | S00-24 Panic button |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
