// The global search call (S00-25). Anyone may search the public menu, so
// no sign-in is needed.

import '../../../shared/api/api_client.dart';
import '../domain/menu_search_results.dart';

/// Calls the search endpoint on the app's API client.
class GlobalSearchApi {
  /// Creates the calls on [_api].
  const GlobalSearchApi(this._api);

  /// The app's API client.
  final ApiClient _api;

  /// Dishes and outlets matching [text]. The text is encoded so spaces and symbols reach the server intact.
  Future<MenuSearchResults> search(String text) async {
    final json = await _api.get('/api/menu/search?q=${Uri.encodeQueryComponent(text)}');
    return MenuSearchResults.fromJson(json);
  }
}
