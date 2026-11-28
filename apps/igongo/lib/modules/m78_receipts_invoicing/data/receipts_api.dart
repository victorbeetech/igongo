// The calls the My receipts screen and the Receipt Detail ticket make to the
// API. A receipt is a settled payment (module 77). A booking payment also has
// its booking record, read from the booking module's own owner list. Every
// call is for the signed-in person; the server returns only that person's own
// payments and bookings.

import '../../../shared/api/api_client.dart';

/// The API path of each booking module's owner list (`<path>/bookings/mine`).
/// A payment's module key is one of these for a booking payment.
const Map<String, String> bookingModulePaths = {
  'room-bookings': '/api/rooms',
  'museum': '/api/museum',
  'events-conferences': '/api/events',
  'pool': '/api/pool',
  'crafts-bookshop': '/api/shop',
};

/// Calls the payments and booking endpoints on the app's API client.
class ReceiptsApi {
  /// Creates the calls on [_api].
  const ReceiptsApi(this._api);

  /// The app's API client.
  final ApiClient _api;

  /// The person's succeeded payments as JSON objects, in the order the API gives them.
  Future<List<Map<String, dynamic>>> settledPayments() async {
    final json = await _api.get('/api/payments/?mine=1&status=succeeded');
    return _items(json);
  }

  /// The person's bookings in one booking module, as JSON objects. Returns
  /// nothing for a module that is not a booking module.
  Future<List<Map<String, dynamic>>> bookingsOf(String module) async {
    // Step 1: find the module's owner list; unknown modules have no bookings.
    final base = bookingModulePaths[module];
    if (base == null) return const [];
    // Step 2: read the list and return its objects.
    return _items(await _api.get('$base/bookings/mine'));
  }

  /// Pulls the `items` list out of an API response, keeping only JSON objects.
  List<Map<String, dynamic>> _items(Map<String, dynamic> json) {
    final items = json['items'];
    if (items is! List) return const [];
    return items.whereType<Map<String, dynamic>>().toList();
  }
}
