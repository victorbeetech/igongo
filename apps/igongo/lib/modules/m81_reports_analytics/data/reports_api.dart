// The Reports & Analytics endpoints the app uses (`/api/reports`): the
// dashboard, and saved reports with their runs.

import '../../../shared/api/api_client.dart';
import '../domain/dashboard.dart';
import '../domain/report_run.dart';
import '../domain/saved_report.dart';

/// Calls the Reports API.
class ReportsApi {
  /// Creates the calls on [_api].
  const ReportsApi(this._api);

  final ApiClient _api;

  /// The dashboard for the last [days] hotel days (S81-01).
  Future<Dashboard> dashboard(int days) async {
    final to = DateTime.now().toUtc().add(const Duration(hours: 3));
    String day(DateTime d) => d.toIso8601String().substring(0, 10);
    return Dashboard.fromJson(
      await _api.get('/api/reports/dashboard?from=${day(to.subtract(Duration(days: days - 1)))}&to=${day(to)}'),
    );
  }

  /// My saved reports (everyone's for those who see every area) (S81-04).
  Future<List<SavedReport>> savedReports() async => [
    for (final r in (await _api.get('/api/reports/saved'))['reports'] as List) SavedReport.fromJson(r as Json),
  ];

  /// Runs report [id] now; the run with its numbers.
  Future<ReportRun> run(String id) async => ReportRun.fromJson(await _api.post('/api/reports/saved/$id/run'));

  /// Report [id]'s past runs, newest first, without numbers.
  Future<List<ReportRun>> runs(String id) async => [
    for (final r in (await _api.get('/api/reports/saved/$id/runs'))['runs'] as List) ReportRun.fromJson(r as Json),
  ];

  /// One run with its numbers.
  Future<ReportRun> runOf(String id) async => ReportRun.fromJson(await _api.get('/api/reports/runs/$id'));
}
