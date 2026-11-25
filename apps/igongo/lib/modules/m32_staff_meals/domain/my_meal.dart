// One staff meal on today's list, for the person signed in.

import '../../../shared/api/api_client.dart';

/// A meal I may claim today, and whether I already had it.
class MyMeal {
  /// Creates a meal.
  const MyMeal({
    required this.key,
    required this.name,
    required this.startsAt,
    required this.endsAt,
    required this.openNow,
    this.servedAt,
  });

  /// Reads one from the API's JSON.
  factory MyMeal.fromJson(Json json) => MyMeal(
    key: '${json['key']}',
    name: '${json['name']}',
    startsAt: '${json['startsAt']}',
    endsAt: '${json['endsAt']}',
    openNow: json['openNow'] == true,
    servedAt: json['servedAt'] == null ? null : DateTime.parse('${json['servedAt']}').toLocal(),
  );

  /// The meal's key, such as `lunch`.
  final String key;

  /// The meal's name for people.
  final String name;

  /// When serving starts, `HH:MM` hotel time.
  final String startsAt;

  /// When serving ends, `HH:MM` hotel time.
  final String endsAt;

  /// Serving is on right now.
  final bool openNow;

  /// When I was served, if I was.
  final DateTime? servedAt;
}
