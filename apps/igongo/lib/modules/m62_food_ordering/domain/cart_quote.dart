// The server's price for a cart before ordering: the food, any promo or
// voucher discount, the delivery fee and the total, worked out by the API
// (the app never decides a price).

import '../../../shared/api/api_client.dart';

/// A priced cart.
class CartQuote {
  /// Creates a quote.
  const CartQuote({
    required this.subtotal,
    required this.discount,
    required this.deliveryFee,
    this.containerFee = 0,
    required this.total,
    required this.readyAt,
    this.promoLabel,
  });

  /// Reads one from the API's JSON.
  factory CartQuote.fromJson(Json json) => CartQuote(
    subtotal: (json['subtotal'] as num?)?.toInt() ?? 0,
    discount: (json['discount'] as num?)?.toInt() ?? 0,
    deliveryFee: (json['deliveryFee'] as num?)?.toInt() ?? 0,
    containerFee: (json['containerFee'] as num?)?.toInt() ?? 0,
    total: (json['total'] as num?)?.toInt() ?? 0,
    readyAt: '${json['readyAt']}',
    promoLabel: (json['promo'] as Json?)?['label'] as String?,
  );

  /// The food, whole shillings.
  final int subtotal;

  /// Taken off by the code.
  final int discount;

  /// The zone's delivery fee.
  final int deliveryFee;

  /// The takeaway container fee (0 when containers are free).
  final int containerFee;

  /// What the order will cost.
  final int total;

  /// When it should be ready (ISO time).
  final String readyAt;

  /// The code's name, such as "Easter (10% off)".
  final String? promoLabel;
}
