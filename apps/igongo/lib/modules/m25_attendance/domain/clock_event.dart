// One clock-in or clock-out, as the Attendance API returns it.

import '../../../shared/api/api_client.dart';

/// A clock-in or clock-out.
class ClockEvent {
  /// Creates an event.
  const ClockEvent({required this.isIn, required this.at, required this.station, required this.late});

  /// Reads one from the API's JSON.
  factory ClockEvent.fromJson(Json json) => ClockEvent(
    isIn: json['kind'] == 'in',
    at: DateTime.parse('${json['at']}').toLocal(),
    station: '${json['station']}',
    late: json['late'] == true,
  );

  /// True for a clock-in.
  final bool isIn;

  /// When it happened, in the phone's time.
  final DateTime at;

  /// Where: `Main gate`, `Reception` or `App`.
  final String station;

  /// A late first clock-in.
  final bool late;
}
