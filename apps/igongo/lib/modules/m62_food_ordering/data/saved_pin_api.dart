// The saved delivery pin endpoints (`/api/orders/location`). Each call acts
// only on the signed-in guest's own pin; the server reads the guest from the session.

import '../../../shared/api/api_client.dart';
import '../domain/delivery_pin.dart';

/// Reads, saves and removes the guest's saved delivery pin.
class SavedPinApi {
  /// Creates the calls on [_api].
  const SavedPinApi(this._api);

  final ApiClient _api;

  /// The guest's saved pin, or null when none is saved.
  Future<DeliveryPin?> load() async {
    // Step 1: the server answers `null` when no pin is saved; the client wraps that
    // as {items: null}, so a missing label means "no pin".
    final json = await _api.get('/api/orders/location');
    if (json['label'] == null) return null;
    // Step 2: read the saved pin.
    return DeliveryPin.fromJson(json);
  }

  /// Saves [pin] as the guest's delivery point (replaces the earlier one).
  Future<void> save(DeliveryPin pin) => _api.put('/api/orders/location', pin.toJson());

  /// Removes the guest's saved pin.
  Future<void> clear() => _api.send('DELETE', '/api/orders/location');
}
