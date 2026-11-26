# Wait list (saved for later, not built yet)

Items the user asked to keep, to build after the current work is confirmed working.

## 1. Two-step sign-in screen redesign ("Link sign-in methods")
- Match the design the user attached for the two-step set-up, on web and in the phone app.
- Remove the first screen that asks for an extra step before the two-step set-up, as the user marked.
- Keep the recovery codes screen. The codes are the user's to store; they never go into the repo, docs, memory, logs or posts.

## 2. Sign-in theme (web and phone)
- A sign-in set: Welcome Back, Forgot Password and Check Your Email, with the hotel photo, the Igongo logo, and the red and cream palette.
- Light and dark modes, built with the named theme tokens.
- Continue with Google and Apple buttons on the guest app sign-in only. The web stays email and password.
- Brief first, then build, once the sign-in is confirmed working.

## 3. Presets and role preview
- See [PLAN-presets-and-role-preview.md](PLAN-presets-and-role-preview.md).

## 4. Super admin on the app only; staff roles on web and app
- The super admin signs in on the phone app only. The web is for staff roles, which keep web and app access.
- Move the super admin's web sign-in, screens and routes out of the web portal when this is built.
- When removing anything (screen, route, role, test, doc), remove it completely: code, routes, tests, imports, docs and unused files. See [QUALITY-RULES.md](QUALITY-RULES.md), rule 11.

## 5. Visual guest home
- Each area on the guest home as a card with its own picture: rooms, food and shop, events, spa, pool, museum.
- Hotel photo and the red and cream theme, with pictures from the brand package only.
- The food shop card is in place already (it opens the food home); the picture cards follow.
