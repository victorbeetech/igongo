// Tests for the push models: reading a push, safe links, channels and config.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/modules/m10_notifications/domain/push_channel.dart';
import 'package:igongo/modules/m10_notifications/domain/push_message.dart';
import 'package:igongo/modules/m10_notifications/infrastructure/firebase_config.dart';

void main() {
  test('reads a push from the API data block', () {
    final message = PushMessage.fromData(
      deliveryId: 'fcm-1',
      title: 'Order ready',
      body: 'Table 4',
      data: {'notificationId': 'n9', 'channel': 'bookings', 'link': '/orders/9'},
    );
    expect(message.id, 'n9');
    expect(message.channelId, 'bookings');
    expect(message.link, '/orders/9');
  });

  test('falls back to the delivery ID and the general channel', () {
    final message = PushMessage.fromData(deliveryId: 'fcm-2', data: {});
    expect(message.id, 'fcm-2');
    expect(message.channelId, 'general');
    expect(message.link, isNull);
  });

  test('keeps only links to screens inside the app', () {
    expect(PushMessage.safeLink('/tasks/1'), '/tasks/1');
    for (final bad in ['https://evil.example', '//evil.example', 'tasks/1', '/x://y', r'/\evil', null]) {
      expect(PushMessage.safeLink(bad), isNull, reason: '$bad');
    }
  });

  test('unknown channels fall back to general', () {
    expect(PushChannel.byId('urgent'), PushChannel.urgent);
    expect(PushChannel.byId('nope'), PushChannel.general);
  });

  test('a build with no Firebase settings has push off', () {
    expect(FirebaseConfig.current(), isNull);
  });
}
