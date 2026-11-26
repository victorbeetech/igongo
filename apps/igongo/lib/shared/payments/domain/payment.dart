// One payment, as the Payments API returns it (modules/payments).

import '../../api/api_client.dart';

/// A payment towards a bill (an order, booking or other record).
class Payment {
  /// Creates a payment.
  const Payment({
    required this.id,
    required this.label,
    required this.method,
    required this.amount,
    required this.status,
    this.redirectUrl,
    this.message,
  });

  /// Reads one from the API's JSON.
  factory Payment.fromJson(Json json) => Payment(
    id: '${json['id']}',
    label: '${json['label']}',
    method: '${json['method']}',
    amount: (json['amount'] as num?)?.toInt() ?? 0,
    status: '${json['status']}',
    redirectUrl: json['redirectUrl'] as String?,
    message: json['message'] as String?,
  );

  /// The payment's ID.
  final String id;

  /// What it pays for, such as "Order F-0042".
  final String label;

  /// The method key, such as `mtn_momo`.
  final String method;

  /// Whole shillings.
  final int amount;

  /// `pending`, `succeeded`, `failed` or `refunded`.
  final String status;

  /// The card checkout page, for card payments.
  final String? redirectUrl;

  /// What the provider said (for example why it failed).
  final String? message;

  /// True while the guest still has to approve it on their phone or card page.
  bool get pending => status == 'pending';
}
