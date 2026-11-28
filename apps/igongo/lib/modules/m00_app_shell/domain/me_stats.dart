// The figures on the signed-in guest's profile, as `GET /api/me/stats` gives
// them. Each is 0 when there is nothing yet; the profile shows a dash for 0.

import '../../../shared/api/api_client.dart';

/// The profile numbers: bookings, orders, loyalty points and saved dishes.
class MeStats {
  /// Creates the numbers.
  const MeStats({required this.bookings, required this.orders, required this.points, required this.savedDishes});

  /// Bookings not cancelled, across the booking modules.
  final int bookings;

  /// Food orders placed.
  final int orders;

  /// Loyalty points earned from delivered food.
  final int points;

  /// Dishes on the saved list.
  final int savedDishes;

  /// Reads the numbers from the API's JSON; a missing number counts as 0.
  factory MeStats.fromJson(Json json) => MeStats(
    bookings: _count(json['bookings']),
    orders: _count(json['orders']),
    points: _count(json['points']),
    savedDishes: _count(json['savedDishes']),
  );

  /// A whole number from the JSON, or 0 when it is missing.
  static int _count(Object? value) => (value as num?)?.toInt() ?? 0;
}
