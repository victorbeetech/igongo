// The Payments endpoints the app uses (`/api/payments`).

import '../../api/api_client.dart';
import '../domain/pay_method.dart';
import '../domain/payment.dart';

/// Calls the Payments API.
class PaymentsApi {
  /// Creates the calls on [_api].
  const PaymentsApi(this._api);

  final ApiClient _api;

  /// The methods switched on for [module] (and [outlet]), then, in preview
  /// mode, the gateways still waiting for their keys (marked `preview`).
  Future<List<PayMethod>> methods(String module, {String? outlet}) async {
    final query = outlet == null ? '' : '&outlet=$outlet';
    final json = await _api.get('/api/payments/methods?module=$module$query');
    return [
      for (final m in json['items'] as List<dynamic>) PayMethod.fromJson(m as Json),
      for (final m in json['preview'] as List<dynamic>? ?? const []) PayMethod.fromJson(m as Json),
    ];
  }

  /// Starts paying record [recordId] of [module] by [method].
  Future<Payment> pay({
    required String module,
    required String recordId,
    required String method,
    String? phone,
  }) async => Payment.fromJson(
    await _api.post('/api/payments/pay', {'module': module, 'recordId': recordId, 'method': method, 'phone': ?phone}),
  );

  /// One payment; the API checks again with the provider while it is pending.
  Future<Payment> byId(String id) async => Payment.fromJson(await _api.get('/api/payments/$id'));
}
