// What push notifications are doing right now on this phone: the token sent
// to the API, the topics joined and the open listeners. Shared by the start
// and stop use cases so that stopping undoes exactly what starting did.

import 'dart:async';

/// The live push state for the signed-in person.
class PushState {
  /// The token last registered on the API, or null when push is off.
  String? token;

  /// The broadcast topics this phone has joined.
  final Set<String> topics = {};

  /// The stream listeners started by `StartPush`.
  final List<StreamSubscription<Object?>> listeners = [];

  /// Stops every listener. Safe to call more than once.
  Future<void> cancelListeners() async {
    for (final listener in listeners) {
      await listener.cancel();
    }
    listeners.clear();
  }
}
