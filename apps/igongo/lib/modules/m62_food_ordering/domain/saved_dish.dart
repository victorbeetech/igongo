// A dish the guest saved (the heart on a dish), as `GET /api/orders/dishes`
// gives it: the menu's current name and price, and whether it is on today.

import '../../../shared/api/api_client.dart';

/// One saved dish.
class SavedDish {
  /// Creates a saved dish.
  const SavedDish({required this.itemId, required this.outlet, required this.name, required this.price, required this.available});

  /// The menu item's ID.
  final String itemId;

  /// The outlet that sells it.
  final String outlet;

  /// The dish's name on the menu now.
  final String name;

  /// The base price on the menu now, in whole shillings.
  final int price;

  /// False when the dish is switched off or out of stock today.
  final bool available;

  /// Reads one saved dish from the API's JSON.
  factory SavedDish.fromJson(Json json) => SavedDish(
    itemId: '${json['itemId']}',
    outlet: '${json['outlet']}',
    name: '${json['name']}',
    price: (json['price'] as num?)?.toInt() ?? 0,
    available: json['available'] == true,
  );
}
