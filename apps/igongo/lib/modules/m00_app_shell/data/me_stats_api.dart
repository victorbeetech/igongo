// The profile numbers endpoint (`/api/me/stats`). The server reads the guest
// from the session, so each call returns only the signed-in person's numbers.

import '../../../shared/api/api_client.dart';
import '../domain/me_stats.dart';

/// Reads the signed-in guest's profile numbers.
class MeStatsApi {
  /// Creates the calls on [_api].
  const MeStatsApi(this._api);

  final ApiClient _api;

  /// My profile numbers (bookings, orders, points, saved dishes).
  Future<MeStats> load() async => MeStats.fromJson(await _api.get('/api/me/stats'));
}
