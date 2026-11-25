# Needs you

Things only you can do, because they need your accounts, your Mac or a real phone. Everything else is built. Each item says what is needed, why, and the exact steps. Claude adds to this list whenever it hits a blocker, and moves on.

Never paste a password, private key or secret into the chat. Where a secret is needed, the steps put it straight where it belongs.

[Back to README](../README.md)

---

## Sign-in: what is live and what waits (25 Nov 2026)

**Live now** at https://igongo-api.victorbee.com: email and password, Google, PIN, sessions, roles, audit trail and the console. Nothing to do for these.

### First super admin (2 minutes, once)

0. If you have not yet: in Google Cloud console > APIs & Services > Credentials, open the web OAuth client and add the authorised redirect URI `https://igongo-api.victorbee.com/api/auth/callback/google` (and the JavaScript origin `https://igongo.victorbee.com`). Without it Google shows "redirect_uri_mismatch".
1. Open https://igongo.victorbee.com/#/sign-in.
2. In the **First set-up** box, click **Sign in with Google to start** and choose your own Google account (the one this project uses).
3. Back on the sign-in page, click **Finish set-up**. You are now the super admin. Only your Google email can do this, and only once.

### Apple sign-in (when you have the values)

Built and switched off. Open the console's keys (`PUT /api/admin/keys/...`, the keys screen comes with the Integrations thread) and save four keys: `apple.team_id`, `apple.key_id`, `apple.client_id` (the Services ID `com.victorbee.igongo.web`) and `apple.private_key` (the whole .p8 text). Then switch **Sign in with Apple** on in Users & Login > Login methods. In Apple's developer site, the Services ID's return URL must be `https://igongo-api.victorbee.com/api/auth/callback/apple`. Never paste the .p8 key in a chat other than the project chat.

### Phone codes, email links and email codes

Built and switched off until the hotel agrees the providers (Africa's Talking, Meta WhatsApp, Resend). Then their keys go into the console and the switches go on. Password-reset emails also wait for the email provider.

---

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
