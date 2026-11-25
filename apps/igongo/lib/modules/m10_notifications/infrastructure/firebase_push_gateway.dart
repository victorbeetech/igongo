// The real push service: Firebase Cloud Messaging, behind the `PushGateway`
// port. Only this file and the background handler call Firebase Messaging.

import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';

import '../application/ports/push_gateway.dart';
import '../domain/push_message.dart';
import '../domain/push_permission.dart';
import '../domain/push_platform.dart';
import 'push_message_mapper.dart';

/// `PushGateway` on Firebase Cloud Messaging. Create it only after
/// `Firebase.initializeApp` has run (see `PushModule.initialise`).
class FirebasePushGateway implements PushGateway {
  /// Creates the gateway on the default Firebase app.
  FirebasePushGateway() : _messaging = FirebaseMessaging.instance;

  final FirebaseMessaging _messaging;

  @override
  PushPlatform get platform => defaultTargetPlatform == TargetPlatform.iOS ? PushPlatform.ios : PushPlatform.android;

  @override
  bool get showsForegroundNotifications => platform == PushPlatform.ios;

  @override
  Future<PushPermission> permission() async => _map((await _messaging.getNotificationSettings()).authorizationStatus);

  @override
  Future<PushPermission> requestPermission() async {
    final settings = await _messaging.requestPermission();
    // On iOS, let the phone show banners while the app is open, like Android
    // does through our own local notifications.
    await _messaging.setForegroundNotificationPresentationOptions(alert: true, badge: true, sound: true);
    return _map(settings.authorizationStatus);
  }

  // Why the "deprecated" token calls: firebase_messaging 17 adds a newer
  // register()/onRegistered flow that returns a Firebase Installation ID for
  // "direct send". The FCM HTTP v1 send API the Igongo API uses is documented
  // for registration tokens, which still work. Move both sides together once
  // direct send is documented for HTTP v1 (noted in docs/BUILD-CHECKLIST.md).

  @override
  // ignore: deprecated_member_use
  Future<String?> token() => _messaging.getToken();

  @override
  // ignore: deprecated_member_use
  Stream<String> get tokenRefreshes => _messaging.onTokenRefresh;

  @override
  // ignore: deprecated_member_use
  Future<void> deleteToken() => _messaging.deleteToken();

  @override
  Future<void> subscribe(String topic) => _messaging.subscribeToTopic(topic);

  @override
  Future<void> unsubscribe(String topic) => _messaging.unsubscribeFromTopic(topic);

  @override
  Stream<PushMessage> get foregroundMessages => FirebaseMessaging.onMessage.map(PushMessageMapper.fromRemote);

  @override
  Stream<PushMessage> get openedMessages => FirebaseMessaging.onMessageOpenedApp.map(PushMessageMapper.fromRemote);

  @override
  Future<PushMessage?> launchMessage() async {
    final remote = await _messaging.getInitialMessage();
    return remote == null ? null : PushMessageMapper.fromRemote(remote);
  }

  /// Maps Firebase's permission answer to the app's own.
  static PushPermission _map(AuthorizationStatus status) => switch (status) {
    AuthorizationStatus.authorized => PushPermission.granted,
    AuthorizationStatus.provisional => PushPermission.provisional,
    AuthorizationStatus.denied || AuthorizationStatus.deniedPermanently => PushPermission.denied,
    AuthorizationStatus.notDetermined => PushPermission.notDetermined,
  };
}
