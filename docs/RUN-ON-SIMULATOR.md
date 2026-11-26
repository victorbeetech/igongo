# Run the Igongo app on the iPhone simulator (your Mac)

See the real app, as it is today, in the **iPhone 16 Pro Max** simulator on your Mac, talking to the live API. About 15 minutes the first time, 2 minutes after that. No Apple account or signing is needed for the simulator.

[Back to Mac steps](MAC-STEPS.md) · [Needs you](NEEDS-YOU.md)

---

## Once: get ready

1. **Xcode** (from the App Store), opened once with the licence accepted. Then in Terminal:
   ```bash
   sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
   xcodebuild -runFirstLaunch
   ```
2. In Xcode > **Settings** > **Components** (or **Platforms**), make sure an **iOS simulator runtime** is installed (iOS 18 or newer for the iPhone 16 Pro Max).
3. **Flutter 3.50.1**, the same version the cloud builds use: [docs.flutter.dev/get-started/install/macos](https://docs.flutter.dev/get-started/install/macos). Check with:
   ```bash
   flutter --version      # should say 3.50.1 (Dart 3.14 or newer)
   flutter doctor         # Xcode and the iOS toolchain should be ticked
   ```
   If you have another Flutter version, `flutter downgrade` / `flutter upgrade` won't pick an exact version; instead run `cd "$(dirname $(which flutter))/.." && git fetch --tags && git checkout 3.50.1 && flutter --version`.

## Quick start: one block to paste

The app is in `apps/igongo` inside the repository, and its `ios` and `android` folders are already in git (nothing to generate). If you cloned to `~/igongo`, paste this in Terminal:

```bash
cd ~/igongo && git fetch origin && git checkout main && git pull origin main \
  && cd apps/igongo && flutter pub get \
  && open -a Simulator && flutter run -d "iPhone 16 Pro Max"
```

If it says "Expected to find project root", you are not in `apps/igongo`, or your copy is old: the `git pull` above fixes an old copy. If `~/igongo` is not a copy of this repository at all, clone it fresh with `git clone https://github.com/victorbeetech/igongo.git ~/igongo-app` and use `~/igongo-app` in the block instead.

## Each time: get the latest work and run it

The app lives in `apps/igongo` inside the repository. If you already have a copy of the repository (for example in `~/Developer` or on your Desktop), use that one and skip the clone.

```bash
git clone https://github.com/victorbeetech/igongo.git     # first time only
cd igongo
git checkout main && git pull                            # the latest merged work
cd apps/igongo
flutter pub get
open -a Simulator                                        # if the simulator is not already open
flutter devices                                          # the iPhone 16 Pro Max should be listed
flutter run -d "iPhone 16 Pro Max"
```

The first build takes a few minutes. While it runs, in the Terminal: **r** reloads your changes, **R** restarts the app, **q** quits.

To see work that is **not merged yet** (a pull request still open), switch to its branch first, for example `git fetch origin && git checkout claude/project-thread-4tu9sw && git pull`, then run the same commands from `cd apps/igongo`. Go back with `git checkout main`.

### Which server it talks to

By default the app uses the live API, `https://igongo-api.victorbee.com`, so you see real data and can sign in with real accounts. To point it somewhere else (only if someone runs the API on your Mac):

```bash
flutter run -d "iPhone 16 Pro Max" --dart-define=IGONGO_API_URL=http://localhost:8787
```

## Signing in

- **Email and password** works in the simulator: use an account that already exists (a staff account the super admin made, or a guest account).
- **Staff screens** show only for accounts with staff roles. A guest account sees the guest side. There is no switch between the two: one account is one kind.
- Screens shown before you sign in are the preview layouts with clearly labelled sample content; signed in, they read the real API.

## What works and what doesn't in the simulator

| Works | Doesn't, or needs a real iPhone |
| --- | --- |
| Every screen, light and dark mode, text sizes (Settings > Accessibility in the simulator) | **NFC card taps**: the simulator has no NFC. Run with `--dart-define=IGONGO_NFC=mock` to use the pretend card reader instead. The real-phone test is in [NEEDS-YOU](NEEDS-YOU.md). |
| Email and password sign-in, live data from the API | **Push notifications**: only with the Firebase settings file (see [MAC-STEPS](MAC-STEPS.md)); the simulator receives pushes only in limited cases, so test pushes on a real iPhone. |
| Ordering, bookings, the delivery tracker, payment screens in preview mode | **Google and Apple sign-in** buttons are not in the app yet (they come with the access and security phase). Apple sign-in, when added, needs a simulator signed in to an Apple ID (Settings > Sign in), or a real iPhone. |
| Camera-free flows | **Camera and QR scanning**: the simulator has no camera. Photo pickers use the simulator's Photos library (drag a picture onto the simulator window to add one). |
| | **Face ID / fingerprint**: in the simulator use Features > Face ID > Enrolled, then Matching Face. |

## Known problems and fixes

- **"No devices found" / the iPhone is not listed:** open the Simulator app first (`open -a Simulator`), pick File > Open Simulator > iPhone 16 Pro Max, then `flutter devices` again.
- **"Xcode build failed" the first time:** run `flutter clean && flutter pub get` and try again. If it mentions a missing iOS platform, install the simulator runtime (step 2 above).
- **"CocoaPods not installed" or Swift Package errors:** run `flutter doctor` and follow what it says (`brew install cocoapods` if it asks for it).
- **Stuck on the splash screen or "cannot reach the server":** check the Mac has internet, and that `https://igongo-api.victorbee.com/health` opens in Safari.
- **"Exited with status code 255" after a few seconds, or "Binary Flutter.framework/Flutter does not exist, cannot thin":** the Flutter engine files on the Mac are stale. Clear them and download them again (this fixed it on the Mac mini, 26 Nov):
  ```bash
  cd ~/igongo/apps/igongo
  rm -rf ~/flutter/bin/cache/artifacts/engine/ios* ~/flutter/bin/cache/engine.stamp ios/Pods ios/Podfile.lock build ~/Library/Developer/Xcode/DerivedData/Runner-*
  flutter precache --ios --force
  flutter clean && flutter pub get && flutter run -d "iPhone 16 Pro Max"
  ```
  (If Flutter is not installed in `~/flutter`, use the folder `which flutter` shows, without `/bin/flutter`.)
- **Old screens after a pull:** press **R** in the Terminal, or stop with **q** and run `flutter run` again.

To put the app on a real iPhone or on TestFlight, see [MAC-STEPS](MAC-STEPS.md).
