// The Staff Cards endpoints the app uses (`/api/cards`).

import '../../../shared/api/api_client.dart';
import '../domain/my_card.dart';

/// Calls the Staff Cards API.
class CardsApi {
  /// Creates the calls on [_api].
  const CardsApi(this._api);

  final ApiClient _api;

  /// My card (S16-19).
  Future<MyCard> mine() async => MyCard.fromJson(await _api.get('/api/cards/mine'));
}
