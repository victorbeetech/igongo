// The App Layout endpoint the app reads (modules/app-builder).

import '../../api/api_client.dart';
import '../domain/my_layout.dart';

/// Calls the layout API.
class LayoutApi {
  /// Creates the calls on [_api].
  const LayoutApi(this._api);

  final ApiClient _api;

  /// The signed-in person's layout.
  Future<MyLayout> mine() async => MyLayout.fromJson(await _api.get('/api/layout/me'));
}
