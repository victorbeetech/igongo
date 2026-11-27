// One dish or drink on an outlet's menu (module 61), as the app shows it to guests.

import '../../../shared/api/api_client.dart';
import 'option_group.dart';

/// A menu item.
class MenuItem {
  /// Creates an item.
  const MenuItem({
    required this.id,
    required this.section,
    required this.name,
    required this.price,
    required this.available,
    required this.options,
    required this.allergens,
    this.description,
    this.photoUrl,
  });

  /// Reads one from the API's JSON.
  factory MenuItem.fromJson(Json json) => MenuItem(
    id: '${json['id']}',
    section: '${json['section']}',
    name: '${json['name']}',
    price: (json['price'] as num?)?.toInt() ?? 0,
    available: json['available'] != false,
    options: [for (final g in json['options'] as List<dynamic>? ?? const []) OptionGroup.fromJson(g as Json)],
    allergens: [for (final a in json['allergens'] as List<dynamic>? ?? const []) '$a'],
    description: json['description'] as String?,
    photoUrl: json['photoUrl'] as String?,
  );

  /// The item's ID.
  final String id;

  /// Its menu section, such as "Grill".
  final String section;

  /// Its name.
  final String name;

  /// Whole shillings, before options.
  final int price;

  /// False when it is out for today.
  final bool available;

  /// Option groups.
  final List<OptionGroup> options;

  /// Allergens, such as "nuts".
  final List<String> allergens;

  /// More about it.
  final String? description;

  /// The dish's photo, or null (the app shows a placeholder).
  final String? photoUrl;
}
