// Calls the public settings endpoint. No sign-in is needed to read it.

import '../../api/api_client.dart';
import '../domain/public_settings.dart';

/// Reads the public settings from the API.
class PublicSettingsApi {
  /// Creates the reader on [_api].
  const PublicSettingsApi(this._api);

  /// The app's API client.
  final ApiClient _api;

  /// Fetches `/api/public/settings` and parses it.
  Future<PublicSettings> fetch() async => PublicSettings.fromJson(await _api.get('/api/public/settings'));
}
