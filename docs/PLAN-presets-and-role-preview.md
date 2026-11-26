# Plan: presets and role preview (saved for later, 26 Nov 2026)

Not built yet. The super admin asked for these to be planned now and built after sign-in is working.

## 1. Presets (in the Cards section)
- A preset is a saved look for the whole app: colours, logo, text size and the home tiles for a role.
- The super admin picks a preset in the Cards section; it applies to every screen and to the phone app.
- Presets are stored in the database, and each change is recorded in the audit log.

## 2. Role preview (for the super admin)
- From the Preview entry at the foot of the sidebar, the super admin can switch to see how each role looks, on the web and in the phone app.
- The preview works for each organisation, not only the hotel.
- Example: setting up the chefs' panel, the super admin previews it as a chef, on the web and on the phone.
- The preview only shows; it does not sign anyone in or change any data.

## 3. Two-step sign-in must be set up first
- The super admin must set up an authenticator app (two-step sign-in) before the admin screens open.
- Until it is set up, those screens show "Your role can't open this". This is the agreed gate, not a bug.

## Where it fits
- Built after: sign-in works on the live build, and the Waiter and guest checks pass.
- Settings holds the theme and the company assets (logos and similar), each in its own place. The design-system screen was removed.
