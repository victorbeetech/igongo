// The port to the Igongo API's device token endpoints
// (`POST /notifications/devices` and `DELETE /notifications/devices/:token`).

import '../../domain/device_registration.dart';
import '../../domain/push_platform.dart';

/// Registers and removes this phone's push token on the API.
abstract interface class DeviceTokenApi {
  /// Saves [token] for the signed-in person and returns the topics to join.
  ///
  /// Throws when the API cannot be reached; the caller retries later.
  Future<DeviceRegistration> register({required String token, required PushPlatform platform});

  /// Deletes [token], so the API stops sending to this phone.
  Future<void> remove(String token);
}
