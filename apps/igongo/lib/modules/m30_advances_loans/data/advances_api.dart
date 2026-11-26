// The Advances & Loans endpoints the app uses (`/api/advances`).

import '../../../shared/api/api_client.dart';
import '../domain/my_advances.dart';

/// Calls the Advances API.
class AdvancesApi {
  /// Creates the calls on [_api].
  const AdvancesApi(this._api);

  final ApiClient _api;

  /// My advances and the rules (S30-01).
  Future<MyAdvances> mine() async => MyAdvances.fromJson(await _api.get('/api/advances/mine'));

  /// Asks for an advance or loan (S30-02).
  Future<void> request({required String kind, required int amount, required int instalments, required String reason}) =>
      _api.post('/api/advances/mine', {'kind': kind, 'amount': amount, 'instalments': instalments, 'reason': reason});

  /// Takes back a request nobody has decided yet.
  Future<void> cancel(String id) => _api.post('/api/advances/mine/$id/cancel');
}
