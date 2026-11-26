// The Bonuses & Rewards endpoint the app uses (`/api/bonuses`).

import '../../../shared/api/api_client.dart';
import '../domain/my_rewards.dart';

/// Calls the Bonuses API.
class BonusesApi {
  /// Creates the calls on [_api].
  const BonusesApi(this._api);

  final ApiClient _api;

  /// My rewards (S31-01).
  Future<MyRewards> mine() async => MyRewards.fromJson(await _api.get('/api/bonuses/mine'));
}
