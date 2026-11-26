// One priced line of a placed order.

import '../../../shared/api/api_client.dart';

/// An order line.
class OrderLine {
  /// Creates a line.
  const OrderLine({required this.name, required this.quantity, required this.lineTotal});

  /// Reads one from the API's JSON.
  factory OrderLine.fromJson(Json json) => OrderLine(
    name: '${json['name']}',
    quantity: (json['quantity'] as num?)?.toInt() ?? 1,
    lineTotal: (json['lineTotal'] as num?)?.toInt() ?? 0,
  );

  /// The item's name.
  final String name;

  /// How many.
  final int quantity;

  /// Shillings for the line.
  final int lineTotal;
}
