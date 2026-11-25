// Am I in or out right now, today so far, and whether the rules let me clock
// in from my phone (`GET /api/attendance/status`).

import '../../../shared/api/api_client.dart';
import '../../../shared/staff/staff_ref.dart';
import 'clock_event.dart';
import 'day_summary.dart';

/// My attendance right now.
class AttendanceStatus {
  /// Creates the status.
  const AttendanceStatus({
    required this.staff,
    required this.clockedIn,
    this.last,
    this.today,
    required this.allowAppClock,
  });

  /// Reads it from the API's JSON.
  factory AttendanceStatus.fromJson(Json json) => AttendanceStatus(
    staff: StaffRef.fromJson(json['staff'] as Json),
    clockedIn: json['clockedIn'] == true,
    last: json['last'] == null ? null : ClockEvent.fromJson(json['last'] as Json),
    today: json['today'] == null ? null : DaySummary.fromJson(json['today'] as Json),
    allowAppClock: (json['rules'] as Json?)?['allowAppClock'] != false,
  );

  /// Who I am at work.
  final StaffRef staff;

  /// True when my last clock was an "in".
  final bool clockedIn;

  /// My last clock, if any.
  final ClockEvent? last;

  /// Today so far, if I clocked today.
  final DaySummary? today;

  /// False when the super admin allows clocking only at a station.
  final bool allowAppClock;
}
