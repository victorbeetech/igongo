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

## 8. Store listing images (Play Store and App Store; owner, 26 Nov)
- Plan only, not built. The owner's reference is a store page where the screenshots connect across the frames: one phone per frame, one continuous colour band running through all frames, and a headline in each frame.
- Needed later: real guest-app screenshots (after the photos and real data are in), a headline per frame, and the Igongo red and cream band.

## 9. Guest home banner, photos and food-shop extras (owner, 26 Nov)
- Banner: the guest home banner takes its picture from one place (`GuestPhotos.banner` in `apps/igongo/lib/shared/ui/photo/guest_photos.dart`). The super admin will change it from the app later (upload not built; on the wait list).
- Photos needed as real files: the hotel banner (the thatched hut with hills), the food photo for the Food shop card, and photos for each outlet and each dish. Until they arrive, plain placeholders show.
- Food shop: "Deals & Discounts" rows and a filter button need a public promotions list from the API (not available yet). The shop rows show real outlets and their order types; delivery time and fee per shop are not in the API yet.
- The same shop-row, chip-row and product-grid widgets (`shared/ui/guest/`) are to be applied on the other guest screens (rooms, spa, events, shop) one at a time as their live data exists.
- Demo food menu (`m62_food_ordering/demo/`): switch off with `demoMenuOn = false` and delete the folder before go-live.

## 10. Ticket and booking screens (owner, 26 Nov; plan only, do after the guest screens are checked on the simulator)
Reference images from the owner (ticket-ref-1 to 3). Three parts:
1. **Book a table:** a date strip, time-of-day slots (with offer badges where an offer applies), the booking option, and a Proceed button.
2. **Ticket card:** an upcoming booking or trip with a barcode and a Download PDF button.
3. **Seat or ticket picker:** a grid of seats or ticket types, with the price and a total.
- Build with our theme tokens and font sizes, light and dark, on real API data only (table, event and museum bookings use the shared bookings engine).

## 11. Order-type details: API follow-ups (owner, 26 Nov)
- **Dine-in time:** the app now asks for it and sends it to the kitchen in the order notes ("Dine-in at 7:30 PM"). The API refuses scheduled dine-in orders (`SCHEDULABLE_TYPES` in `modules/food-ordering/src/domain/ordering-rules.ts`); add `dine_in` there so the time becomes a real arrival time, then send it as `arriveAt`.
- **Takeaway container:** the app offers it when the menu has an available item whose name contains "container" (priced by the server like any dish, hidden from the dish grid). A proper "container" flag on menu items (module 61) is better than the name match.
- **Delivery location:** zone and place are asked and must be confirmed before ordering; the last location is filled in next time. A map pin (lat/lng) waits for the Google Maps key.

## 12. Photo slots for the owner's own photos (owner, 26 Nov: no stock photos)
Slots without a photo show a plain placeholder icon. To swap one: put the file in `apps/igongo/assets/photos/`, set the path in `apps/igongo/lib/shared/ui/photo/guest_photos.dart` (an https address also works). Shoot landscape JPGs, 1200 px wide or more, under about 300 KB, with the subject in the middle (the app crops).
| Slot | Shows on | Photo needed | Status |
|---|---|---|---|
| `banner` | Guest home header, first slide | Wide photo of the hut (shoot 16:9, hut centred) | Done: `igongo-hut.jpg` (owner's photo, 650 px wide; a larger original would be sharper) |
| `food` | Today's menu card, guest home | One appetising dish (3:2) | Done: `food-dish.jpg` (placeholder dish from the owner) |
| `roomStandard`, `roomDeluxe`, `roomExecutive` | Room booking screens | One photo per room type (3:2) | Standard and deluxe saved; executive still needed (the image sent was a meeting room, not a bedroom); screens not wired yet |
| Outlet photos | Shop rows on the Food screen | One per outlet, e.g. restaurant, bar, pool bar (square, 600 px) | Restaurant saved (shows on the demo outlet only); the others needed; no photo field on outlets yet |
| Dish photos | Dish grid, carousel, item page | One per dish (3:2, dish centred) | Needed; the menu has no photo field yet (module 61 and the menu API need one first) |

## 13. Super admin uploads the in-app logo and banner (later)
- The super admin uploads a new in-app logo or banner from the web, and the app shows it without a new release.
- Not built yet: wait until the web admin upload and the app's image reading are in place.
- The launcher icon cannot change this way. It is built into the app, so a new icon needs a new build and a store update.

## 8. Service charge (super admin switch and rate)
- The Cart summary shows a service charge line. It is a PLACEHOLDER today: `apps/igongo/lib/modules/m62_food_ordering/domain/service_charge_placeholder.dart` (5 per cent, UGX 0). No charge is calculated yet.
- Later: the super admin switches the service charge on or off and sets the rate, from the super admin settings.
- When it is on, the server prices the charge in the quote (`priceCart`) and the Cart shows the server's amount. The app never works out the charge itself.
- Then remove the placeholder file and its uses, and check the total adds up on the server and in the app.
