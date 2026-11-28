# Needs you

Things only you can do, because they need your accounts, your Mac or a real phone. Everything else is built. Each item says what is needed, why, and the exact steps. Claude adds to this list whenever it hits a blocker, and moves on.

Never paste a password, private key or secret into the chat. Where a secret is needed, the steps put it straight where it belongs.

[Back to README](../README.md)

---

## iPhone app on TestFlight (your Mac, 20 minutes the first time)

**Status:** the app is ready for iPhone and Android (app ID `ug.co.igongo.igongo`, team UNNDMY45JR, NFC, push and Sign in with Apple switched on in the project). GitHub builds an Android test APK and compiles the iPhone app on every change, so nothing needs your Mac except **signing and uploading**.

**Why Claude could not do it:** signing uses your Apple account in Xcode on your Mac.

**Steps:** follow [MAC-STEPS.md](MAC-STEPS.md): `flutter pub get`, `flutter build ipa`, then Distribute App > Upload in Xcode's Organizer.

---

## Sign-in: what is live and what waits (25 Nov 2026)

**Live now** at https://igongo-api.victorbee.com: email and password, Google, PIN, sessions, roles, audit trail and the console. Nothing to do for these.

### First super admin (2 minutes, once)

0. If you have not yet: in Google Cloud console > APIs & Services > Credentials, open the web OAuth client and add the authorised redirect URI `https://igongo-api.victorbee.com/api/auth/callback/google` (and the JavaScript origin `https://igongo.victorbee.com`). Without it Google shows "redirect_uri_mismatch".
1. Open https://igongo.victorbee.com/#/sign-in.
2. In the **First set-up** box, click **Sign in with Google to start** and choose your own Google account (the one this project uses).
3. Back on the sign-in page, click **Finish set-up**. You are now the super admin. Only your Google email can do this, and only once.
4. (Since 26 Nov, once the new API is deployed) the portal then asks you to add a password and turn on 2-step sign-in with an authenticator app, and shows recovery codes to keep safe. Add a second super admin later so you can never be locked out.

### Google and Apple sign-in inside the phone app (27 Nov 2026)

