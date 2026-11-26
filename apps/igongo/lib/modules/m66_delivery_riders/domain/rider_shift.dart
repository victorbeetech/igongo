// The rider's shift today: online or not, current jobs, trips, earnings and
// the cash in hand (with the super admin's limit).

import '../../../shared/api/api_client.dart';
import 'delivery_job.dart';

/// A rider's shift.
class RiderShift {
  /// Creates the shift.
  const RiderShift({
    required this.online,
    required this.current,
    required this.tripsToday,
    required this.earningsToday,
    required this.cashInHand,
    required this.cashLimit,
  });

  /// Reads it from the API's JSON.
  factory RiderShift.fromJson(Json json) => RiderShift(
    online: (json['status'] as Json?)?['online'] == true,
    current: [for (final j in json['current'] as List<dynamic>? ?? const []) DeliveryJob.fromJson(j as Json)],
    tripsToday: (json['tripsToday'] as num?)?.toInt() ?? 0,
    earningsToday: (json['earningsToday'] as num?)?.toInt() ?? 0,
    cashInHand: (json['cashInHand'] as num?)?.toInt() ?? 0,
    cashLimit: (json['cashLimit'] as num?)?.toInt() ?? 0,
  );

  /// True when the rider takes jobs.
  final bool online;

  /// Jobs not finished yet.
  final List<DeliveryJob> current;

  /// Trips finished today.
  final int tripsToday;

  /// Trip pay today, whole shillings.
  final int earningsToday;

  /// Cash collected and not yet handed in.
  final int cashInHand;

  /// The most cash a rider may carry (0 means no limit).
  final int cashLimit;
}
