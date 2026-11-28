// Keeps the guest's recent searches on the phone between visits, in secure
// storage (the same place as the sign-in, no extra package). A phone without
// secure storage simply starts with no recent searches; nothing else depends on it.

import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Reads and saves the recent search words, newest first.
abstract interface class RecentSearchStore {
  /// The saved words, newest first (empty when none or when storage is unavailable).
  Future<List<String>> load();

  /// Saves the words, newest first. A failure is ignored: the list is only a convenience.
  Future<void> save(List<String> searches);
}

/// The recent searches in the phone's secure storage, as one JSON list.
class SecureRecentSearchStore implements RecentSearchStore {
  /// The storage key for the list.
  static const _key = 'igongo.recent-searches';

  /// The phone's secure storage.
  final _storage = const FlutterSecureStorage();

  @override
  Future<List<String>> load() async {
    // Step 1: read the saved JSON; any unreadable value counts as no searches.
    try {
      final raw = await _storage.read(key: _key);
      if (raw == null) return const [];
      final decoded = jsonDecode(raw);
      return decoded is List ? [for (final item in decoded) if (item is String) item] : const [];
    } on Object {
      return const [];
    }
  }

  @override
  Future<void> save(List<String> searches) async {
    // Step 2: write the list as JSON; if it fails, the next visit simply starts without it.
    try {
      await _storage.write(key: _key, value: jsonEncode(searches));
    } on Object {
      return;
    }
  }
}
