// One dish in the global search results (S00-25), as the server sends it.
// Only dishes the guest can see come back, with today's availability.

import '../../../shared/api/api_client.dart';

/// A dish that matched the guest's search.
class SearchItemHit {
  /// Creates a hit.
  const SearchItemHit({
    required this.id,
    required this.outlet,
    required this.section,
    required this.name,
    required this.price,
    required this.available,
    this.photoUrl,
  });

  /// Reads one hit from the API's JSON.
  factory SearchItemHit.fromJson(Json json) => SearchItemHit(
    id: '${json['id']}',
    outlet: '${json['outlet']}',
    section: '${json['section']}',
    name: '${json['name']}',
    price: (json['price'] as num?)?.toInt() ?? 0,
    // Only an explicit false means off for today; a missing flag counts as on sale.
    available: json['available'] != false,
    photoUrl: json['photoUrl'] as String?,
  );

  /// The dish's ID.
  final String id;

  /// The outlet key that sells it.
  final String outlet;

  /// Its menu section, such as "Grill".
  final String section;

  /// Its name for people.
  final String name;

  /// Whole shillings, before options.
  final int price;

  /// False when it is off for today, so it cannot be ordered.
  final bool available;

  /// The dish's photo URL, or null when it has none yet.
  final String? photoUrl;
}
