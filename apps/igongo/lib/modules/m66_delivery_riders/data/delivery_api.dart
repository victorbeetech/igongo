// The delivery endpoints the app uses (`/api/delivery`): the rider's shift
// and steps, and the guest's tracker for everything delivered to them.

import '../../../shared/api/api_client.dart';
import '../domain/dispatch_board.dart';
import '../domain/rider_shift.dart';
import '../domain/tracked_delivery.dart';

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

  /// My deliveries of every kind: those on their way, then the last 30 days' finished ones.
  Future<({List<TrackedDelivery> active, List<TrackedDelivery> done})> mine() async {
    final json = await _api.get('/api/delivery/mine');
    List<TrackedDelivery> read(String key) => [
      for (final d in json[key] as List<dynamic>? ?? const []) TrackedDelivery.fromJson(d as Json),
    ];
    return (active: read('active'), done: read('done'));
  }

  /// Reports job [id] could not be delivered, and why.
  Future<void> fail(String id, String reason) => _api.post('/api/delivery/jobs/$id/fail', {'reason': reason});

  /// Dispatch: waiting, active and finished jobs, and the riders online now.
  Future<DispatchBoard> board() async => DispatchBoard.fromJson(await _api.get('/api/delivery/board'));

  /// Dispatch: gives job [id] to rider [riderUserId].
  Future<void> assign(String id, String riderUserId) =>
      _api.post('/api/delivery/jobs/$id/assign', {'riderUserId': riderUserId});
}
