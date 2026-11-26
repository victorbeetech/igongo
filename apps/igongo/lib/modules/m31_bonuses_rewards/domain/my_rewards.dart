// My rewards and how many buffet passes I can use now.

import '../../../shared/api/api_client.dart';
import 'bonus.dart';

/// What `GET /api/bonuses/mine` returns.
class MyRewards {
  /// Creates the page.
  const MyRewards({required this.items, required this.passesLeft});

  /// Reads it from the API's JSON.
  factory MyRewards.fromJson(Json json) => MyRewards(
    items: [for (final b in json['items'] as List) Bonus.fromJson(b as Json)],
    passesLeft: (json['passesLeft'] as num?)?.toInt() ?? 0,
  );

  /// Every reward, newest first.
  final List<Bonus> items;

  /// Buffet passes I can use today.
  final int passesLeft;
}
