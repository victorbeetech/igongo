// A kitchen or bar that sells food (set by the super admin in Menus, S61).

import '../../../shared/api/api_client.dart';

/// One outlet, such as the main restaurant.
class Outlet {
  /// Creates an outlet.
  const Outlet({required this.key, required this.name, this.photoUrl});

  /// Reads one from the API's JSON.
  factory Outlet.fromJson(Json json) =>
      Outlet(key: '${json['key']}', name: '${json['name']}', photoUrl: json['photoUrl'] as String?);

  /// Its key, such as `restaurant`.
  final String key;

  /// Its name for people.
  final String name;

  /// The restaurant's photo, or null (the app shows a placeholder).
  final String? photoUrl;
}
