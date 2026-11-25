# Putting the iPhone app on TestFlight (your Mac)

Every pull request already proves the app builds: GitHub Actions runs the checks, builds an Android APK (download it from the run's page, under **Artifacts**) and compiles the iPhone app on a Mac runner. Only **signing and uploading** need your own Mac, because they use your Apple account. About 20 minutes the first time, 5 after that.

[Back to README](../README.md) · [Needs you](NEEDS-YOU.md)

---

## Once: get ready (10 minutes)

1. Install **Xcode** from the App Store, open it once and accept the licence.
2. Install **Flutter 3.50.1** (the version CI uses): [docs.flutter.dev/get-started/install/macos](https://docs.flutter.dev/get-started/install/macos). Check with `flutter doctor`.
3. In Xcode > **Settings** > **Accounts**, click **+** and sign in with the Apple ID of team **UNNDMY45JR**.
4. In [App Store Connect](https://appstoreconnect.apple.com) > **Apps** > **+** > **New App**: platform iOS, name `Igongo`, bundle ID `ug.co.igongo.igongo` (if it is not in the list, Xcode creates it at the first Archive; come back after step 5 below), SKU `igongo`.

## Each build (5 minutes)

In Terminal:

```bash
git clone https://github.com/victorbeetech/igongo.git   # first time only
cd igongo && git pull
cd apps/igongo
flutter pub get
```

Firebase (only once Firebase is set up, see NEEDS-YOU "Push notifications"): the app does **not** use `google-services.json` or `GoogleService-Info.plist`. It reads one file, `apps/igongo/config/firebase-app.json` (copy `config/firebase-app.example.json`, fill the values; it is git-ignored). Then build with it:

```bash
flutter build ipa --dart-define-from-file=config/firebase-app.json   # with push
flutter build ipa                                                    # without push (still works)
```

`flutter build ipa` signs and archives in one go. If it says "No signing certificate" or similar, do the Xcode way once:

1. `open ios/Runner.xcworkspace`
2. Left panel: click **Runner** (blue icon), then the **Runner** target, then **Signing & Capabilities**.
3. Tick **Automatically manage signing**. **Team**: your team (UNNDMY45JR). Bundle identifier must read `ug.co.igongo.igongo`. Push Notifications, NFC Tag Reading and Sign in with Apple are already listed; Xcode turns them on for the App ID.
4. Top bar: pick **Any iOS Device (arm64)**.
5. Menu **Product** > **Archive**. Wait for the Organizer window.

## Upload to TestFlight (2 minutes)

- After `flutter build ipa`: open `build/ios/archive/Runner.xcarchive` (double-click), which opens the Organizer.
- In the Organizer: select the new archive > **Distribute App** > **App Store Connect** > **Upload** > keep the defaults > **Upload**.
- 10 to 30 minutes later the build appears in App Store Connect > **Igongo** > **TestFlight**. Add testers there (Internal testing: up to 100 people on your team, no review).

Each upload needs a higher build number: raise the `+N` in `version: 0.1.0+1` in `apps/igongo/pubspec.yaml` (for example `+2`), or ask Claude to.

## Android on Google Play (optional, later)

The debug APK from GitHub installs on any Android phone for testing. For the Play Store you need an upload key, made once on your Mac and **never** put in git or the chat:

```bash
cd apps/igongo/android
keytool -genkey -v -keystore ~/igongo-upload.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

Then create `apps/igongo/android/key.properties` (git-ignored):

```properties
storeFile=/Users/<you>/igongo-upload.jks
storePassword=<the password you chose>
keyAlias=upload
keyPassword=<the password you chose>
```

and run `flutter build appbundle` in `apps/igongo`. Upload `build/app/outputs/bundle/release/app-release.aab` in the Play Console. Keep a backup of the `.jks` file and its password: losing it means you cannot update the app.
