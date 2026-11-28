// The guest's recent searches (Riverpod). Loads the saved list once, then every
// add, remove or clear is saved straight away. The newest search comes first,
// there are no repeats, and the list keeps at most [maxRecentSearches] words.

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../data/recent_search_store.dart';

/// How many recent searches are kept.
const int maxRecentSearches = 8;

/// Where the recent searches are saved. Tests override it with an in-memory store.
final recentSearchStoreProvider = Provider<RecentSearchStore>((ref) => SecureRecentSearchStore());

/// The recent searches, newest first.
final recentSearchesProvider = AsyncNotifierProvider<RecentSearchesController, List<String>>(RecentSearchesController.new);

/// Loads, changes and saves the recent searches.
class RecentSearchesController extends AsyncNotifier<List<String>> {
  @override
  Future<List<String>> build() => ref.read(recentSearchStoreProvider).load();

  /// Puts [query] first (removing an older copy of it) and saves the list.
  Future<void> remember(String query) => _change(() => [query, ...current.where((s) => s != query)]);

  /// Removes one search and saves the list.
  Future<void> remove(String query) => _change(() => current.where((s) => s != query).toList());

  /// Clears every search and saves the empty list.
  Future<void> clear() => _change(() => const <String>[]);

  /// The list as it is now (empty while it loads).
  List<String> get current => state.valueOrNull ?? const <String>[];

  /// Applies [next] to the list, caps it, shows it at once and saves it.
  Future<void> _change(List<String> Function() next) async {
    final list = next().take(maxRecentSearches).toList();
    state = AsyncData(list);
    await ref.read(recentSearchStoreProvider).save(list);
  }
}
