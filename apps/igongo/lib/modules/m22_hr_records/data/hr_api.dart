// The HR Records endpoints (`/api/hr`) the app uses, as typed calls.

import '../../../shared/api/api_client.dart';
import '../domain/my_profile.dart';

/// Calls the HR Records API.
class HrApi {
  /// Creates the calls on [_api].
  const HrApi(this._api);

  final ApiClient _api;

  /// My own staff record (S22-08).
  Future<MyProfile> me() async => MyProfile.fromJson(await _api.get('/api/hr/staff/me'));
}
