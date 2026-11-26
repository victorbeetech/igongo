// The Earnings Statements endpoint the app uses (`/api/earnings`).

import '../../../shared/api/api_client.dart';
import '../domain/earnings_statement.dart';

/// Calls the Earnings API.
class EarningsApi {
  /// Creates the calls on [_api].
  const EarningsApi(this._api);

  final ApiClient _api;

  /// My statement with every payslip (S29-01, S29-03).
  Future<EarningsStatement> mine() async => EarningsStatement.fromJson(await _api.get('/api/earnings/mine'));
}
