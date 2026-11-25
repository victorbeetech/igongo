// The Attendance endpoints (`/api/attendance`), as typed calls.

import '../../../shared/api/api_client.dart';
import '../domain/attendance_status.dart';
import '../domain/clock_event.dart';
import '../domain/day_summary.dart';
import '../domain/station_result.dart';

/// Calls the Attendance API.
class AttendanceApi {
  /// Creates the calls on [_api].
  const AttendanceApi(this._api);

  final ApiClient _api;

  /// Am I in or out now (S25-01).
  Future<AttendanceStatus> status() async => AttendanceStatus.fromJson(await _api.get('/api/attendance/status'));

  /// Clock myself in or out from the phone.
  Future<ClockEvent> clockSelf() async =>
      ClockEvent.fromJson((await _api.post('/api/attendance/clock'))['event'] as Json);

  /// A station clocks the holder of the card with chip [uid].
  Future<StationResult> stationClock({required String uid, required String station}) async =>
      StationResult.fromJson(await _api.post('/api/attendance/station-clock', {'uid': uid, 'station': station}));

  /// My days from [from] to [to] (`YYYY-MM-DD`), newest first (S25-03).
  Future<List<DaySummary>> myDays(String from, String to) async {
    final json = await _api.get('/api/attendance/mine?from=$from&to=$to');
    return [for (final d in json['days'] as List<dynamic>) DaySummary.fromJson(d as Json)].reversed.toList();
  }
}
