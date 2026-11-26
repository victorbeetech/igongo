// One choice inside a menu item's option group, such as "Large (+5,000)".

import '../../../shared/api/api_client.dart';

/// A choice and what it adds to the price.
class OptionChoice {
  /// Creates a choice.
  const OptionChoice({required this.key, required this.name, required this.priceDelta});

  /// Reads one from the API's JSON.
  factory OptionChoice.fromJson(Json json) => OptionChoice(
    key: '${json['key']}',
    name: '${json['name']}',
    priceDelta: (json['priceDelta'] as num?)?.toInt() ?? 0,
  );

  /// Its key inside the group.
  final String key;

  /// Its name for people.
  final String name;

  /// Shillings added to the item's price.
  final int priceDelta;
}
