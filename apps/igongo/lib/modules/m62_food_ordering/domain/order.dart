// A placed food order, as the guest sees it.

import '../../../shared/api/api_client.dart';
import 'order_line.dart';

/// A food order.
class Order {
  /// Creates an order.
  const Order({
    required this.id,
    required this.number,
    required this.outlet,
    required this.type,
    required this.status,
    required this.lines,
    required this.total,
    required this.paid,
    required this.readyAt,
    this.arriveAt,
  });

  /// Reads one from the API's JSON.
  factory Order.fromJson(Json json) => Order(
    id: '${json['id']}',
    number: '${json['number']}',
    outlet: '${json['outlet']}',
    type: '${json['type']}',
    status: '${json['status']}',
    lines: [for (final l in json['lines'] as List<dynamic>? ?? const []) OrderLine.fromJson(l as Json)],
    total: (json['total'] as num?)?.toInt() ?? 0,
    paid: (json['paid'] as num?)?.toInt() ?? 0,
    readyAt: '${json['readyAt']}',
    arriveAt: json['arriveAt'] as String?,
  );

  /// The order's ID.
  final String id;

  /// Its ticket number, such as `F-0042`.
  final String number;

  /// The outlet's key.
  final String outlet;

  /// The order type.
  final String type;

  /// Where it is: `awaiting_payment` ... `delivered` or `cancelled`.
  final String status;

  /// What was ordered.
  final List<OrderLine> lines;

  /// The total with delivery, whole shillings.
  final int total;

  /// Paid so far.
  final int paid;

  /// When the kitchen expects it ready (ISO time).
  final String readyAt;

  /// When the guest arrives, for pre-orders (ISO time).
  final String? arriveAt;

  /// What is still owed.
  int get owed => status == 'cancelled' ? 0 : total - paid;

  /// True while a rider may still be on the way.
  bool get tracking => type == 'delivery' && (status == 'ready' || status == 'on_the_way');

  /// True while the guest may still cancel (the API checks the time window).
  bool get cancellable => status == 'awaiting_payment' || status == 'received';
}
