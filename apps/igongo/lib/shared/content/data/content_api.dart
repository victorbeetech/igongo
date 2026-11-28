// The guest content endpoint the app reads (`/api/content`). Public: no sign-in needed.

import '../../api/api_client.dart';
import '../domain/guest_content.dart';

/// Calls the content API.
class ContentApi {
  /// Creates the calls on [_api].
  const ContentApi(this._api);

  final ApiClient _api;

  /// The switched-on content the guest app shows.
  Future<GuestContent> content() async => GuestContent.fromJson(await _api.get('/api/content'));
}
