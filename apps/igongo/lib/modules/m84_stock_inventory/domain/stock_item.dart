// A stock item with its quantity on hand, as the stock API returns it.

import '../../../shared/api/api_client.dart';

/// One stock item.
class StockItem {
  /// Creates an item.
  const StockItem({
    required this.id,
    required this.code,
    required this.name,
    required this.unit,
    required this.onHand,
    required this.low,
    required this.active,
  });

  /// Reads an item from the API.
  factory StockItem.fromJson(Json j) => StockItem(
    id: j['id'] as String,
    code: j['code'] as String,
    name: j['name'] as String,
    unit: j['unit'] as String,
    onHand: (j['onHand'] as num? ?? 0).toDouble(),
    low: j['low'] as bool? ?? false,
    active: j['active'] as bool? ?? true,
  );

  /// The item's ID.
  final String id;

  /// Its code, also its QR text.
  final String code;

  /// Its name.
  final String name;

  /// The base unit, such as kg.
  final String unit;

  /// All stores together, in base units.
  final double onHand;

  /// True when at or below its reorder level.
  final bool low;

  /// False when switched off.
  final bool active;

  /// The quantity on hand in words, such as "12.5 kg".
  String get onHandText => '${onHand == onHand.roundToDouble() ? onHand.toInt() : onHand} $unit';
}
