// The saved-dish endpoints (`/api/orders/dishes`): the guest's own list, each
// call acting only on the signed-in guest's list (the server reads the guest
// from the session).

import '../../../shared/api/api_client.dart';
import '../domain/saved_dish.dart';

/// Reads, saves and removes the guest's saved dishes.
class SavedDishesApi {
  /// Creates the calls on [_api].
  const SavedDishesApi(this._api);

  final ApiClient _api;

  /// My saved dishes, newest first, with today's names and prices.
  Future<List<SavedDish>> list() async {
    final json = await _api.get('/api/orders/dishes');
    return [for (final i in json['items'] as List<dynamic>? ?? const []) SavedDish.fromJson(i as Json)];
  }

  /// Saves dish [itemId] to my list (saving it again changes nothing).
  Future<void> save(String itemId) => _api.send('PUT', _path(itemId));

  /// Removes dish [itemId] from my list.
  Future<void> remove(String itemId) => _api.send('DELETE', _path(itemId));

  /// The address of one dish on my list (the ID is encoded, so it is always one path part).
  static String _path(String itemId) => '/api/orders/dishes/${Uri.encodeComponent(itemId)}';
}
