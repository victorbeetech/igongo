// What a gate or reception station shows after a card tap: who, in or out, and when.

import '../../../shared/api/api_client.dart';
import '../../../shared/staff/staff_ref.dart';
import 'clock_event.dart';

/// The result of a station clock.
class StationResult {
  /// Creates the result.
  const StationResult({required this.staff, required this.event});

  /// Reads it from the API's JSON.
  factory StationResult.fromJson(Json json) =>
      StationResult(staff: StaffRef.fromJson(json['staff'] as Json), event: ClockEvent.fromJson(json['event'] as Json));

  /// Whose card it was.
  final StaffRef staff;

  /// The clock that was recorded.
  final ClockEvent event;
}
