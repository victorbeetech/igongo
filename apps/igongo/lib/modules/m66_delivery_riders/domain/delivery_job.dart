// One delivery job, as the rider sees it (module 66). The guest's door code
// is never sent to staff or riders; the rider asks the guest for it.

import '../../../shared/api/api_client.dart';

/// A delivery job.
class DeliveryJob {
  /// Creates a job.
  const DeliveryJob({
    required this.id,
    required this.orderNumber,
    required this.customerName,
    required this.placeLabel,
    required this.cashToCollect,
    required this.status,
    this.customerPhone,
    this.lat,
    this.lng,
  });

  /// Reads one from the API's JSON.
  factory DeliveryJob.fromJson(Json json) {
    final place = json['place'] as Json? ?? const {};
    return DeliveryJob(
      id: '${json['id']}',
      orderNumber: '${json['orderNumber']}',
      customerName: '${json['customerName']}',
      placeLabel: '${place['label'] ?? ''}',
      cashToCollect: (json['cashToCollect'] as num?)?.toInt() ?? 0,
      status: '${json['status']}',
      customerPhone: json['customerPhone'] as String?,
      lat: (place['lat'] as num?)?.toDouble(),
      lng: (place['lng'] as num?)?.toDouble(),
    );
  }

  /// The job's ID.
  final String id;

  /// The order's ticket number.
  final String orderNumber;

  /// Who it is for.
  final String customerName;

  /// Where to take it, in words.
  final String placeLabel;

  /// Cash to collect at the door (0 when paid).
  final int cashToCollect;

  /// `assigned`, `accepted`, `picked_up`, `delivered` or `failed`.
  final String status;

  /// The customer's phone, when known.
  final String? customerPhone;

  /// The map point, when the guest shared one.
  final double? lat;

  /// The map point, when the guest shared one.
  final double? lng;
}
