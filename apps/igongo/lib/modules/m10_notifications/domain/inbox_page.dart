// The first page of the guest Alerts inbox: the newest items and the unread count for the badge.

import '../../../shared/api/api_client.dart';
import 'inbox_item.dart';

/// The newest items of the inbox plus how many are unread.
class InboxPage {
  /// Creates the page.
  const InboxPage({required this.items, required this.unreadCount});

  /// Reads the page from the API's JSON. A missing list counts as empty.
  factory InboxPage.fromJson(Json json) => InboxPage(
    items: [for (final i in json['items'] as List<dynamic>? ?? const []) InboxItem.fromJson(i as Json)],
    unreadCount: (json['unreadCount'] as num?)?.toInt() ?? 0,
  );

  /// The items on this page, newest first.
  final List<InboxItem> items;

  /// How many of the person's items are unread, across the whole inbox.
  final int unreadCount;
}
