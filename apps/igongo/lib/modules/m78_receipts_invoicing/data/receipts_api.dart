// The calls the My receipts screen makes to the API. Receipts are the guest's
// settled payments (module 77). Every call is for the signed-in person; the
// server returns only that person's own payments.

import '../../../shared/api/api_client.dart';

/// Calls the payments endpoints on the app's API client.
class ReceiptsApi {
  /// Creates the calls on [_api].
  const ReceiptsApi(this._api);

  /// The app's API client.
  final ApiClient _api;

  /// The person's succeeded payments, as the API returns them (newest first
  /// is handled by the mapper, not here). Each item is one JSON payment.
  Future<List<Map<String, dynamic>>> settledPayments() async {
    // Step 1: ask only for the person's own payments that went through.
    final json = await _api.get('/api/payments/?mine=1&status=succeeded');
    // Step 2: the API wraps the list in an `items` field.
    final items = json['items'];
    if (items is! List) return const [];
    // Step 3: keep only the entries that are JSON objects.
    return items.whereType<Map<String, dynamic>>().toList();
  }
}
