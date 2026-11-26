// The rider endpoints the app uses (`/api/delivery`).

import '../../../shared/api/api_client.dart';
import '../domain/rider_shift.dart';

/// Calls the rider API.
class DeliveryApi {
  /// Creates the calls on [_api].
  const DeliveryApi(this._api);

  final ApiClient _api;

  /// My shift.
  Future<RiderShift> myShift() async => RiderShift.fromJson(await _api.get('/api/delivery/rider/me'));

  /// Goes online or offline.
  Future<void> setOnline(bool online) => _api.post('/api/delivery/rider/online', {'online': online});

  /// A step on job [id]: `accept`, `decline` or `pickup`.
  Future<void> step(String id, String step) => _api.post('/api/delivery/jobs/$id/$step', const <String, Object>{});

  /// Delivers job [id] with the guest's [code] and the cash taken.
  Future<void> deliver(String id, {String? code, int? cash}) =>
      _api.post('/api/delivery/jobs/$id/deliver', {'code': ?code, 'cashCollected': ?cash});

  /// Reports job [id] could not be delivered, and why.
  Future<void> fail(String id, String reason) => _api.post('/api/delivery/jobs/$id/fail', {'reason': reason});
}
