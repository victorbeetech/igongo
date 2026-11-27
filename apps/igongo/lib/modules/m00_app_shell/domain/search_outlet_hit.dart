// One outlet in the global search results (S00-25), as the server sends it.

import '../../../shared/api/api_client.dart';

/// An outlet that matched the guest's search, such as the main restaurant.
class SearchOutletHit {
  /// Creates a hit.
  const SearchOutletHit({required this.key, required this.name});

  /// Reads one hit from the API's JSON.
  factory SearchOutletHit.fromJson(Json json) => SearchOutletHit(key: '${json['key']}', name: '${json['name']}');

  /// The outlet's key, such as `main`.
  final String key;

  /// The outlet's name for people.
  final String name;
}
