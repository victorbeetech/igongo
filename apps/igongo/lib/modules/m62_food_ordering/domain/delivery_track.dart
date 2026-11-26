// Where a delivery is, for the guest: the rider, minutes, and the code to
// give the rider at the door.

import '../../../shared/api/api_client.dart';

/// A delivery's tracking.
class DeliveryTrack {
  /// Creates the tracking.
  const DeliveryTrack({required this.status, required this.code, required this.minutes, this.riderName});

  /// Reads it from the API's JSON.
  factory DeliveryTrack.fromJson(Json json) => DeliveryTrack(
    status: '${json['status']}',
    code: '${json['code']}',
    minutes: (json['minutes'] as num?)?.toInt() ?? 0,
    riderName: json['riderName'] as String?,
  );

  /// The job's status.
  final String status;

  /// The code to give the rider.
  final String code;

  /// Usual minutes on the road.
  final int minutes;

  /// The rider, once assigned.
  final String? riderName;
}