Built in the app and the API (the buttons call the phone's own sign-in, then the API checks the token). Google works on iPhone and Android. Sign in with Apple works on iPhone only. Nothing is tested on a real phone yet. Three things only you can do:

1. **Google, Android client (5 minutes):** Google Cloud console > APIs & Services > Credentials > the Android OAuth client `707707727967-ur411vo11lv1ce9undl07q8al2rhttl1`. Check the package name is `ug.co.igongo.igongo`, and add the SHA-1 fingerprint of the signing key (the debug key for test builds, and the Play upload key before the Play release). Without it Google shows an error on Android.
2. **Apple, iPhone app ID (2 minutes):** developer.apple.com > Identifiers > `ug.co.igongo.igongo` > tick **Sign in with Apple**, then Save. Xcode's automatic signing usually does this on archive. The API already accepts this bundle ID.
3. **Real-phone test (10 minutes):** on an iPhone and an Android phone, open the app, tap **Continue with Google** (and on iPhone **Sign in with Apple**), pick an account. Expect the home screen. Use a guest account. The super admin account must be refused with a message, and that is the expected result.

**Not built yet, your decision:** Sign in with Apple on Android. It needs a web flow with the Services ID `com.victorbee.igongo.web` and its return URL, which is a separate piece of work. Until then Android shows only Google.

After merge, the API deploy must run for the new settings (`GOOGLE_APP_CLIENT_IDS` and `APPLE_APP_BUNDLE_ID` are Worker variables in `apps/api/wrangler.jsonc`). Check Cloudflare Workers > igongo-api > Settings > Variables that the Apple sign-in key secret (`APPLE_PRIVATE_KEY`) is still there; it was stored earlier.

### Apple sign-in (when you have the values)

Built and switched off. Open the console's keys (`PUT /api/admin/keys/...`, the keys screen comes with the Integrations thread) and save four keys: `apple.team_id`, `apple.key_id`, `apple.client_id` (the Services ID `com.victorbee.igongo.web`) and `apple.private_key` (the whole .p8 text). Then switch **Sign in with Apple** on in Users & Login > Login methods. In Apple's developer site, the Services ID's return URL must be `https://igongo-api.victorbee.com/api/auth/callback/apple`. Never paste the .p8 key in a chat other than the project chat.

### Phone codes, email links and email codes

Built and switched off until the hotel agrees the providers (Africa's Talking, Meta WhatsApp, Resend). Then their keys go into the console and the switches go on. Password-reset emails also wait for the email provider.

---

## Final build phase: what only you can do (26 Nov 2026)

1. **Set up the hotel's records, stock and card designs as the super admin.** Everything is configured on screen, with no code. Record types and statuses for the 40 desk modules, stock categories, units and stores, spa, venue and table offerings, the role menus (App builder), and card templates per role.
2. **Scheduled reports.** They run at 7 AM Kampala time and are kept in Reports > Saved reports. Sending them by email or WhatsApp waits on those keys, the same ones listed below.
3. **Card printer.** The card designer prints at the exact card size from the browser. Choose the card printer and turn off margins and scaling in the print dialog once, then save that as a preset.

## Managers and money: three things only you can do (26 Nov 2026)

1. **Switch on file storage (2 minutes).** Photos on fault reports, checkups and chat need Cloudflare R2. In the Cloudflare dashboard open R2 Object Storage and click Enable (the free tier covers 10 GB). Then tell Claude, and it creates the bucket `igongo-files` and connects it to the API as `FILES`. Until then, uploads say "File storage is not set up yet" and everything else works.
2. **Deduction rates from the hotel's accountant.** No tax or NSSF rates are built in. The super admin enters PAYE bands, NSSF and any other deductions on Payroll > Statutory settings, exactly as the accountant gives them, before the first pay run.
3. **Mobile money refunds.** Card refunds go back through Flutterwave by themselves. MTN MoMo and Airtel Money refunds are recorded and paid back by hand until the hotel's own provider accounts are set up.
4. **Ask the accountant about URA EFRIS.** Must the hotel issue EFRIS e-receipts for bookings and food? The answer decides whether the EFRIS link is switched on. A hook for it is kept either way.

## Payments, food delivery and bookings: keys and first set-up (26 Nov 2026)

Everything is built; only keys and the hotel's own settings are missing. Nothing below is needed for the preview, and cash payments already work.

1. **Mobile money and card keys** (when the hotel signs up). In the web portal open Integrations > Connection settings and paste: `mtn_momo.api_user`, `mtn_momo.api_key`, `mtn_momo.subscription_key`; `airtel_money.client_id`, `airtel_money.client_secret`; `flutterwave.secret_key`, `flutterwave.secret_hash`. Then switch each method on in Payments > Payment methods. Start in **sandbox**; switch to **live** only after a real test payment.
2. **Flutterwave webhook.** In the Flutterwave dashboard set the webhook URL to `https://igongo-api.victorbee.com/api/payments/callbacks/card` and the secret hash to the same value as `flutterwave.secret_hash`.
3. **Google Maps key** (`google_maps.api_key`), for rider navigation and, later, zone maps.
4. **Hotel set-up** (super admin, no code): outlets and menus (Menus), order types and payment timing (Food ordering > Settings), delivery zones and fees (Delivery > Zones), and rooms, museum tickets, events, pool passes and shop items (each module's Settings and Offerings).

## Staff cards: test NFC on a real phone (25 Nov 2026)

**Status:** clock-in, station mode, meals and wristband scans are built and tested with a mock card reader. The cloud has no NFC, so a real tap has never been tried.

1. **Android:** install a debug build on an NFC phone, sign in as a gatekeeper, open Attendance > Clock in > Station mode, and tap a staff card. The name and "Clocked in" should show.
2. **iPhone (needs your Mac):** in [developer.apple.com](https://developer.apple.com/account) > Identifiers > `ug.co.igongo.igongo`, tick **NFC Tag Reading**, then rebuild in Xcode. The app already asks for it (`Runner.entitlements`, `Info.plist`).
3. **Gate and reception PCs:** plug in a USB NFC reader that types the card number like a keyboard (for example ACR122U with keyboard-wedge software). The web station pages read it. Tell Claude which reader you buy.

### Your computer's Claude Code could not connect

Your screenshot shows Claude Code on your computer failing with "Connection refused" and saying connectors are off because `ANTHROPIC_API_KEY` is set. Remove that variable (or sign in with `/login` instead of the key), restart Claude Code, then retry. iOS builds still need your Mac.

---

## Push notifications (Firebase Cloud Messaging)

**Status:** all the code is built and tested with fakes (see `modules/notifications/` and `apps/igongo/lib/modules/m10_notifications/`). Pushes start working as soon as the steps below are done. The free Spark plan is enough; FCM costs nothing.

**Why Claude could not do it:** the Firebase connector works only on your computer. The cloud has no sign-in to your Google account, and Claude must not ask you for a sign-in code in the chat.

> **Fastest way:** open Claude on your own computer, where the Firebase connector is signed in, and say *"Register the Igongo Android and iOS apps in Firebase project igongo-342ba with the IDs in docs/NEEDS-YOU.md, and fill apps/igongo/config/firebase-app.json"*. That does steps 1 and 2 for you. Steps 3 to 5 still need you, because they create keys.

### 0. Confirm the app ID (1 minute)

The app ID is **`ug.co.igongo.igongo`** on both Android and iOS. Once the app is on Google Play this can never change. If you want another one (for example `ug.co.igongo.app`), tell Claude now, before step 1.

### 1. Register the two apps in Firebase (5 minutes)

1. Open [console.firebase.google.com](https://console.firebase.google.com) and pick **igongo-342ba**.
2. On **Project Overview**, click **+ Add app**, then the **Android** icon.
   - Android package name: `ug.co.igongo.igongo`
   - App nickname: `Igongo Android`
   - Click **Register app**. Download **google-services.json** when offered, then click **Next** until **Continue to console**.
3. Click **+ Add app** again, then **Apple** (iOS).
   - Apple bundle ID: `ug.co.igongo.igongo`
   - App nickname: `Igongo iOS`
   - Click **Register app**. Download **GoogleService-Info.plist**, then **Next** until **Continue to console**.

### 2. Give Claude the two config files (1 minute)

These two files are **not secret** (they ship inside every copy of the app), so it is safe to upload them in the project chat. Upload `google-services.json` and `GoogleService-Info.plist` and say "Firebase app files". Claude copies the values into `apps/igongo/config/firebase-app.json`; the app reads them at build time, so no other change is needed.

### 3. Apple push key (APNs), for iPhones (5 minutes)

iPhones only get pushes through Apple, so Firebase needs Apple's key.

1. Open [developer.apple.com/account](https://developer.apple.com/account) > **Certificates, IDs & Profiles** > **Keys** > **+**.
2. Key name: `Igongo APNs`. Tick **Apple Push Notifications service (APNs)**. Click **Continue**, then **Register**.
3. Click **Download** (the `.p8` file downloads **only once**; keep it safe, never in the chat). Note the **Key ID** on that page, and your **Team ID** (top right, or **Membership details**).
4. Back in Firebase: the **gear** next to Project Overview > **Project settings** > **Cloud Messaging** tab > **Apple app configuration** > `Igongo iOS` > **APNs Authentication Key** > **Upload**. Choose the `.p8` file, enter the Key ID and Team ID, click **Upload**.
5. In the same **Cloud Messaging** tab, check that **Firebase Cloud Messaging API (V1)** says **Enabled**. If not, click the three dots next to it > **Manage API in Google Cloud Console** > **Enable**.

### 4. Server key for sending, as a Cloudflare secret (5 minutes)

The API needs a Google service-account key to send pushes. It goes straight into Cloudflare as a secret, never into the code or the chat.

1. **Make a key that can only send pushes** (safer than the all-powerful Admin SDK key):
   1. Open [console.cloud.google.com/iam-admin/serviceaccounts](https://console.cloud.google.com/iam-admin/serviceaccounts) and pick project **igongo-342ba**.
   2. **+ Create service account**. Name: `igongo-push`. Click **Create and continue**.
   3. Role: type **Firebase Cloud Messaging API Admin** and pick it. Click **Continue**, then **Done**.
   4. Click the new `igongo-push` account > **Keys** tab > **Add key** > **Create new key** > **JSON** > **Create**. A `.json` file downloads.
2. **Store it in Cloudflare.** The API Worker (`igongo-api`) is created in the back-end phase. When it exists:
   1. Open [dash.cloudflare.com](https://dash.cloudflare.com) > **Workers & Pages** > **igongo-api** > **Settings** > **Variables and Secrets** > **+ Add**.
   2. Type: **Secret**. Variable name: `FCM_SERVICE_ACCOUNT`. Value: open the `.json` file in a text editor, copy **all** of it, paste. Click **Deploy**.
   3. Delete the downloaded `.json` file from your computer afterwards.

   If you do this before `igongo-api` exists, keep the file somewhere safe until then. Later the super admin can paste the same file in **Integrations > Connection settings > Firebase** instead.

### 5. Build and test on real phones (when the back end is connected)

The cloud cannot download the Android SDK or run Xcode, so the native builds were not compiled here (the Dart code was analysed and tested).

1. On your Mac, in `apps/igongo`: `flutter pub get`, then `flutter build apk --debug --dart-define-from-file=config/firebase-app.json`. Tell Claude about any error.
2. For iPhone: `cd ios && pod install`, open `ios/Runner.xcworkspace` in Xcode > **Runner** target > **Signing & Capabilities**. Check that **Push Notifications** and **Background Modes > Remote notifications** are listed (the files for them are already in the repo). Pick your team, then run on a real iPhone (pushes do not reach the simulator).
3. Sign in on the phone, allow notifications, then use **Integrations > Firebase > Send test** as the super admin (or `POST /notifications/push/test`). A notification should arrive within seconds.

## Food and delivery tracker: before go-live (26 Nov 2026)

1. **Google Maps key** (`google_maps.api_key`, see above). Until it is in, the guest's tracker shows the rider's last position as numbers and a "Preview" note instead of a live map.
2. **Turn preview mode off before the App Store build.** Payment methods page (S77-06), switch "Preview mode" off. Apple rejects greyed-out buttons that do nothing; preview mode is for showing the screens before the gateway keys arrive.
3. **Promotions and vouchers.** A voucher only works at checkout once someone with the approve permission (Sales & Marketing Manager by default) moves it to **Issued**. Promo codes need status **Live**, a Discount (%), and "Where it works" empty, "all", "food" or an outlet key.


## Database backups (26 Nov 2026)

1. **Delete the restore test branch when you are happy.** The restore was tested into a separate branch, `restore-test-2026-11-26`, in Neon. It is not used by anything. Tell Claude "delete the restore test branch", or delete it in the Neon console under Branches.
2. **Daily backups need a paid Neon plan.** The free plan does not allow scheduled snapshots. If you upgrade, tell Claude and it will turn on a daily snapshot (kept 14 days) and a weekly one (kept 8 weeks). Until then a snapshot is taken by hand before every deploy. See [Backups](BACKUPS.md).

## API and web deploy not done (26 Nov 2026)

The API builds (`pnpm --filter @igongo/api build`) and the web builds (`build:cloudflare`), but the cloud session could not finish the upload. The Cloudflare asset upload needs a BLAKE3 hash of each file, and the cloud session has no BLAKE3 tool installed. Installing one was refused by the session's permission check, so it was not forced.

To finish, either:
1. Run `pnpm --filter @igongo/api run deploy` and `pnpm --filter @igongo/web deploy:cloudflare` on your computer after `npx wrangler login` (simplest). The API needs `run`: pnpm's own `deploy` command clashes with the script name and fails with ERR_PNPM_INVALID_DEPLOY_TARGET. Or
2. Tell Claude to retry from the cloud once a BLAKE3 package can be installed in the session.

Take a snapshot in Neon before the API deploy, because the new migrations run on the first scheduled tick.

## Cart and checkout: ready to check (27 Nov 2026)

**Status:** the guest cart is wired end to end. Add, change quantity, remove, the day of each item, the totals and Place order all go through the server, which prices every cart and checks the order. Payment is the one step left, because it needs the hotel's payment keys (see "Payments, food delivery and bookings" above). Until the keys are in, the pay sheet says the method is not set up yet; the order is still placed and shows in My orders.

**What to check in the app:** add items from the food shop, change the quantity, pick a day for each item, remove one, watch the total change, then Proceed to Checkout, choose how you want it, and Place order.

## Receipt emails: add the Resend key (booking receipts)

**What is needed:** a Resend API key, and a verified sender address on your domain (for example `Igongo <receipts@yourdomain>`).

**Why:** booking receipts are emailed to the guest after payment. Until the key is set, nothing is sent and the app works as before.

**Exact steps:**
1. In Resend, create an API key and verify the sending domain.
2. Either set the Worker secret: `wrangler secret put RESEND_API_KEY` (in the API Worker), and `RECEIPT_FROM` as a variable with the sender address,
3. or, as super admin, open Settings and set `resend.api_key` and `resend.sender` (these override the Worker secret).

No key is written in the repository. The code is `modules/payments/src/infrastructure/email/resend-receipt-mailer.ts`.

## Ticket signing key (booking tickets and scanning)

**What is needed:** a long random secret that only the server knows. Any long random text works, for example 40 or more letters and digits.

**Why:** the QR code on each booking ticket carries a signature made with this key. Staff scanning a ticket only accept codes whose signature matches, so a copied or edited ticket shows as Forged. Without the key, ticket checks answer "not configured" (HTTP 503) and the QR falls back to the plain booking code.

**Exact steps:** set the Worker secret `TICKET_SIGNING_KEY` in the API Worker: `wrangler secret put TICKET_SIGNING_KEY`. Then redeploy the API. Do not share the key and do not store it in the repository. Changing it makes all tickets already issued show as Forged, so set it once.

**Rotate the key before real bookings.** The owner will set `TICKET_SIGNING_KEY` himself. A value for this key was posted in chat during the build, so treat that value as exposed: generate a new key, set it with `wrangler secret put TICKET_SIGNING_KEY`, and redeploy the API before any real bookings are taken. Tickets issued before the rotation will show as Forged afterwards, so rotate before the first real booking.

---

## Delivery map: free for now, no key needed

**Status:** the guest app draws the delivery map with MapLibre on OpenStreetMap tiles. It needs no Google key and no card. The guest taps the map to set the spot, and the point is saved with the order and remembered for the guest.

**What you need to do:** nothing now. The map is free while the hotel's card is not ready.

**Later, when the hotel's card is ready:** open `apps/igongo/lib/modules/m62_food_ordering/presentation/map/map_setup.dart` and change `kMapTileUrl` (and `kMapAttribution`) to the paid map's tile address. The whole app follows that one change. Check the paid map's terms for the attribution text.

**Note:** the OpenStreetMap tile server is free but asks for light use. Heavy use from the live app should move to a tile provider, so plan that change before the hotel opens.

---

## Decision: iOS minimum is now 15.5 (27 Nov 2026)

**Status:** the iPhone app now needs iOS 15.5 or later. The map library (MapLibre) requires it, and the app used to support iOS 15.0.

**What this costs:** iPhones on iOS 15.0 to 15.4 can no longer install the app. Most phones are on newer versions, so this is a small cost.

**Your choice, later:** keep 15.5 (the default), or ask Claude to find another map package that supports iOS 15.0. To change it back, set `IPHONEOS_DEPLOYMENT_TARGET` in `apps/igongo/ios/Runner.xcodeproj/project.pbxproj` once the map package allows it.

---

## Google and Apple logos for the sign-in buttons (27 Nov 2026)

**Status:** done. The logos are the vector marks from the approved design, in `apps/igongo/assets/images/google_logo.svg` and `apple_logo.svg`.

**Optional, later:** if the hotel or the owner has the official brand files, replace those two SVG files with the official ones. The buttons follow the file names, so nothing else changes.

## Contact Us: confirm the hotel's numbers and address (27 Nov 2026)

**Status:** the Contact Us screen (S00-46) is built, and the "Contact Us" links on the sign-in and create account screens open it. It is in the PR, waiting for your visual approval.

**What is needed:** please confirm these are the final details. They are placeholders taken from the design, and the app shows them as they are:
- Front desk number: +256 393 262 050 (Call Now button, and the top-bar call icon uses +256 392 722 963 from the design)
- Reservations email: reservations@igongo.co.ug
- WhatsApp number shown on the card: +256 772 123 456. The chat button itself opens the number the super admin sets in the hotel settings, not this one.
- Address: Mbarara - Masaka Highway, Biharwe, Mbarara, Uganda

**Exact steps:** send the final numbers and address. Claude then changes them in one file, `apps/igongo/lib/shared/contact/contact_details.dart`. For the WhatsApp number, the super admin sets it in the web settings (Hotel profile, "Whatsapp").

## Security review (28 Nov 2026)

Full results: [SECURITY-CHECKLIST.md](SECURITY-CHECKLIST.md).

### A. Replace the demo keys before go-live (about 20 minutes)

Why: the keys pasted in the project chat are demo keys, so they must be replaced before real guests and staff use the system.

Two kinds of key, two places:

1. **Keys the super admin enters in the app (most of them).** Sign in at https://igongo.victorbee.com with the super admin's email and password. Open **Integrations** > **API keys**. Each key has a name, and the page shows only the last four characters once saved. The real key names are:
   - Google sign-in: `google.client_id`, `google.client_secret`
   - Apple sign-in: `apple.team_id`, `apple.key_id`, `apple.client_id`, `apple.private_key`, `apple.app_bundle_id`
   - Email (Resend): `resend.api_key`, `resend.sender`
   - Google Maps: `google_maps.api_key`
   - Payments and messaging (when added): `africas_talking.api_key`, `africas_talking.username`, `whatsapp.access_token`, `whatsapp.phone_number_id`, `mtn_momo.api_user`, `mtn_momo.api_key`, `mtn_momo.subscription_key`, `airtel_money.client_id`, `airtel_money.client_secret`, `flutterwave.secret_key`, `flutterwave.public_key`, `flutterwave.secret_hash`
   
   For each one: create a fresh key at that provider's dashboard, paste it into the matching field, and save. The change is recorded in the Audit Trail.

2. **Worker secrets in Cloudflare (set once, in the Cloudflare dashboard).** Open https://dash.cloudflare.com > **Workers & Pages** > **igongo-api** > **Settings** > **Variables and Secrets** > **+ Add**. Choose type **Secret**, enter the name exactly as listed, paste the new value, and save. The names are `BETTER_AUTH_SECRET`, `SETTINGS_ENCRYPTION_KEY`, `GOOGLE_CLIENT_SECRET`, `APPLE_PRIVATE_KEY`, `APNS_PRIVATE_KEY`, `SENTRY_DSN`, and `BOOTSTRAP_ADMIN_EMAIL` (an email, not a secret). Do not change `SETTINGS_ENCRYPTION_KEY` after keys are saved in the console: they would no longer decrypt. Ask Claude first if you need to rotate it.

3. **Revoke the demo keys** at each provider once the new ones work. Sign-in with Google and the test push are the quickest checks.

Why this matters: demo keys may have been seen outside the project.

### B. Add the Cloudflare rate-limit rule on sign-in (about 5 minutes)

Why: the app already limits sign-in attempts in its own database. This second layer stops floods at Cloudflare before they reach the Worker.

1. Open https://dash.cloudflare.com and choose the **victorbee.com** zone (the domain that serves `igongo-api.victorbee.com`).
2. In the left menu, click **Security** > **Security rules**.
3. Click **Create rule** > **Rate limiting rules**.
4. **Rule name:** `Igongo sign-in limit`.
5. **When incoming requests match:** click **Edit expression** and paste exactly:
   `(http.host eq "igongo-api.victorbee.com" and starts_with(http.request.uri.path, "/api/auth/"))`
   If the expression editor is not available on your plan, choose **Field** `URI Path`, **Operator** `starts with`, **Value** `/api/auth/`, and add the host check as a second condition.
6. **With the same characteristics:** tick **IP**.
7. **When rate exceeds:** **Requests** `30`, **Period** `1 minute`. (The free plan allows only 10-second periods; if so, use 5 requests per 10 seconds.)
8. **Then take action:** choose **Block**, and set the duration to `1 minute`.
9. Click **Deploy**.
10. Test: open the sign-in page and try a wrong password more than 30 times in a minute. The last attempts should show a Cloudflare block page instead of the app's error. Then check **Security** > **Security events** (or **Analytics**) for the matching block.

Note for Claude: the menu names come from Cloudflare's current documentation and can change; if a name differs, the same setting is in the rule builder under **Rate limiting rules**.
- **Confirm the database role.** In Neon, make sure the API connects with a role that has only the permissions the app needs, and that no public connection string is shared with any client. Why: the database must never be reachable from a browser or the app.
