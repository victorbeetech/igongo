// Saves and reads a person's own profile photo (`/api/users/me/photo`). The
// photo travels as a base64 data URL, which the server checks for type and size.

import 'dart:convert';
import 'dart:typed_data';

import '../api/api_client.dart';

/// Calls the profile photo endpoints for the signed-in person.
class ProfilePhotoApi {
  /// Creates the calls on [_api].
  const ProfilePhotoApi(this._api);

  /// The shared API client.
  final ApiClient _api;

  /// My current photo, or null when I have none. Read from my account.
  Future<Uint8List?> current() async {
    // Step 1: the account carries the photo as a data URL, or null.
    final me = await _api.get('/api/users/me');
    final account = (me['account'] as Map<String, dynamic>?) ?? me;
    final image = account['image'];
    if (image is! String || image.isEmpty) return null;
    // Step 2: decode the part after the comma, the base64 payload.
    return base64Decode(image.substring(image.indexOf(',') + 1));
  }

  /// Saves [png] (a cropped photo) as my photo. The server refuses a bad one with a sentence.
  Future<void> save(Uint8List png) async {
    await _api.put('/api/users/me/photo', {'image': 'data:image/png;base64,${base64Encode(png)}'});
  }
}
