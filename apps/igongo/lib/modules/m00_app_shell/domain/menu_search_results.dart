// The full answer to one global search (S00-25): the dishes first, then the
// outlets. Both lists may be empty.

import '../../../shared/api/api_client.dart';
import 'search_item_hit.dart';
import 'search_outlet_hit.dart';

/// Dishes and outlets that matched a search.
class MenuSearchResults {
  /// Creates the results.
  const MenuSearchResults({required this.items, required this.outlets});

  /// Reads the results from the API's JSON; a missing list counts as empty.
  factory MenuSearchResults.fromJson(Json json) => MenuSearchResults(
    items: [for (final i in json['items'] as List<dynamic>? ?? const []) SearchItemHit.fromJson(i as Json)],
    outlets: [for (final o in json['outlets'] as List<dynamic>? ?? const []) SearchOutletHit.fromJson(o as Json)],
  );

  /// The dishes that matched.
  final List<SearchItemHit> items;

  /// The outlets that matched.
  final List<SearchOutletHit> outlets;

  /// True when nothing matched at all.
  bool get isEmpty => items.isEmpty && outlets.isEmpty;
}
