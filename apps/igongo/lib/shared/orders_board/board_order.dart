// One open food order as the staff boards show it (GET /api/orders/board):
// its ticket number, what to make, and the next steps staff may take.

import '../api/api_client.dart';

/// An order on the board.
class BoardOrder {
  /// Creates an order.
  const BoardOrder({
    required this.id,
    required this.number,
    required this.outlet,
    required this.type,
    required this.status,
    required this.lines,
    required this.next,
    this.table,
    this.notes,
    this.allergies,
  });

  /// Reads one from the API's JSON.
  factory BoardOrder.fromJson(Json json) => BoardOrder(
    id: '${json['id']}',
    number: '${json['number']}',
    outlet: '${json['outlet']}',
    type: '${json['type']}',
    status: '${json['status']}',
    lines: [
      for (final l in json['lines'] as List<dynamic>? ?? const []) '${(l as Json)['quantity'] ?? 1} × ${l['name']}',
    ],
    next: [for (final n in json['next'] as List<dynamic>? ?? const []) '$n'],
    table: json['table'] as String?,
    notes: json['notes'] as String?,
    allergies: json['allergies'] as String?,
  );

  /// The order's ID.
  final String id;

  /// The ticket number, such as `F-0042`.
  final String number;

  /// The outlet key.
  final String outlet;

  /// Delivery, dine-in, takeaway, pre-order or room service.
  final String type;

  /// Where it is now.
  final String status;

  /// What to make, such as `2 × Rolex`.
  final List<String> lines;

  /// The statuses staff may move it to next.
  final List<String> next;

  /// The table, for dine-in.
  final String? table;

  /// The guest's notes.
  final String? notes;

  /// The guest's allergies.
  final String? allergies;
}
