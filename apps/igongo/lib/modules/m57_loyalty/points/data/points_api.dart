// The points endpoint the app uses (`/api/points`). The guest's own wallet only;
// the super admin changes the rules on the web portal.

import '../../../../shared/api/api_client.dart';
import '../domain/points_wallet.dart';

/// Calls the points API.
class PointsApi {
  /// Creates the calls on [_api].
  const PointsApi(this._api);

  /// The shared API client, which sends the person's session.
  final ApiClient _api;

  /// My points wallet. While the programme is off this is only the switch.
  Future<PointsWallet> wallet() async => PointsWallet.fromJson(await _api.get('/api/points/me'));
}
