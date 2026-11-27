// Reads the Alerts inbox JSON the API sends: unread and read items, and an empty page.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/modules/m10_notifications/domain/inbox_item.dart';
import 'package:igongo/modules/m10_notifications/domain/inbox_page.dart';

void main() {
  group('InboxItem', () {
    test('an item with no read time is unread and keeps its link', () {
      final item = InboxItem.fromJson({
        'id': 'ntf_1',
        'title': 'Order ready',
        'body': 'Your order F-0042 is ready',
        'channel': 'bookings',
        'link': '/orders/F-0042',
        'createdAt': '2026-11-27T09:00:00.000Z',
        'readAt': null,
      });
      expect(item.id, 'ntf_1');
      expect(item.link, '/orders/F-0042');
      expect(item.isUnread, isTrue);
      expect(item.createdAt.toUtc(), DateTime.utc(2026, 11, 27, 9));
    });

    test('an item with a read time is read and may open nothing', () {
      final item = InboxItem.fromJson({
        'id': 'ntf_2',
        'title': 'Sign-in alert',
        'body': 'New device',
        'channel': 'urgent',
        'link': null,
        'createdAt': '2026-11-27T09:00:00.000Z',
        'readAt': '2026-11-27T09:05:00.000Z',
      });
      expect(item.isUnread, isFalse);
      expect(item.link, isNull);
    });
  });

  group('InboxPage', () {
    test('an empty reply is an empty page with no unread items', () {
      final page = InboxPage.fromJson({});
      expect(page.items, isEmpty);
      expect(page.unreadCount, 0);
    });

    test('counts the unread items across the whole inbox', () {
      final page = InboxPage.fromJson({
        'items': [
          {'id': 'a', 'title': 'A', 'body': 'a', 'createdAt': '2026-11-27T09:00:00Z', 'readAt': null},
        ],
        'unreadCount': 4,
        'nextBefore': null,
      });
      expect(page.items.length, 1);
      expect(page.unreadCount, 4);
    });
  });
}
