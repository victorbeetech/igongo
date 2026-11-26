// Remembers that the first-run welcome was seen, so the app opens straight
// on sign-in or home afterwards. Kept with the session in secure storage
// (no extra package); a phone without it shows the welcome again, harmless.

import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Reads and saves "the welcome was seen".
abstract interface class FirstRunStore {
  /// True once the welcome was seen on this phone.
  Future<bool> welcomeSeen();

  /// Saves that the welcome was seen.
  Future<void> markWelcomeSeen();
}

/// The flag in the phone's secure storage.
class SecureFirstRunStore implements FirstRunStore {
  static const _key = 'igongo.welcome-seen';
  final _storage = const FlutterSecureStorage();

  @override
  Future<bool> welcomeSeen() async {
    // No secure storage (tests, some browsers): treat the welcome as seen, so nobody is stuck on it.
    try {
      return await _storage.read(key: _key) == 'yes';
    } on Exception {
      return true;
    } on Error {
      return true;
    }
  }

  @override
  Future<void> markWelcomeSeen() async {
    try {
      await _storage.write(key: _key, value: 'yes');
    } on Exception {
      // Not saved: the welcome shows once more next time. Nothing else depends on it.
      return;
    }
  }
}
