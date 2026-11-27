// Live global search data (Riverpod). Each search is keyed by the text the
// guest typed, so a repeat of the same words comes from the cache.

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/session/session_controller.dart';
import '../data/global_search_api.dart';
import '../domain/menu_search_results.dart';

/// The search calls on the app's client.
final globalSearchApiProvider = Provider((ref) => GlobalSearchApi(ref.watch(apiClientProvider)));

/// The dishes and outlets matching one search text.
final globalSearchProvider = FutureProvider.autoDispose.family<MenuSearchResults, String>(
  (ref, text) => ref.watch(globalSearchApiProvider).search(text),
);
