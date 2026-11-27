// One item of the guest Alerts inbox (S00-28), as the API sends it. Each item
// belongs to the signed-in person only; the server never sends anyone else's.

import '../../../shared/api/api_client.dart';

/// One notification the person has received in the app.
class InboxItem {
  /// Creates an item.
  const InboxItem({
    required this.id,
    required this.title,
    required this.body,
    required this.createdAt,
    this.link,
    this.readAt,
  });

  /// Reads one item from the API's JSON. A missing or empty read time means unread.
  factory InboxItem.fromJson(Json json) => InboxItem(
    id: '${json['id']}',
    title: '${json['title']}',
    body: '${json['body']}',
    createdAt: DateTime.parse('${json['createdAt']}'),
    link: json['link'] as String?,
    readAt: json['readAt'] == null ? null : DateTime.parse('${json['readAt']}'),
  );

  /// The item's ID, used to mark it read.
  final String id;

  /// Short heading, such as "Order ready".
  final String title;

  /// The message itself.
  final String body;

  /// When the API created it.
  final DateTime createdAt;

  /// The app screen it opens, such as `/orders/ord_1`, or null when it opens nothing.
  final String? link;

  /// When the person opened it, or null while it is unread.
  final DateTime? readAt;

  /// True until the person has opened the item.
  bool get isUnread => readAt == null;
}
