// The Reports & Analytics endpoint the app uses (`/api/reports`).

import '../../../shared/api/api_client.dart';
import '../domain/dashboard.dart';

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
}
