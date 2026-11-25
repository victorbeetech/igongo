// Use case: switch push notifications on for the person who just signed in.
//
// Called by Users & Login after every sign-in and at every app start with a
// saved session. Safe to call again: it first stops the old listeners.

import 'dart:async';

import '../../domain/device_registration.dart';
import '../../domain/push_channel.dart';
import '../../domain/push_message.dart';
import '../../domain/push_start_result.dart';
import '../ports/device_token_api.dart';
import '../ports/local_notifier.dart';
import '../ports/push_gateway.dart';
import '../push_state.dart';

/// Asks for permission, registers the token, joins the topics and listens.
class StartPush {
  /// Creates the use case from its ports and the shared [state].
  const StartPush({required this.gateway, required this.api, required this.notifier, required this.state});

  /// The phone's push service.
  final PushGateway gateway;

  /// The API's device token endpoints.
  final DeviceTokenApi api;

  /// Draws notifications while the app is open (Android).
  final LocalNotifier notifier;

  /// What push is doing now, shared with `StopPush`.
  final PushState state;

  /// Runs the use case.
  ///
  /// [explainFirst] shows the app's own "Allow notifications" explainer and
  /// returns true if the person wants to continue. It is only called the first
  /// time, before the phone's own question, because iOS asks only once.
  /// [onOpen] gets every push the person taps, to open its screen.
  /// [onMessage] gets every push that arrives while the app is open, so the
  /// inbox and badges can refresh.
  ///
  /// Returns [PushStartResult.started], or why push could not start. It never
  /// throws: a push problem must never stop the person using the app.
  Future<PushStartResult> call({
    required Future<bool> Function() explainFirst,
    required void Function(PushMessage) onOpen,
    void Function(PushMessage)? onMessage,
  }) async {
    try {
      // 1. Start clean, in case push was already on for an earlier session.
      await state.cancelListeners();

      // 2. Permission: explain first, then let the phone ask.
      if (!await _hasPermission(explainFirst)) return PushStartResult.permissionDenied;

      // 3. Create the Android channels and listen for taps on our own banners.
      await notifier.initialise(channels: PushChannel.all, onTap: onOpen);

      // 4. Get the token and save it on the API, then join its topics.
      final token = await gateway.token();
      if (token == null) return PushStartResult.failed;
      await _register(token);

      // 5. Listen for new tokens, open-app pushes and taps.
      _listen(onOpen: onOpen, onMessage: onMessage);

      // 6. The app may have been started by a tap on a push.
      final launch = await gateway.launchMessage();
      if (launch != null) onOpen(launch);
      return PushStartResult.started;
    } on Object {
      // No network, API down or a push service error: try again next start.
      return PushStartResult.failed;
    }
  }

  /// True when pushes may be shown, asking only if the person never answered.
  Future<bool> _hasPermission(Future<bool> Function() explainFirst) async {
    final current = await gateway.permission();
    if (current.allowsPush) return true;
    if (!current.isUndecided || !await explainFirst()) return false;
    return (await gateway.requestPermission()).allowsPush;
  }

  /// Saves [token] on the API and makes the joined topics match its answer.
  Future<void> _register(String token) async {
    final registration = await api.register(token: token, platform: gateway.platform);
    state.token = token;
    await _syncTopics(registration);
  }

  /// Joins the topics the API listed and leaves any the API no longer lists,
  /// such as `staff` after a person stops being staff.
  Future<void> _syncTopics(DeviceRegistration registration) async {
    final wanted = registration.topics.toSet();
    for (final topic in wanted.difference(state.topics)) {
      await gateway.subscribe(topic);
    }
    for (final topic in state.topics.difference(wanted)) {
      await gateway.unsubscribe(topic);
    }
    state.topics
      ..clear()
      ..addAll(wanted);
  }

  /// Starts the listeners and keeps them in [state] so `StopPush` can end them.
  void _listen({required void Function(PushMessage) onOpen, void Function(PushMessage)? onMessage}) {
    state.listeners.addAll([
      // A new token replaces the old one on the API.
      gateway.tokenRefreshes.listen((token) => unawaited(_register(token).catchError((Object _) {}))),
      // A push while the app is open: show it ourselves where the phone won't.
      gateway.foregroundMessages.listen((message) {
        if (!gateway.showsForegroundNotifications) unawaited(notifier.show(message));
        onMessage?.call(message);
      }),
      // A tap on a push while the app was in the background.
      gateway.openedMessages.listen(onOpen),
    ]);
  }
}
