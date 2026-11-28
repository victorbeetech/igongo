// Reads a whole guest history (orders, bookings) across the API's pages.
// The API returns the newest page and a `nextBefore` cursor; this asks for
// older pages until the cursor comes back empty, so the existing screens show
// every record without any new controls.

import 'api_client.dart';

/// A safety cap on the pages read in one go (200 pages of history per list).
const int maxHistoryPages = 200;

/// Reads every page of the history list at [path] and turns each row with [make].
///
/// Each request after the first adds `before=<cursor>`, where the cursor is the
/// `nextBefore` of the page before. The loop stops when there is no cursor.
Future<List<T>> readAllPages<T>(ApiClient api, String path, T Function(Json) make) async {
  // Step 1: start with an empty list and no cursor (the newest page comes first).
  final rows = <T>[];
  String? before;
  // Step 2: fetch pages, one after another, until the server has no older page.
  for (var page = 0; page < maxHistoryPages; page++) {
    // Step 2a: build the URL, adding the cursor after the first page.
    final separator = path.contains('?') ? '&' : '?';
    final url = before == null ? path : '$path${separator}before=${Uri.encodeQueryComponent(before)}';
    // Step 2b: read the rows of this page and keep them.
    final json = await api.get(url);
    rows.addAll([for (final row in json['items'] as List<dynamic>) make(row as Json)]);
    // Step 2c: the next cursor; null means this was the last page.
    before = json['nextBefore'] as String?;
    if (before == null) break;
  }
  return rows;
}
