// The guest's own profile endpoints (`/api/crm/me`).

import '../../../shared/api/api_client.dart';
import '../domain/guest_profile.dart';

/// Calls the guest profile API.
class CrmApi {
  /// Creates the calls on [_api].
  const CrmApi(this._api);

  /// The shared API client.
  final ApiClient _api;

  /// My profile (made on first visit).
  Future<GuestProfile> me() async => GuestProfile.fromJson(await _api.get('/api/crm/me'));

  /// Saves my details. Empty text ([null]) clears a field; the server checks
  /// each value and refuses a bad one with a sentence the app shows.
  Future<void> save({
    required String name,
    String? phone,
    String? email,
    String? preferences,
    String? allergies,
  }) => _api.send(
    'PATCH',
    '/api/crm/me',
    {'name': name, 'phone': phone, 'email': email, 'preferences': preferences, 'allergies': allergies},
  );

  /// Saves which messages I agree to get.
  Future<void> consent({required bool sms, required bool whatsapp, required bool email}) =>
      _api.put('/api/crm/me/consent', {'sms': sms, 'whatsapp': whatsapp, 'email': email});
}
