// The Daily Reports endpoints (`/api/daily-reports`) the app uses, as typed calls.

import '../../../shared/api/api_client.dart';
import '../domain/my_report_day.dart';
import '../domain/report_section.dart';

/// Calls the Daily Reports API.
class ReportsApi {
  /// Creates the calls on [_api].
  const ReportsApi(this._api);

  final ApiClient _api;

  /// Today's report for me (S38-01).
  Future<MyReportDay> today() async => MyReportDay.fromJson(await _api.get('/api/daily-reports/mine'));

  /// Saves my answers for [date]; [submit] sends it for sign-off (S38-02).
  Future<void> save(String date, List<ReportSection> sections, {required bool submit}) =>
      _api.put('/api/daily-reports/mine/$date', {
        'sections': [for (final s in sections) s.toJson()],
        'submit': submit,
      });
}
