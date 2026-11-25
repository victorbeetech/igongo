// The port to the phone's push service (Firebase Cloud Messaging in
// production, a fake in tests). The use cases only talk to this interface, so
// they can be tested with no Firebase at all.

import '../../domain/push_message.dart';
import '../../domain/push_permission.dart';
import '../../domain/push_platform.dart';

/// Everything the app needs from a push service.
abstract interface class PushGateway {
  /// The platform this phone runs, sent to the API with the token.
  PushPlatform get platform;

  /// True when the phone itself shows notifications while the app is open
  /// (iOS). When false (Android), the app shows them with `LocalNotifier`.
  bool get showsForegroundNotifications;

  /// The current permission, without asking.
  Future<PushPermission> permission();

  /// Asks the phone for permission and returns the answer.
  Future<PushPermission> requestPermission();

  /// The device token, or null when the push service cannot give one yet.
  Future<String?> token();

  /// New tokens, when the push service replaces the old one.
  Stream<String> get tokenRefreshes;

  /// Removes the token, so this phone gets no more pushes (used at sign-out).
  Future<void> deleteToken();

  /// Joins a broadcast topic.
  Future<void> subscribe(String topic);

  /// Leaves a broadcast topic.
  Future<void> unsubscribe(String topic);

  /// Pushes that arrive while the app is open.
  Stream<PushMessage> get foregroundMessages;

  /// Pushes the person tapped while the app was in the background.
  Stream<PushMessage> get openedMessages;

  /// The push the person tapped to start the app from closed, if any.
  Future<PushMessage?> launchMessage();
}
