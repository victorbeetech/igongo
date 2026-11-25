// Use case: switch push notifications off at sign-out, so the next person who
// signs in on this phone never sees the last person's notifications.

import '../ports/device_token_api.dart';
import '../ports/push_gateway.dart';
import '../push_state.dart';

/// Removes the token from the API and the phone, and leaves every topic.
class StopPush {
  /// Creates the use case from its ports and the shared [state].
  const StopPush({required this.gateway, required this.api, required this.state});

  /// The phone's push service.
  final PushGateway gateway;

  /// The API's device token endpoints.
  final DeviceTokenApi api;

  /// What push is doing now, shared with `StartPush`.
  final PushState state;

  /// Runs the use case. It never throws: sign-out must always finish.
  Future<void> call() async {
    // 1. Stop listening first, so nothing new arrives during sign-out.
    await state.cancelListeners();

    // 2. Tell the API to forget this token. If the API can't be reached, the
    //    next send to the deleted token fails and the API removes it then.
    final token = state.token;
    if (token != null) {
      try {
        await api.remove(token);
      } on Object {
        // Ignored on purpose, see above.
      }
    }

    // 3. Delete the token on the phone. This also leaves every topic, because
    //    topics belong to the token.
    try {
      await gateway.deleteToken();
    } on Object {
      // The phone may be offline; the old token dies with the next send.
    }
    state
      ..token = null
      ..topics.clear();
  }
}
