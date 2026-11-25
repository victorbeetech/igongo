// Turns a Firebase message into the app's own `PushMessage`, so nothing past
// the infrastructure layer knows about Firebase.

import 'package:firebase_messaging/firebase_messaging.dart';

import '../domain/push_message.dart';

/// Converts Firebase messages.
abstract final class PushMessageMapper {
  /// The app's message for [remote].
  static PushMessage fromRemote(RemoteMessage remote) {
    // FCM data values are strings already; convert defensively all the same.
    final data = remote.data.map((key, value) => MapEntry(key, '$value'));
    return PushMessage.fromData(
      deliveryId: remote.messageId ?? '${remote.sentTime?.millisecondsSinceEpoch ?? 0}',
      title: remote.notification?.title,
      body: remote.notification?.body,
      data: data,
    );
  }
}
