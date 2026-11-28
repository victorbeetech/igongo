// Unit tests for the recent searches: newest first, no repeats, at most eight,
// removed and cleared, and saved after each change. Uses an in-memory store.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/search/application/recent_searches_provider.dart';
import 'package:igongo/shared/search/data/recent_search_store.dart';

/// Keeps the list in memory and counts the saves.
class _MemoryStore implements RecentSearchStore {
  _MemoryStore([this.saved = const []]);
  List<String> saved;
  int saves = 0;

  @override
  Future<List<String>> load() async => saved;

  @override
  Future<void> save(List<String> searches) async {
    saves++;
    saved = searches;
  }
}

void main() {
  /// A container whose store is [store]; the list is loaded before the test changes it.
  Future<ProviderContainer> container(_MemoryStore store) async {
    final c = ProviderContainer(overrides: [recentSearchStoreProvider.overrideWithValue(store)]);
    addTearDown(c.dispose);
    await c.read(recentSearchesProvider.future);
    return c;
  }

  test('the newest search comes first and an old copy moves up instead of repeating', () async {
    final store = _MemoryStore();
    final c = await container(store);
    final n = c.read(recentSearchesProvider.notifier);
    await n.remember('tilapia');
    await n.remember('cottage');
    await n.remember('tilapia');
    expect(c.read(recentSearchesProvider).value, ['tilapia', 'cottage']);
    expect(store.saved, ['tilapia', 'cottage']);
  });

  test('at most eight are kept', () async {
    final c = await container(_MemoryStore());
    final n = c.read(recentSearchesProvider.notifier);
    for (var i = 0; i < 10; i++) {
      await n.remember('search $i');
    }
    expect(c.read(recentSearchesProvider).value, hasLength(maxRecentSearches));
    expect(c.read(recentSearchesProvider).value!.first, 'search 9');
  });

  test('one can be removed and all can be cleared, each saved', () async {
    final store = _MemoryStore(['a', 'b']);
    final c = await container(store);
    final n = c.read(recentSearchesProvider.notifier);
    await n.remove('a');
    expect(store.saved, ['b']);
    await n.clear();
    expect(c.read(recentSearchesProvider).value, isEmpty);
    expect(store.saved, isEmpty);
  });
}
