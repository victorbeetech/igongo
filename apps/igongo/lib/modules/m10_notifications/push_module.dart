// Wires the push notification parts together. The rest of the app uses only
// this file: `PushModule.initialise()` once in main(), then `start` after
// sign-in and `stop` at sign-out (Users & Login calls these in Phase 7).
//
// If this build has no Firebase settings yet, every call quietly does nothing
// and reports `PushStartResult.notConfigured`, so the app never breaks.

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

import 'application/ports/device_token_api.dart';
import 'application/push_state.dart';
import 'application/use_cases/start_push.dart';
import 'application/use_cases/stop_push.dart';
import 'domain/push_message.dart';
import 'domain/push_start_result.dart';
import 'infrastructure/background_push_handler.dart';
import 'infrastructure/firebase_config.dart';
import 'infrastructure/firebase_push_gateway.dart';
import 'infrastructure/plugin_local_notifier.dart';

/// The app's entry point to push notifications.
class PushModule {
  PushModule._(this._gateway);

  /// The module for this run, set by [initialise].
  static PushModule? instance;

  /// Null when this build has no Firebase settings.
  final FirebasePushGateway? _gateway;
  final _state = PushState();

  /// True when this build can receive pushes.
  bool get isConfigured => _gateway != null;

  /// Starts Firebase if this build has settings. Call once, before runApp().
  /// It never throws: a Firebase problem leaves push off, not the app down.
  static Future<PushModule> initialise() async {
    final options = FirebaseConfig.current();
    FirebasePushGateway? gateway;
    if (options != null) {
      try {
        await Firebase.initializeApp(options: options);
        FirebaseMessaging.onBackgroundMessage(handleBackgroundPush);
        gateway = FirebasePushGateway();
      } on Object {
        gateway = null;
      }
    }
    return instance = PushModule._(gateway);
  }

  /// Switches push on for the signed-in person. See `StartPush.call` for the
  /// meaning of [explainFirst], [onOpen] and [onMessage].
  Future<PushStartResult> start({
    required DeviceTokenApi api,
    required Future<bool> Function() explainFirst,
    required void Function(PushMessage) onOpen,
    void Function(PushMessage)? onMessage,
  }) async {
    final gateway = _gateway;
    if (gateway == null) return PushStartResult.notConfigured;
    final useCase = StartPush(gateway: gateway, api: api, notifier: PluginLocalNotifier(), state: _state);
    return useCase(explainFirst: explainFirst, onOpen: onOpen, onMessage: onMessage);
  }

  /// Switches push off at sign-out.
  Future<void> stop({required DeviceTokenApi api}) async {
    final gateway = _gateway;
    if (gateway == null) return;
    await StopPush(gateway: gateway, api: api, state: _state)();
  }
}
