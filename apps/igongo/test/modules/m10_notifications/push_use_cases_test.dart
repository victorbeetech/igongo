// Tests for switching push on and off (StartPush and StopPush) with fakes.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/modules/m10_notifications/application/push_state.dart';
import 'package:igongo/modules/m10_notifications/application/use_cases/start_push.dart';
import 'package:igongo/modules/m10_notifications/application/use_cases/stop_push.dart';
import 'package:igongo/modules/m10_notifications/domain/push_channel.dart';
import 'package:igongo/modules/m10_notifications/domain/push_message.dart';
import 'package:igongo/modules/m10_notifications/domain/push_permission.dart';
import 'package:igongo/modules/m10_notifications/domain/push_start_result.dart';

import 'fakes.dart';

void main() {
  late FakePushGateway gateway;
  late FakeDeviceTokenApi api;
  late FakeLocalNotifier notifier;
  late PushState state;
  late List<PushMessage> opened;

  setUp(() {
    gateway = FakePushGateway();
    api = FakeDeviceTokenApi();
    notifier = FakeLocalNotifier();
    state = PushState();
    opened = [];
  });

  // Runs StartPush; [explain] is the person's answer to the app's explainer.
  Future<PushStartResult> start({bool explain = true}) => StartPush(
    gateway: gateway,
    api: api,
    notifier: notifier,
    state: state,
  )(explainFirst: () async => explain, onOpen: opened.add);

  test('starts: explains, asks, registers the token and joins the API topics', () async {
    expect(await start(), PushStartResult.started);
    expect(gateway.calls, ['request', 'subscribe:all', 'subscribe:staff']);
    expect(api.registered, ['token-1']);
    expect(notifier.channels, PushChannel.all);
    expect(state.token, 'token-1');
  });

  test('does not ask the phone when the person says not now', () async {
    expect(await start(explain: false), PushStartResult.permissionDenied);
    expect(gateway.calls, isEmpty);
    expect(api.registered, isEmpty);
  });

  test('never asks again once the person refused', () async {
    gateway.current = PushPermission.denied;
    expect(await start(), PushStartResult.permissionDenied);
    expect(gateway.calls, isEmpty);
  });

  test('reports a failure, without throwing, when the API is offline', () async {
    gateway.current = PushPermission.granted;
    api.offline = true;
    expect(await start(), PushStartResult.failed);
  });

  test('reports a failure when the phone gives no token', () async {
    gateway
      ..current = PushPermission.granted
      ..deviceToken = null;
    expect(await start(), PushStartResult.failed);
  });

  test('a second start leaves topics the API no longer lists', () async {
    gateway.current = PushPermission.granted;
    await start();
    api.topics = ['all', 'clients'];
    await start();
    expect(gateway.calls, containsAllInOrder(['subscribe:clients', 'unsubscribe:staff']));
    expect(state.topics, {'all', 'clients'});
  });

  test('shows foreground pushes on Android and opens tapped ones', () async {
    gateway.current = PushPermission.granted;
    await start();
    gateway.foreground.add(samplePush);
    gateway.opened.add(samplePush);
    await pumpEventQueue();
    expect(notifier.shown, [samplePush]);
    expect(opened, [samplePush]);
  });

  test('does not draw a second banner where the phone shows its own (iOS)', () async {
    gateway
      ..current = PushPermission.granted
      ..systemBanners = true;
    await start();
    gateway.foreground.add(samplePush);
    await pumpEventQueue();
    expect(notifier.shown, isEmpty);
  });

  test('opens the push that started the app', () async {
    gateway
      ..current = PushPermission.granted
      ..launch = samplePush;
    await start();
    expect(opened, [samplePush]);
  });

  test('registers a refreshed token', () async {
    gateway.current = PushPermission.granted;
    await start();
    gateway.refreshes.add('token-2');
    await pumpEventQueue();
    expect(api.registered, ['token-1', 'token-2']);
  });

  test('stop removes the token on the API and the phone', () async {
    gateway.current = PushPermission.granted;
    await start();
    await StopPush(gateway: gateway, api: api, state: state)();
    expect(api.removed, ['token-1']);
    expect(gateway.calls.last, 'deleteToken');
    expect(state.token, isNull);
    expect(state.listeners, isEmpty);
  });

  test('stop still finishes when the API is offline', () async {
    gateway.current = PushPermission.granted;
    await start();
    api.offline = true;
    await StopPush(gateway: gateway, api: api, state: state)();
    expect(gateway.calls.last, 'deleteToken');
  });
}
