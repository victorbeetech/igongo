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

## 6. Guest app design sheets (from the user, 26 Nov)
Design sheets: guest home, food shop (with search and an add-to-cart bar), cart and checkout (delivery, dine-in, takeaway, pre-order), order tracking with rider, room booking, my bookings (upcoming and past), me (account, points, receipts, sign out), dark variants, and a hotel brand screen.
- Build in one screen at a time, with our theme tokens and our font sizes (not the sheets' sizes), in light and dark.
- Real API data only. Screens without a live API (room booking, tracking, my bookings) wait until the API exists.
- Extras not yet built: a payment screen (Mobile Money, card, pay on arrival, secure checkout) and an optional hotel brand splash screen.

## 7. Order customisation and notes (client side)
- Before a client places an order, they can customise each item: options such as extra or less on each dish.
- A free-text note per item, for example "no tomatoes".
- The customisation and notes are saved on the order, and show in the cart, the checkout and the kitchen view.
- Not built yet: saved with the order and shown to the kitchen once the order flow is live.

## 8. Super admin uploads the in-app logo and banner (later)
- The super admin uploads a new in-app logo or banner from the web, and the app shows it without a new release.
- Not built yet: wait until the web admin upload and the app's image reading are in place.
- The launcher icon cannot change this way. It is built into the app, so a new icon needs a new build and a store update.
