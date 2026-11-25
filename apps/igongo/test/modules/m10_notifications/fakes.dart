// Fake push service, API and local notifier, so the push use cases are tested
// with no Firebase, no network and no phone.

import 'dart:async';

import 'package:igongo/modules/m10_notifications/application/ports/device_token_api.dart';
import 'package:igongo/modules/m10_notifications/application/ports/local_notifier.dart';
import 'package:igongo/modules/m10_notifications/application/ports/push_gateway.dart';
import 'package:igongo/modules/m10_notifications/domain/device_registration.dart';
import 'package:igongo/modules/m10_notifications/domain/push_channel.dart';
import 'package:igongo/modules/m10_notifications/domain/push_message.dart';
import 'package:igongo/modules/m10_notifications/domain/push_permission.dart';
import 'package:igongo/modules/m10_notifications/domain/push_platform.dart';

/// A push service that records every call.
class FakePushGateway implements PushGateway {
  /// The permission the phone reports, and what it answers when asked.
  PushPermission current = PushPermission.notDetermined;

  /// What the phone answers when asked.
  PushPermission answer = PushPermission.granted;

  /// The token the phone gives.
  String? deviceToken = 'token-1';

  /// The push that started the app, if any.
  PushMessage? launch;

  /// Whether the phone draws its own banners in the foreground.
  bool systemBanners = false;

  /// Calls made, in order, such as `subscribe:all`.
  final calls = <String>[];

  /// Streams the test can push into.
  final refreshes = StreamController<String>.broadcast();

  /// Foreground pushes.
  final foreground = StreamController<PushMessage>.broadcast();

  /// Tapped pushes.
  final opened = StreamController<PushMessage>.broadcast();

  @override
  PushPlatform get platform => PushPlatform.android;
  @override
  bool get showsForegroundNotifications => systemBanners;
  @override
  Future<PushPermission> permission() async => current;
  @override
  Future<PushPermission> requestPermission() async {
    calls.add('request');
    return current = answer;
  }

  @override
  Future<String?> token() async => deviceToken;
  @override
  Stream<String> get tokenRefreshes => refreshes.stream;
  @override
  Future<void> deleteToken() async => calls.add('deleteToken');
  @override
  Future<void> subscribe(String topic) async => calls.add('subscribe:$topic');
  @override
  Future<void> unsubscribe(String topic) async => calls.add('unsubscribe:$topic');
  @override
  Stream<PushMessage> get foregroundMessages => foreground.stream;
  @override
  Stream<PushMessage> get openedMessages => opened.stream;
  @override
  Future<PushMessage?> launchMessage() async => launch;
}

/// An API that records registrations and answers with [topics].
class FakeDeviceTokenApi implements DeviceTokenApi {
  /// The topics the API answers with.
  List<String> topics = ['all', 'staff'];

  /// When true, every call throws, as if offline.
  bool offline = false;

  /// Tokens registered and removed, in order.
  final registered = <String>[], removed = <String>[];

  @override
  Future<DeviceRegistration> register({required String token, required PushPlatform platform}) async {
    if (offline) throw StateError('offline');
    registered.add(token);
    return DeviceRegistration(topics: topics);
  }

  @override
  Future<void> remove(String token) async {
    if (offline) throw StateError('offline');
    removed.add(token);
  }
}

/// A notifier that records what it was asked to show.
class FakeLocalNotifier implements LocalNotifier {
  /// Messages shown.
  final shown = <PushMessage>[];

  /// The channels created.
  List<PushChannel> channels = [];

  @override
  Future<void> initialise({required List<PushChannel> channels, required void Function(PushMessage) onTap}) async =>
      this.channels = channels;

  @override
  Future<void> show(PushMessage message) async => shown.add(message);
}

/// A sample push from the API.
const samplePush = PushMessage(id: 'n1', title: 'New task', body: 'Clean room 12', channelId: 'work', link: '/tasks/1');
