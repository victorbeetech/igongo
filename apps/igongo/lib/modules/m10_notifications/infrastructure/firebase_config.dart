// The Firebase settings for this build, read from build-time values.
//
// Why build-time values and not google-services.json / GoogleService-Info.plist:
// the app must build and run before the Firebase apps exist, and the hotel's
// Firebase project replaces ours later. The values are not secret (they ship
// inside every app), so they live in `config/firebase-app.json` and are passed with
//   flutter run --dart-define-from-file=config/firebase-app.json
// When they are missing, push is simply off and the rest of the app works.
// See config/firebase-app.example.json and docs/NEEDS-YOU.md.

import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';

/// Builds the Firebase options for the running platform.
abstract final class FirebaseConfig {
  // Shared by both platforms.
  static const _projectId = String.fromEnvironment('FIREBASE_PROJECT_ID');
  static const _senderId = String.fromEnvironment('FIREBASE_SENDER_ID');

  // Android app, from the Firebase console's Android app settings.
  static const _androidAppId = String.fromEnvironment('FIREBASE_ANDROID_APP_ID');
  static const _androidApiKey = String.fromEnvironment('FIREBASE_ANDROID_API_KEY');

  // iOS app, from the Firebase console's iOS app settings.
  static const _iosAppId = String.fromEnvironment('FIREBASE_IOS_APP_ID');
  static const _iosApiKey = String.fromEnvironment('FIREBASE_IOS_API_KEY');
  static const _iosBundleId = String.fromEnvironment('FIREBASE_IOS_BUNDLE_ID');

  /// The options for this phone, or null when this build has none (push off).
  static FirebaseOptions? current() {
    if (_projectId.isEmpty || _senderId.isEmpty || kIsWeb) return null;
    return switch (defaultTargetPlatform) {
      TargetPlatform.android => _options(_androidAppId, _androidApiKey),
      TargetPlatform.iOS => _options(_iosAppId, _iosApiKey, iosBundleId: _iosBundleId),
      _ => null,
    };
  }

  /// The options for one platform, or null if that platform's values are missing.
  static FirebaseOptions? _options(String appId, String apiKey, {String? iosBundleId}) {
    if (appId.isEmpty || apiKey.isEmpty) return null;
    return FirebaseOptions(
      apiKey: apiKey,
      appId: appId,
      messagingSenderId: _senderId,
      projectId: _projectId,
      iosBundleId: iosBundleId,
    );
  }
}
