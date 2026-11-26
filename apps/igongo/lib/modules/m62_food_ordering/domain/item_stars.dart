// A dish's average stars from guests' ratings, for the menu.

import '../../../shared/api/api_client.dart';

/// One dish's stars.
class ItemStars {
  /// Creates the stars.
  const ItemStars({required this.itemId, required this.average, required this.count});

  /// Reads one from the API's JSON.
  factory ItemStars.fromJson(Json json) => ItemStars(
    itemId: '${json['itemId']}',
    average: (json['average'] as num?)?.toDouble() ?? 0,
    count: (json['count'] as num?)?.toInt() ?? 0,
  );

  /// The menu item's ID.
  final String itemId;

  /// Average food stars, 1 to 5, one decimal.
  final double average;

  /// How many ratings.
  final int count;

  /// "4.5 ★ (12)".
  String get words => '${average.toStringAsFixed(1)} ★ ($count)';
}
