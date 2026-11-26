// A delivery zone the super admin set (module 66), with its fee and time.

import '../../../shared/api/api_client.dart';

/// One zone, such as "Mbarara town".
class DeliveryZone {
  /// Creates a zone.
  const DeliveryZone({required this.zone, required this.name, required this.fee, required this.minutes});

  /// Reads one from the API's JSON.
  factory DeliveryZone.fromJson(Json json) => DeliveryZone(
    zone: '${json['zone']}',
    name: '${json['name']}',
    fee: (json['fee'] as num?)?.toInt() ?? 0,
    minutes: (json['minutes'] as num?)?.toInt() ?? 0,
  );

  /// Its key.
  final String zone;

  /// Its name.
  final String name;

  /// The delivery fee, whole shillings.
  final int fee;

  /// Usual minutes on the road.
  final int minutes;
}
