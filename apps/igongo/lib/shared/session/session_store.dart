// Where the session token is kept between app starts. The phone version
// uses the secure keychain or keystore; tests use [MemorySessionStore].

import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Saves, reads and forgets the session token.
abstract interface class SessionStore {
  /// The saved token, or null.
  Future<String?> read();

  /// Saves [token].
  Future<void> write(String token);

  /// Forgets the token (sign out).
  Future<void> clear();
}

/// The token in the phone's secure storage (Keychain on iPhone, Keystore on Android).
class SecureSessionStore implements SessionStore {
  static const _key = 'igongo.session';
  final _storage = const FlutterSecureStorage();

  @override
  Future<String?> read() async {
    // Some platforms (tests, unsupported web browsers) have no secure storage: treat as signed out.
    try {
      return await _storage.read(key: _key);
    } on Exception {
      return null;
    } on Error {
      return null;
    }
  }

  @override
  Future<void> write(String token) => _storage.write(key: _key, value: token);

  @override
  Future<void> clear() => _storage.delete(key: _key);
}

/// A store that keeps the token in memory only (tests, previews).
class MemorySessionStore implements SessionStore {
  String? _token;

  @override
  Future<String?> read() async => _token;

  @override
  Future<void> write(String token) async => _token = token;

  @override
  Future<void> clear() async => _token = null;
}
