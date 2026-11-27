// Which Google and Apple sign-in buttons this phone can run natively. The
// server may list both; the app only shows the ones it can finish itself.

import 'package:flutter/foundation.dart';

/// True when the app can run the native sign-in for [method] (`google` or `apple`) on this device.
/// Google runs on iPhone and Android. Apple runs natively on iPhone only (Android
/// needs a web flow that is not built yet, see docs/NEEDS-YOU.md). Never on the web.
bool isNativeSocialAvailable(String method) {
  // Step 1: the web build never runs native sign-in.
  if (kIsWeb) return false;
  // Step 2: each provider's platform rule.
  return switch (method) {
    'google' => defaultTargetPlatform == TargetPlatform.iOS || defaultTargetPlatform == TargetPlatform.android,
    'apple' => defaultTargetPlatform == TargetPlatform.iOS,
    _ => false,
  };
}
