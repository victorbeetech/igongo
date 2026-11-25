// Draws notifications from inside the app with flutter_local_notifications,
// behind the `LocalNotifier` port. Used on Android, where a push that arrives
// while the app is open is not shown by the system.

import 'dart:convert';

import 'package:flutter_local_notifications/flutter_local_notifications.dart';

import '../application/ports/local_notifier.dart';
import '../domain/push_channel.dart';
import '../domain/push_message.dart';

/// `LocalNotifier` on flutter_local_notifications.
class PluginLocalNotifier implements LocalNotifier {
  /// The small white Igongo mark in the status bar, from packages/brand
  /// (`android/app/src/main/res/drawable-*/ic_stat_igongo.png`).
  static const statusBarIcon = 'ic_stat_igongo';

  final _plugin = FlutterLocalNotificationsPlugin();

  @override
  Future<void> initialise({required List<PushChannel> channels, required void Function(PushMessage) onTap}) async {
    // 1. Start the plugin. Permission is asked by Firebase, not here, so the
    //    iOS side must not ask a second time.
    await _plugin.initialize(
      settings: const InitializationSettings(
        android: AndroidInitializationSettings(statusBarIcon),
        iOS: DarwinInitializationSettings(
          requestAlertPermission: false,
          requestBadgePermission: false,
          requestSoundPermission: false,
        ),
      ),
      // 2. A tap carries the whole message back as JSON in the payload.
      onDidReceiveNotificationResponse: (response) {
        final payload = response.payload;
        if (payload != null) onTap(_decode(payload));
      },
    );

    // 3. Create every channel once; Android ignores channels that exist.
    final android = _plugin.resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>();
    for (final channel in channels) {
      await android?.createNotificationChannel(
        AndroidNotificationChannel(
          channel.id,
          channel.name,
          description: channel.description,
          importance: _importance(channel.importance),
        ),
      );
    }
  }

  @override
  Future<void> show(PushMessage message) {
    final channel = PushChannel.byId(message.channelId);
    return _plugin.show(
      // The same message ID always replaces the same banner, so no repeats.
      id: message.id.hashCode,
      title: message.title,
      body: message.body,
      notificationDetails: NotificationDetails(
        android: AndroidNotificationDetails(
          channel.id,
          channel.name,
          channelDescription: channel.description,
          importance: _importance(channel.importance),
          icon: statusBarIcon,
        ),
      ),
      payload: jsonEncode({'id': message.id, 'title': message.title, 'body': message.body, 'data': message.data}),
    );
  }

  /// Reads a message back from a tapped banner's payload.
  static PushMessage _decode(String payload) {
    final json = jsonDecode(payload) as Map<String, dynamic>;
    final data = (json['data'] as Map<String, dynamic>? ?? {}).map((k, v) => MapEntry(k, '$v'));
    return PushMessage.fromData(
      deliveryId: json['id'] as String? ?? '',
      title: json['title'] as String?,
      body: json['body'] as String?,
      data: data,
    );
  }

  /// Maps the app's importance to Android's.
  static Importance _importance(PushImportance importance) => switch (importance) {
    PushImportance.high => Importance.high,
    PushImportance.normal => Importance.defaultImportance,
    PushImportance.low => Importance.low,
  };
}
