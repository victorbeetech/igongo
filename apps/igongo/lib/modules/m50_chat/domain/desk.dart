// A desk a guest can write to, such as the front desk.

import '../../../shared/api/api_client.dart';

/// A desk.
class Desk {
  /// Creates a desk.
  const Desk(this.key, this.name);

  /// Reads one from the API's JSON.
  factory Desk.fromJson(Json json) => Desk('${json['key']}', '${json['name']}');

  /// Its key, such as `front-desk`.
  final String key;

  /// Its name.
  final String name;
}
