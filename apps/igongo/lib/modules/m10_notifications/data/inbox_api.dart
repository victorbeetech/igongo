// The calls to the guest Alerts inbox on the API (module 10, Notifications).
// Every call is for the signed-in person; the server refuses anyone else's item.

import '../../../shared/api/api_client.dart';
import '../domain/inbox_page.dart';

/// How many items the app asks for on the first page.
const int inboxPageSize = 20;

/// Calls the inbox endpoints on the app's API client.
class InboxApi {
  /// Creates the calls on [_api].
  const InboxApi(this._api);

  /// The app's API client.
  final ApiClient _api;

  /// The newest [inboxPageSize] items and the unread count.
  Future<InboxPage> fetchFirstPage() async {
    final json = await _api.get('/api/notifications/inbox?limit=$inboxPageSize');
    return InboxPage.fromJson(json);
  }

  /// Marks one item read. The item ID is encoded so it reaches the server intact.
  Future<void> markRead(String id) async {
    await _api.post('/api/notifications/inbox/${Uri.encodeComponent(id)}/read');
  }

  /// Marks every unread item of the person read.
  Future<void> markAllRead() async {
    await _api.post('/api/notifications/inbox/read-all');
  }
}
